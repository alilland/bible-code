import path from 'path'
import fs from 'fs'

function run () {
  // get a path to Genesis file
  const genesisFile = path.resolve(__dirname, '../bibles/westminster-leningrad-codex/release/USX_1/GEN.usx')
  // read the file
  const genesisFileContents = fs.readFileSync(genesisFile, 'utf8')

  console.log(genesisFileContents)

  // convert to JSON
  // write JSON to file
  // get a path to Exodus file

}

run()
