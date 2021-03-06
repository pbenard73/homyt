const { spawn, fork } = require('child_process');
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

const runServer = () => {
  const now = Date.now()
  const server = fork('/homyt/bin/www')
  
  server.on('error', error => {
    console.error(error);
  });
  
  server.on('message', msg => {
    if (msg === 'restart') {
      server.kill('SIGKILL');
    }
  })

  server.on('close', (code) => {
    if (now < Date.now() + 60) {
      return runServer()
    }
      
    process.exit(1)
  });
}

runServer()
