const fs = require('fs');

const read = () => {
  const file = 'text.txt';
  const dir = __dirname;
  const readStream = fs.createReadStream(dir+'/'+file);

  readStream.on('data', (chunk) => {
    process.stdout.write(chunk);
  });
};  

read();