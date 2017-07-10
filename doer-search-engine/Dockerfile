FROM ubuntu:16.04
RUN apt-get update
RUN apt-get -y upgrade
RUN apt-get -y  install openjdk-8-jdk 
RUN apt-get -y install ant 
RUN apt-get -y install wget
RUN apt-get -y install cron
RUN cron &

# Add crontab file in the cron directory
ADD ./root /var/spool/cron/crontabs/root

# Give execution rights on the cron job
#RUN chmod 0644 /etc/cron.d/hello-cron

# Create the log file to be able to run tail
#RUN touch /var/log/cron.log

RUN wget "https://archive.apache.org/dist/hbase/hbase-0.94.27/hbase-0.94.27.tar.gz"
RUN tar xvzf hbase-0.94.27.tar.gz

RUN wget "https://github.com/apache/nutch/archive/release-2.3.tar.gz"
RUN tar xvzf release-2.3.tar.gz

RUN wget -qO - https://artifacts.elastic.co/GPG-KEY-elasticsearch | apt-key add -
RUN wget https://download.elastic.co/elasticsearch/elasticsearch/elasticsearch-1.4.2.deb
RUN dpkg -i elasticsearch-1.4.2.deb

RUN mkdir hbase-data
RUN apt-get -y install nano

RUN cd /hbase-0.94.27/conf && rm hbase-env.sh
RUN cd /hbase-0.94.27/conf && rm hbase-site.xml 
RUN cd /nutch-release-2.3/ivy && rm ivy.xml
RUN cd /nutch-release-2.3/conf && rm gora.properties 
RUN cd /etc/elasticsearch && rm elasticsearch.yml

ADD ./hbase/hbase-site.xml /hbase-0.94.27/conf/
ADD ./hbase/hbase-env.sh /hbase-0.94.27/conf/
ADD ./nutch/ivy.xml /nutch-release-2.3/ivy/
ADD ./nutch/gora.properties /nutch-release-2.3/conf/
ADD ./elasticsearch/elasticsearch.yml /etc/elasticsearch/

RUN cd /nutch-release-2.3 && ant clean
RUN cd /nutch-release-2.3 && ant runtime

RUN cd /nutch-release-2.3/runtime/local/conf && rm nutch-site.xml 
RUN cd /nutch-release-2.3/runtime/local/conf && rm hbase-site.xml
RUN cd /nutch-release-2.3/runtime/local/bin && rm crawl

ADD ./nutch/nutch-site.xml /nutch-release-2.3/runtime/local/conf
ADD ./nutch/hbase-site.xml /nutch-release-2.3/runtime/local/conf
ADD ./nutch/crawl /nutch-release-2.3/runtime/local/bin

RUN cd /nutch-release-2.3 && mkdir seed
RUN cd /nutch-release-2.3/seed && touch urls.txt

ENV JAVA_HOME="/usr/lib/jvm/java-8-openjdk-amd64" 
ENV TERM=vt100
ADD ./environment /etc/environment

EXPOSE 80 8000 8080 443 9200 8081 9300

#CMD . /etc/environment

ADD ./run.sh /run.sh
RUN chmod +x /run.sh

CMD ["./run.sh"]




