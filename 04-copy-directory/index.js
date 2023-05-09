const fs = require('fs');
const { copyFile, mkdir } = require('fs/promises');

async function copyDir () {
  const newDir = __dirname + '/files-copy';
  const dir = __dirname + '/files';

  fs.readdir( dir, function ( err, files) {
    if (err || !files.length) {
      console.error('\x1b[31mFiles not found!\x1b[0m');
    } else {
      ensureDirSync(newDir, files);
    }
  });

  async function ensureDirSync (folder, files) {
    await mkdir(folder, {recursive: true});
    await Promise.all(files.map( file  => copyFile (dir + '/' + file, newDir + '/' + file)));
    console.log('\x1b[33mSuccess!\x1b[0m');
  }  
}

copyDir();




