const fs = require('fs')
const Papa = require('papaparse')
const argv = require('minimist')(process.argv.slice(2))
const { splitEvery } = require('ramda')

const INPUT_FILE = argv.input || './results.csv'
const OUTPUT_FILE = argv.output || 'inserts'
const TABLE_NAME = argv.table || 'results'
const SPLIT_EVERY = argv.split || 1000

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
    const create = createTable(fields)
    const rows = splitEvery(SPLIT_EVERY, values)

    fs.writeFile('output/create_table.sql', create, err => {
        if(err) {
            console.error(err)
        }
    })

    rows.map((row, index) => {
        const query = `${row.map(value => createInsert(value)).join('\n')}`

        fs.writeFile(`output/${OUTPUT_FILE}_${index}.sql`, query, err => {
            if(err) {
                console.error(err)
            }
    
            console.log(`SQL generated in output/${OUTPUT_FILE}_${index}.sql`)
        })
    })
})
