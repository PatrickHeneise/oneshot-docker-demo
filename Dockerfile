FROM centos:centos7
MAINTAINER Patrick Heneise <patrick@blended.io>

# Enable EPEL for Node.js
RUN rpm -Uvh http://mirror.uv.es/mirror/fedora-epel/7/x86_64/e/epel-release-7-2.noarch.rpm

# Install Node.js and npm
RUN yum update -y
RUN yum install -y make GraphicsMagick npm

# Bundle app source
COPY . /src

# Install app dependencies
RUN cd /src; npm install

CMD ["node", "/src/app.js"]
