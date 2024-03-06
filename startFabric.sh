#!/bin/bash

set -e
echo "Pass channelName as first argument to call startFabric.sh. e.g ./startFabric.sh abcd"
# Check if an argument is provided
if [ $# -ne 1 ]; then
    echo "Usage: $0 <orgName>"
    exit 1
fi
channelName=$1 
# launch network; create channel and join peer to channel
pushd ./brahma_network
./brahma.sh down
./brahma.sh up createChannel -ca -c $channelName -s couchdb
popd
