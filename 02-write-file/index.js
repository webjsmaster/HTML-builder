const  {createInterface} = require('readline');
const  { EOL, platform} = require('os');
const  fs = require('fs');

const file = 'text.txt';
const dir = __dirname;

const fileName = dir + '/' + file;

let rl = createInterface(process.stdin, process.stdout);
rl.setPrompt('\x1b[36m> \x1b[0m');
rl.prompt();

rl.on('line', async function (args) {
  fs.readFile(fileName, (err) => {
    if (err) {
      fs.open(fileName, 'w', (err) => {
        if (err) throw console.error(err);
        fs.appendFile(fileName, args + '\n', (err) => {
          if(err) throw err;
        });
      });
    } else {
      fs.appendFile(fileName, args + '\n', (err) => {
        if(err) throw err;
      });
    }
  });

  if (args === "exit") {
    exit();
  }

  rl.setPrompt('\x1b[36m> \x1b[0m');
  rl.prompt();
});

rl.on('SIGINT', () => rl.close());

rl.on('close', function () {
  exit('exit');
});


function exit () {
  console.log(EOL, '\x1b[33m Goodbye!\x1b[0m');
  process.exit(0);
}


if (platform() === 'linux') {
  rl.on('SIGTSTP', function () {
    exit();
  });
} else if (platform() === 'win32') {
  rl.on('SIGINT', function () {
    exit();
  });
} else {
  console.log('📢 SORRY!!! ERROR EVENT!!!');
}
