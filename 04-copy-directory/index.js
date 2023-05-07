const fs = require("fs");
const { copyFile, mkdir } = require("fs/promises");

async function copyDir () {
    const newDir = __dirname + "/files-copy";
    const dir = __dirname + "/files";


    fs.readdir( dir, function ( err, files) {
        if (err || !files.length) {
            throw new Error ('FS operation failed');
        } else {
            ensureDirSync(newDir, files);
        }
    })

    async function ensureDirSync (folder, files) {
        try {
            await mkdir(folder);
            await Promise.all(files.map( file  => copyFile (dir + '/' + file, newDir + '/' + file)));
            console.log(`\x1b[33mSuccess!\x1b[0m`);
        } catch (err) {
            await Promise.all(files.map( file  => copyFile (dir + '/' + file, newDir + '/' + file)));
            console.log(`\x1b[33mSuccess!\x1b[0m`);
        }
    }  
}

copyDir();




