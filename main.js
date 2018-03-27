const fs = require('fs')
const Papa = require('papaparse')
const argv = require('minimist')(process.argv.slice(2))

const INPUT_FILE = argv.input || './results.csv'
const OUTPUT_FILE = argv.output || 'schema.sql'
const TABLE_NAME = argv.table || 'results'

const coerceType = item => `'${item.toString().replace(/'/g, '')}'`
const createTable = fields => `CREATE TABLE ${TABLE_NAME} (\n${ fields.map(field => `    ${field} VARCHAR(MAX)`).join(',\n') }\n)`
const createInsert = values => `INSERT INTO ${TABLE_NAME} VALUES (${values.map(coerceType)})`

fs.readFile(INPUT_FILE,  'utf8', (err, data) => {
    if (err) {
        console.error(err)
        process.exit(1)
    }

    const content = Papa.parse(data)
    const fields = content.data[0]
    const values = content.data.slice(1)

    const query = `${createTable(fields)}\n\n${values.map(value => createInsert(value)).join('\n')}`

    fs.writeFile(OUTPUT_FILE, query, err => {
        if(err) {
            console.error(err)
            process.exit(1)
        }

        console.log('All done!')
        console.log(`SQL generated in ${OUTPUT_FILE}`)
    })
})
