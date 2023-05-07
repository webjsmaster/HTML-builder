const path = require ("path");
const fs = require ("fs/promises");
const { stat } = require ("fs");

async function start() {
	try {
		const files = await fs.readdir(
            path.resolve(__dirname + "/" + "secret-folder"), {withFileTypes: true});

        const pathDir =  path.resolve(__dirname + "/" + "secret-folder");

        files.filter( f => f.isFile()).map( f => stat(pathDir + "/" + f.name, ( err, stats) => {
            console.log( f.name.split('.')[0], "-", f.name.split('.')[1], "-", stats.size / 1000 + "kb");
        }));
	} catch (error) {
		console.error('Error', error);
	}
}


start();