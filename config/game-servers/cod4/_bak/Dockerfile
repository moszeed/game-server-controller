FROM debian:latest

ENV COD_DOWNLOAD_URL="http://icculus.org/treefort-offload/cod/cod4-linux-server-06282008.tar.bz2"
ENV COD_PATH=/home/cod4/cod4lnx

# update
RUN dpkg --add-architecture i386 && \ 
    apt-get update && \
    apt-get upgrade -y && \
    apt-get install -y curl bzip2 lib32z1 lib32ncurses5 lib32stdc++6

RUN adduser --disabled-login --shell /bin/bash --gecos "" cod4

USER cod4
RUN mkdir $COD_PATH && cd $COD_PATH
WORKDIR $COD_PATH

USER root
ADD ./gamefiles/ $COD_PATH
RUN curl $COD_DOWNLOAD_URL | tar -xvj --strip 1 -C .
CMD ./cod4_lnxded +set dedicated 1 +sv_pure 1 +exec server.cfg +map_rotate 
RUN chown -R cod4 $COD_PATH

USER cod4
