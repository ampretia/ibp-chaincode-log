#!/usr/bin/env node
const regex = /(\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}(?:\.\d{9})?) \+\d{4} .*? ({.*})/gm;

// process.exit(0);
const fs = require('fs');
const path = require('path');
const lineReader = require('line-reader');
const chalk = require('chalk');

let filename = 'ibp.log';
const parseFile = async (filename) => {
    let fp = path.resolve(filename);
    if (!fs.existsSync(fp)) {
        throw new Error(`File ${fp} does not exist`)
    }
    lineReader.eachLine(fp, (str) => {
        while ((m = regex.exec(str)) !== null) {
            if (m.index === regex.lastIndex) {
                regex.lastIndex++;
            }
           
            let timestamp = new Date(m[1]);
            let data = JSON.parse(m[2]);   
            let name = "";
            if (data.container_name) {
                name = data.container_name.slice(1,21).padEnd(20,' ')
            }

            if (data.log){
                console.log(`[${chalk.blue(timestamp.toISOString())} ${chalk.green(name)}] ${data.log}`);
            } else {
                console.log(`[${timestamp.toISOString()}]`);
            }
            
        }
    });
}

parseFile(filename);

