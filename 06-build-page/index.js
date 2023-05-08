const {mkdir, readdir, rm} = require('fs/promises');
const {join} = require('path');
const {createReadStream, createWriteStream,} = require( 'fs');

const path = require ("path");
const { appendFile, truncate, writeFile, stat } = require ("fs");


async function copyDir  (from, to) {
    const error = new Error('FS operation failed');
    const pathFrom = join(__dirname, from);
    const pathTo = join(__dirname, to);

    try {
        await rm(pathTo, {recursive: true, force: true});
        const objList = await readdir(pathFrom, {withFileTypes: true});
        await mkdir(pathTo, {recursive: true});

        for(const obj of objList) {
        if (obj.isFile()) {
            const readStream  = createReadStream(join(pathFrom, obj.name));
            const writeStream = createWriteStream(join(pathTo, obj.name));
            readStream.on('data', (chunk) => {
                writeStream.write(chunk);
            });
            readStream.on('end', () => {
                writeStream.end();
            });
            readStream.on('error', () => {
                throw error;
            });
            } else if(obj.isDirectory()) {
                await mkdir(join(pathTo, obj.name), {recursive: true});
                await copyDir(join(from, obj.name), join(to, obj.name));
            }
        }
    } catch {
        throw error;
    }
};

async function createBundle() {
	try {
		const files = await readdir(
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


async function build() {
    const folderDestination = 'project-dist';
    const templateFile = 'template.html';
    const from = 'components';
    const to = 'index.html';
    const newDir = __dirname + "/project-dist";


    try {
        await mkdir(newDir, {recursive: true});
        await createBundle();
        await copyDir('assets', 'project-dist/assets');

        new Promise((res) => {
            const readStream = createReadStream(join(__dirname, templateFile), {encoding:'utf-8'});
            let data = '';
            readStream.on('data',(chunk) => {
                data = data + chunk;
            });
            readStream.on('end', () => {
                res(data.trim());
            });
        }).then( async (data) => {
            const pathSource = join(__dirname, from);
            const fileList = await readdir(pathSource);

            for (let key in fileList) {
            const templateFile = fileList[key];

            let component = '';
            const readStream = createReadStream(join(pathSource, templateFile));
            const writeStream = createWriteStream(join(__dirname, folderDestination, to));

            readStream.on('data', (chunk) => {
                component += chunk;
            });

            readStream.on('end', () => {
                data = data.replace(`{{${templateFile.split('.')[0]}}}`, component);
                readStream.close();
            });

            readStream.on('close', () => {
                writeStream.write(data);
            });
            }
        });
    } catch (e) {
        console.log(e);
    }
};

build();




