#!/bin/bash

# Start the first process
./hbase-0.94.27/bin/start-hbase.sh && chown -R root:root /hbase-data
status=$?
if [ $status -ne 0 ]; then
  echo "Failed to start hbase: $status"
  exit $status
fi

# Start the second process
service elasticsearch start && chown -R elasticsearch:elasticsearch /var/lib/elasticsearch/
status=$?
if [ $status -ne 0 ]; then
  echo "Failed to start elasticsearch: $status"
  exit $status
fi

#Start the third process
cron &
if [ $status -ne 0 ]; then
  echo "Failed to start cron: $status"
  exit $status
fi
while /bin/true; do

SERVICE2=elasticsearch
SERVICE1=hbase
  if ps ax | grep -v grep | grep $SERVICE1 > /dev/null ; then
    
	echo "Hbase running."
  else
	echo "Hbase exited."	
  fi

  if ps ax | grep -v grep | grep $SERVICE2 > /dev/null ; then
     
	echo "Elasticsearch running."
  else
	echo "Elasticsearch exited"	
  fi
 
  sleep 10
  
done
# Naive check runs checks once every 5 minutes to see if either of the processes exited.
# This illustrates part of the heavy lifting you need to do if you want to run
# more than one service in a container. The container will exit with an error
# if it detects that either of the processes has exited.
# Otherwise it will loop forever, waking up every 60 seconds
  

#while /bin/true; do
#  SERVICE1=elasticsearch
#  SERVICE2=hbase
#  if ps ax | grep -v grep | grep $SERVICE1 > /dev/null ; then
#     echo "Elasticsearch exited."
#     exit -1
#  fi
#  if ps ax | grep -v grep | grep $SERVICE2 > /dev/null ; then
#     echo "HBase exited."
#     exit -1
#  fi
#  sleep 30
#  #PROCESS_1_STATUS=$(ps aux |grep -q hbase |grep -v grep)
#  #PROCESS_2_STATUS=$(ps aux |grep -q elasticsearch | grep -v grep)
#  ## If the greps above find anything, they will exit with 0 status
#  ## If they are not both 0, then something is wrong
#  #if [ $PROCESS_1_STATUS -ne 0 -o $PROCESS_2_STATUS -ne 0 ]; then
#  #  echo "One of the processes has already exited."
#  #  exit -1
#  #fi
#  #sleep 60
#done
