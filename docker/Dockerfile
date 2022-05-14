FROM ubuntu:18.04
ENV IS_DOCKER=isdocker
ENV DEBIAN_FRONTEND noninteractive
ARG DEBIAN_FRONTEND=noninteractive
COPY silence.ogg /usr/share/icecast/silence.ogg
COPY icecast.xml /usr/share/icecast/icecast.xml
RUN apt-get update
RUN apt-get install apt-utils -y
RUN apt-get install curl git wget dirmngr ffmpeg apt-transport-https lsb-release ca-certificates gcc g++ make zsh -y
RUN apt-get install alsa-utils pulseaudio mpd nginx-full -y -q
COPY mpd.conf /etc/mpd.conf
RUN apt install icecast2 -y -qq
RUN apt-get install vim zsh -y
RUN sh -c "$(curl -fsSL https://raw.github.com/ohmyzsh/ohmyzsh/master/tools/install.sh)" -y
RUN curl -sL https://deb.nodesource.com/setup_14.x | bash -
RUN apt-get install nodejs -y
RUN npm install -g npm
RUN curl -L https://github.com/yt-dlp/yt-dlp/releases/latest/download/yt-dlp -o /usr/local/bin/yt-dlp
RUN chmod a+rx /usr/local/bin/yt-dlp
RUN git clone https://github.com/pbenard73/homyt  && cd homyt && npm install --production
RUN useradd -rm -d /home/icecast -s /bin/bash -g root -G icecast -u 1001 icecast
RUN mkdir -p /var/lib/mpd/music \
    && mkdir -p /var/lib/mpd/playlists \
    && mkdir -p /var/lib/mpd/database \
    && touch /var/lib/mpd/database/tag_cache \
    && touch /var/log/mpd/mpd.log \
    && chown -R mpd:audio /var/lib/mpd \
    && chown -R mpd:audio /var/log/mpd/mpd.log \
    && mkdir -p /var/log/icecast \
    && chown -R icecast:icecast /usr/share/icecast \
    && chown -R icecast:icecast /var/log/icecast

COPY docker.js /docker.js
COPY nginx_default /etc/nginx/sites-available/default
COPY error_40x.html /usr/share/nginx/html/error_40x.html
EXPOSE 80
CMD nginx && mpd && node docker.js
