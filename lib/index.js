
const regex = /(\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}(?:\.\d{9})?) \+\d{4} .*? ({.*})/gm;

// process.exit(0);
const fs = require('fs');
const path = require('path');
const lineReader = require('line-reader');
const chalk = require('chalk');

class CCLogParser {

    // set the filename
    constructor(filename) {
        this.fp = path.resolve(filename);
        if (!fs.existsSync(this.fp)) {
            throw new Error(`File ${this.fp} does not exist`)
        }
    }

    // start the parsing off
    async parseFile() {

        lineReader.eachLine(this.fp, this.parseLine);
    }

    parseLine(str) {
        let m;
        while ((m = regex.exec(str)) !== null) {
            // This is necessary to avoid infinite loops with zero-width matches
            if (m.index === regex.lastIndex) {
                regex.lastIndex++;
            }

            let timestamp = new Date(m[1]);
            let data = JSON.parse(m[2]);

            // grab the container name, slice it down a bit!
            let name = "";
            if (data.container_name) {
                name = data.container_name.slice(1, 21).padEnd(20, ' ')
            }

            if (data.log) {
                console.log(`[${chalk.blue(timestamp.toISOString())} ${chalk.green(name)}] ${data.log}`);
            } else {
                console.log(`[${chalk.blue(timestamp.toISOString())} ${chalk.green(name)}]`);
            }
        }
    }

}

module.exports = CCLogParser;
