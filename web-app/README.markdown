Search Engine in making
For DOER: Distributed Open Educational Resources


## Installing

You'll also need elasticsearch loaded up and accepting connections on
localhost:9200 and this repo cloned on your machine.

After these are in row,

1. Build the docker file using a command like
docker build --rm -t Doer:1 /path/to/the/repo/

2. Build the docker file for nutch+elasticsearch and run its container

3. Run the container for this image using
docker run -d -p 80:80 -p 444:443 --name=apache doer:1





