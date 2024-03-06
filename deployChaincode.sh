#!/bin/bash

set -e
echo "Pass channelName, contractName, ccnSeq, ccnVersion, as arguments in sequence to call deployChaincode.sh"
channelName=$1
contractName=$2 
ccnSeq="${3:-1}";
ccnVersion="${4:-1}";

echo "Channel Name: $channelName, Contract Name: $contractName, Chaincode Sequence: $ccnSeq, Chaincode Version: $ccnVersion"

 
# don't rewrite paths for Windows Git Bash users
export MSYS_NO_PATHCONV=1
starttime=$(date +%s)
CC_SRC_LANGUAGE="javascript"
CC_SRC_LANGUAGE=`echo "$CC_SRC_LANGUAGE" | tr [:upper:] [:lower:]`

if [ "$CC_SRC_LANGUAGE" = "javascript" ]; then
	CC_SRC_PATH="../chaincode/$contractName/javascript/"
else
	echo The chaincode language ${CC_SRC_LANGUAGE} is not supported by this script
	echo Supported chaincode languages are: go and javascript for this ehr application
	exit 1
fi

# clean out any old identites in the wallets
rm -rf javascript/wallet/*


# launch network; create channel and join peer to channel
pushd ./brahma_network
./brahma.sh deployCC -ccn ${contractName} -ccv ${ccnVersion} -ccs ${ccnSeq} -cci initLedger -ccl ${CC_SRC_LANGUAGE} -ccp ${CC_SRC_PATH} -c ${channelName}
popd
pushd ./$contractName/javascript
# install nodejs packages
npm install
popd
cat <<EOF

Total setup execution time : $(($(date +%s) - starttime)) secs ...

  Then run the following applications to enroll the admin user, and register a new user
  called appUser which will be used by the other applications to interact with the deployed
  genLabReport contract:
    node enrollAdmin
    node registerSubAdmin
    node registerUser

  You can run the invoke application as follows. By default, the invoke application will
  add the Lab Report as per reqd format, but you can update the application to submit other transactions. After updating the Lab Report it will return a key.
  using the same key users can get the data. Key format is userId_datetimeStamp(unix format):
    node invoke
  pass the parameters as per the format mentioned in the invoke.js file.
  You can run the query application as follows passing the key for the required data.you can update the application to evaluate other transactions.
  You can also check if the the user exists or not by passing the userId:
    node query
  pass the parameters as per the format mentioned in the query.js file.


EOF
