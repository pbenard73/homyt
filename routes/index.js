var express = require("express");
var router = express.Router();
const axios = require("axios");
const fs = require("fs");
const path = require("path");
const downloader = require("./../downloader");
const socketManager = require("../socket");
const acl = require("../src/middlewares/acl");
const exceptFiles = [".git", "node_modules"];
const { spawn } = require('child_process')

const loopFile = (rootPath) =>
  fs
    .readdirSync(rootPath, { withFileTypes: true })
    .filter((i) => i.isDirectory() === true && exceptFiles.indexOf(i.name) === -1)
    .map((i) => ({
      name: i.name,
      path: path.join(rootPath, i.name).replace(process.env.MUSIC_FOLDER, ""),
      children: loopFile(path.join(rootPath, i.name)),
    }));

const loopDir = (rootPath) =>
  fs
    .readdirSync(rootPath, { withFileTypes: true })
    .filter((i) => exceptFiles.indexOf(i.name) === -1)
    .map((i) => ({
      name: i.name,
      path: path.join(rootPath, i.name).replace(process.env.MUSIC_FOLDER, ""),
      children: i.isDirectory() === true ? loopDir(path.join(rootPath, i.name)) : undefined,
    }))
    .sort((a, b) => {
      if (a.children !== undefined && b.children === undefined) {
        return -1
      }
      if (b.children !== undefined && a.children === undefined) {
        return 1
      }

      return a.name.toLowerCase() < b.name.toLowerCase() ? -1 : 1
    })
    ;

router.get('/clients', acl('ADMIN'), (req, res, next) => {
  return res.json(socketManager.pool)
})

router.get("/config", acl('ADMIN'), (req, res, next) => {
  const files = loopDir(process.env.MUSIC_FOLDER);
  const radioFiles = fs.readFileSync(path.join(__dirname, `/../data/radio.json`), 'utf8');
  
  const radios = JSON.parse(radioFiles)

  res.json({files, radios: radios.sort((a, b) => a.name.toLowerCase() < b.name.toLowerCase() ? -1 : 1)});
});

router.delete("/deleteFile", acl('ADMIN'), (req, res, next) => {
  const {file} = req.body;
  const filepath = path.join(process.env.MUSIC_FOLDER, file);

  if (fs.existsSync(filepath) === false) {
    return res.json({valid: false})
  }

  fs.unlinkSync(filepath)

  res.json({valid:true});
});

router.post("/readdir", acl('ADMIN'), (req, res, next) => {
  const {folder} = req.body;
  const folderPath = path.join(process.env.MUSIC_FOLDER, folder);

  if (fs.existsSync(folderPath) === false) {
    return res.json({valid: false})
  }

  const files = loopDir(process.env.MUSIC_FOLDER);

  res.json(files);
})

router.post("/moveFile", acl('ADMIN'), async (req, res, next) => {
  const { from, to } = req.body;

  if (from === undefined || to === undefined) {
    return res.json({valid: false})
  }

  const targetFrom = path.join(process.env.MUSIC_FOLDER, from)
  const targetTo = path.join(process.env.MUSIC_FOLDER, to)

  if (fs.existsSync(targetFrom) === false || fs.existsSync(targetTo) === false) {
    return res.json({valid: false});
  }

  fs.renameSync(targetFrom, targetTo)

  res.json({valid: true})
});

router.get('/listen', (req, res) => {
  const {url, radio} = req.query

  if (radio === 'true') {
    return res.redirect(url)
  }

  const filePath = path.join(process.env.MUSIC_FOLDER, url)

  if (fs.existsSync(filePath) === true) {
    return res.sendFile(filePath)
  }

  res.status(400).json({valid:false})

})

router.post("/download", acl('ADMIN'), async (req, res, next) => {
  const { url, folder } = req.body;
  console.log(process.env, path.join(process.env.MUSIC_FOLDER, folder));
  downloader.run(url, path.join(process.env.MUSIC_FOLDER, folder));

  res.json({ valid: true });
});

router.post('/addradio', acl('ADMIN'), async (req, res, next) => {
  const {path:givenPath, name} = req.body

  if (typeof name !== 'string' || typeof givenPath !== 'string' || givenPath.trim() === '' || name.trim() === '') {
    return res.json({valid: false})
  }
const radioFileUrl = path.join(__dirname, `/../data/radio.json`);
  const radioFiles = fs.readFileSync(radioFileUrl, 'utf8'); 
  let radios = []
  
  try {
    radios = JSON.parse(radioFiles)
    if (Array.isArray(radios) === false) {
      radios = []
    }
  } catch(e) {

  }

  radios.push({name, path: givenPath})

  fs.writeFileSync(radioFileUrl, JSON.stringify(radios, null, 4))

  const files = loopDir(process.env.MUSIC_FOLDER);

  res.json({files, radios});
})

router.post("/search/:query", acl('ADMIN'), async (req, res, next) => {
  const { query } = req.params;

  try {
    const { data } = await axios.get(
      `https://youtube.googleapis.com/youtube/v3/search?part=snippet&maxResults=15&q=${encodeURIComponent(
        query
      )}&order=viewCount&type=video&key=${process.env.API_KEY}`
    );

    res.json(data);
  } catch (e) {
    console.log(e);
    res.status(500).json({});
  }
});

router.post('/update', acl('ADMIN'), (req, res) => {
  console.log('UPDATE')
 // const update = spawn('git', ['remote', '-v'], {cwd: `${__dirname}/../`})
  const update = spawn('git', ['rebase', 'dev'], {cwd: `${__dirname}/../`})

  update.stdout.on("data", (data) => {    
    console.log(`git: ${data}`);
  });

  update.stderr.on('data', (data) => {
    console.error(`stderr: ${data}`);
  });

  update.on('close', code => {
    res.json({valid: code === 0})

    if (code !== 0) {
      return
    }    

    const npmInstall = spawn('npm', ['install'], {cwd: `${__dirname}/../`})

    npmInstall.stdout.on("data", (data) => {    
      console.log(`npm: ${data}`);
    });

    npmInstall.on('close', installCode => {
      if (installCode === 0) {
        socketManager.emit('update', {})

        setTimeout(() => {
          process.exit(7895)
        }, 2000);
      }
    })
  })
})

module.exports = router;
