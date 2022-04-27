const { spawn } = require('child_process');
const icecast = spawn('su', ['icecast', '-c', "'icecast2 -c /usr/share/icecast/icecast.xml -b &'"], {shell: true});

icecast.stdout.on('data', (data) => {
  console.log(`stdout: ${data}`);
});

icecast.stderr.on('data', (data) => {
  console.error(`stderr: ${data}`);
});

icecast.on('close', (code) => {
    console.log('icecast close')
   // process.exit(1)
});


const server = spawn('node', ['/homyt/bin/www'])

server.stdout.on('data', (data) => {
    console.log(`stdout: ${data}`);
});

server.stderr.on('data', (data) => {
    console.error(`stderr: ${data}`);
});

server.on('close', (code) => {
    process.exit(1)
});