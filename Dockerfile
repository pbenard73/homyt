FROM ubuntu:18.04
ENV IS_DOCKER=isdocker
RUN apt-get update
RUN apt-get install apt-utils -y
RUN apt-get install curl git wget dirmngr ffmpeg apt-transport-https lsb-release ca-certificates gcc g++ make zsh -y
RUN apt-get install zsh -y
RUN chsh -s /bin/zsh
RUN sh -c "$(curl -fsSL https://raw.github.com/ohmyzsh/ohmyzsh/master/tools/install.sh)" -y
RUN curl -sL https://deb.nodesource.com/setup_14.x | bash -
RUN apt-get install nodejs -y
RUN npm install -g npm
RUN npm install -g pm2
RUN curl -L https://github.com/yt-dlp/yt-dlp/releases/latest/download/yt-dlp -o /usr/local/bin/yt-dlp
RUN chmod a+rx /usr/local/bin/yt-dlp
RUN git clone https://github.com/pbenard73/homyt  && cd homyt && npm install
EXPOSE 3000
CMD node homyt/bin/www
