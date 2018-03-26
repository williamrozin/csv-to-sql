## CSV to SQL

Converts an CSV to a SQL script


## Installation

Simply clone this repo and run `yarn`

> git clone https://github.com/williamrozin/csv-to-sql.git

> cd csv-to-sql

> yarn


## Usage

> yarn start --input [YOUR CSV PATH HERE]


## API
See below the allowed parameters


Option | Default | Description
--- |  --- | ---
`--input`   | `./results.csv` | Input path of the CSV file
`--output`   | `schema.sql` | Ouput path of the SQL file
`--table`   | `results` | Table name
