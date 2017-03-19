FROM debian:latest
MAINTAINER Matthew Consterdine
EXPOSE 80
RUN export DEBIAN_FRONTEND=noninteractive
RUN apt-get update -y && apt-get upgrade -y
RUN apt-get install make gcc locales curl nginx pdftk libreoffice node npm -y
RUN locale-gen en_US en_US.UTF-8
RUN curl https://install.meteor.com/ | sh
RUN mkdir /project
ADD project /project/meteor
RUN mkdir /project/uploads
ADD uploads.html /project/uploads/index.html
COPY nginx.config /etc/nginx/sites-enabled/default
ADD startup.sh /startup.sh
RUN chmod +x /startup.sh
ENTRYPOINT /startup.sh > /project/output.log 2> /project/error.log