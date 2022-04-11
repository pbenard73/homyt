# Homyt

Youtube video converter for music server

## Requirements

### Youtube-dlp

[installation](https://github.com/yt-dlp/yt-dlp)

### ffmpeg

`sudo apt-get install ffmpeg`

## Environment Variables

* *REACT_APP_API* Url of webservice API (empty string for prod)
* *MUSIC_FOLDER* Music folder path on the server
* *API_KEY* Youtube Api ApiKey


## Docker 

```
git clone https://github.com/pbenard73/homyt
cd homyt
docker build -t homyt .
docker run -e MUSIC_FOLDER=/music -e API_KEY=my_api_key -v /my/music/directory:/music -p 3066:3000 homyt
```