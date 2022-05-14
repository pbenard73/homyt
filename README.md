# Homyt

Youtube video converter for music server

## Docker  Installation

```
git clone https://github.com/pbenard73/homyt
cd homyt/docker
docker build -t homyt .
docker run -e MUSIC_FOLDER=/music -e API_KEY=MY_API_KEY -v /my/music/directory:/music --privileged -p 3066:80 -p 3068:6600 --name homyt homyt
```

![Homyt screenshot](https://github.com/pbenard73/homyt/raw/master/screenshot.jpg)

