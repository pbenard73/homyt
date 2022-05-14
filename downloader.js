const { spawn } = require("child_process");
const mpdManager = require("./managers/mpd");
const socket = require("./socket");

class Downloader {
  #baseCmd = ["--extract-audio", "--add-metadata", "--audio-format", "mp3"];

  run(url, folder) {
    return new Promise((resolve) => {
      socket?.emit?.("reset", null);
      const cmd = spawn("yt-dlp", [...this.#baseCmd, "-o", `${folder}/%(title)s.%(ext)s`, url]);

      cmd.stdout.on("data", (data) => {
        socket?.emit?.("msg", data.toString());
        console.log(`stdout: ${data}`);
      });

      cmd.on("close", (code) => {
        console.log(`child process exited with code ${code}`);
        socket?.emit?.("end", { valid: code === 0 });

        if (code === 0) {
          mpdManager.database({body: {refresh: true}})
        }

        resolve(code);
      });
    });
  }
}

const downloader = new Downloader();

module.exports = downloader;
