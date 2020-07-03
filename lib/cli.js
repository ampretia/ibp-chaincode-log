#!/usr/bin/env node
const path = require('path');
const CCLogParse = require('./index');
const { magentaBright } = require('chalk');
const version = require(path.resolve(__dirname,'..','package.json')).version;


const params = require('yargs')
  .help()
  .wrap(null)
  .alias('v','version')
  .version(`ibpccl v${version}`)
  .describe('v', 'show version information')
  .options( {
    'f' : { alias:'file', description:'IBP Log file to parse', type:'string',demandOption:true,requiresArg:true }
  })
  .usage('$0 --file filename')
  .help()
  .strict()
  .epilog("For usage see https://github.com/ampretia/ibp-chaincode-log")
  .argv;

const  main = async(params) => {
  try {
    let ccp = new CCLogParse(params['file']);
    await ccp.parseFile() 
  } catch (e) {
    console.error("Unable to parse: " + e.message);
    
  }
}  

main(params);
