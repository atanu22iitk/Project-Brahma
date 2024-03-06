#!/bin/bash
echo "Pass channelName as first argument to call addOrg.sh. e.g ./addOrg.sh abcd"
channelName=$1
pushd ./brahma_network/addOrg3
./addOrg3.sh up -ca -c $channelName -s couchdb
popd