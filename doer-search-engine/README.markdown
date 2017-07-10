Info
----

This guide sets up a pre configured Nutch crawler, integrated with elasticsearch index on the same container.

Versions
----

OpenJDK 8
Nutch 2.3
HBase 0.94.27
Elasticsearch 1.4.2

How to use this image
----

1. Clone the repository to your machine

2. Build the docker file

   docker build --rm -t nut:2 /path/to/repo/ 

3. Run a container with appropriate ports
  
   docker run -d --name=ds3 -p 82:80 -p 8000:8000 -p 8080:8080 -p 9200:9200 nut:2

4. Build docker image for the apache server with the web content and create its container with appropriate ports

5. Enter the container for nutch+elasticsearch image
   
   Following are the directories inside the container root directory 
   * nutch-release-2.3
	runtime/local/conf contains file for configuration
	runtime/local/bin/crawl shell script for crawl command: max number of urls to be crawled per cycle can be changed
	seed directory contains urls.txt which has the seed urls to be crawled
   * hbase-data
	crawldb : can be cleared 
   * hbase-0.94.27
	conf directory contains configuration files
   * /etc/elasticsearch
	contains configuration files

6. Add the seed links for domains to be crawled by editing the urls.txt file in /nutch-release-2.3/seed 
   
   cd /nutch-release-2.3
   nano seed/urls.txt

8. Crawl the seed domains using the nutch crawl command, for this the current directory should be nutch-release-2.3
  
   runtime/local/bin/crawl seed crawlid elastic.server.url=http://localhost:9200/elastic/ depth

	Where crawlid is any number and depth is the number of cycle
	For whole domain to be crawled, use an unusually large number for depth

Storage
----

crawldb: /hbase-data
elasticsearch index: /var/lib/elasticsearch




export TERM=vt100










