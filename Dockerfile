FROM debian:latest
MAINTAINER Matthew Consterdine
EXPOSE 80
EXPOSE 443
RUN export DEBIAN_FRONTEND=noninteractive
RUN apt-get update -y && apt-get upgrade -y
RUN apt-get install locales curl -y
RUN curl -sL https://deb.nodesource.com/setup_6.x | bash -
RUN apt-key adv --keyserver hkp://keyserver.ubuntu.com:80 --recv 0C49F3730359A14518585931BC711F9BA15703C6
RUN echo "deb http://repo.mongodb.org/apt/debian jessie/mongodb-org/3.4 main" | tee /etc/apt/sources.list.d/mongodb-org-3.4.list
RUN apt-get update -y && apt-get upgrade -y
RUN apt-get install nginx pdftk libreoffice nodejs mongodb-org -y
RUN locale-gen en_US en_US.UTF-8
RUN ln /usr/bin/nodejs /usr/sbin/node
RUN mkdir /project
ADD project.tar.gz /project
RUN mkdir /project/uploads
ADD uploads.html /project/uploads/index.html
ADD cert.pem /project/cert.pem
ADD cert.key /project/cert.key
ADD nginx.config /etc/nginx/sites-enabled/default
ADD startup.sh /startup.sh
RUN chmod +x /startup.sh
RUN mkdir -p /data/db
ENTRYPOINT /startup.sh > /project/output.log 2> /project/error.log