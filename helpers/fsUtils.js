const fs = require('fs');
const util = require('util');

//fe.readFile
const readFiles = util.promisify(fs.readFile);

//writes file context to a destination
const writeFiles = (destination, content) =>{
    fs.writeFile(destination, JSON.stringify(content, null, 4), (err) =>
        err? console.error(err) : console.info(`Success! ${destination}`)
    );
}

//Read anf fill content in a file
const readAndFill = (content, file) => {
    fs.readFile(file, 'utf8', (err, data) => {
    if (err) {
        console.error(err);
    } else {
        const fileData = JSON.parse(data);
        fileData.push(content);
        writeFiles(file, fileData);
    }
    });
};

module.exports = {
    readFiles,
    writeFiles,
    readAndFill
};