# Homyt

Youtube video converter for music server

## Docker  Installation

```
git clone https://github.com/pbenard73/homyt
cd homyt/docker
docker build -t homyt .
docker run -e MUSIC_FOLDER=/music -e API_KEY=my_api_key -v /my/music/directory:/music -p 3066:3000 homyt
```