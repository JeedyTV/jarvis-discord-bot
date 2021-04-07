FROM ubuntu:latest
WORKDIR /bot
RUN apt-get -y update
RUN apt-get -y upgrade
RUN apt-get install -y nano 
RUN apt install -y python3-pip
RUN apt-get -y install curl dirmngr apt-transport-https lsb-release ca-certificates
RUN curl -sL https://deb.nodesource.com/setup_12.x | bash -
RUN apt-get -y install nodejs 
COPY . .
RUN pip3 install -r server/requirements.txt
RUN npm install
RUN npm update
RUN npm install pm2@latest -g
CMD node .
