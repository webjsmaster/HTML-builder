const path = require ("path");
const fs = require ("fs/promises");
const { readFile, appendFile, open, truncate, writeFile } = require ("fs");
const { stat } = require ("fs");
const { createReadStream } = require ("fs");


async function start() {
	try {
		const files = await fs.readdir(
            path.resolve(__dirname + "/" + "styles"), {withFileTypes: true});

        const pathDir =  path.resolve(__dirname + "/" + "styles");

        const distDir =  path.resolve(__dirname + "/" + "project-dist");

        const fileName = distDir + "/" + "bundle.css"

        writeFile(fileName, "", { flag: 'wx' }, function (err) {
            if (err) truncate(fileName, () => {});
        });

        files.filter( f => f.isFile()).map( f => stat(pathDir + "/" + f.name, ( err, stats) => {
            if(f.name.split('.')[1] === "css"){
                const readStream = createReadStream(pathDir + "/" + f.name);
                readStream.on('data', (chunk) => {
                    appendFile(fileName, chunk + "\n", (err) => {
                        if(err) console.error('Error', err);
                        
                    })
                    
                });
            }
        }));
        console.log(`\x1b[33m Success!\x1b[0m`);
	} catch (error) {
		console.error('Error', error);
	}
}


start();