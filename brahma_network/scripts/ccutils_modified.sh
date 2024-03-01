#!/bin/bash


# # installChaincode PEER ORG
# function installChaincode() {
#   ORG=$1
#   setGlobals $ORG
#   set -x
#   peer lifecycle chaincode queryinstalled --output json | jq -r 'try (.installed_chaincodes[].package_id)' | grep ^${PACKAGE_ID}$ >&log.txt
#   if test $? -ne 0; then
#     peer lifecycle chaincode install ${CC_NAME}.tar.gz >&log.txt
#     res=$?
#   fi
#   { set +x; } 2>/dev/null
#   cat log.txt
#   verifyResult $res "Chaincode installation on peer0.org${ORG} has failed"
#   successln "Chaincode is installed on peer0.org${ORG}"
# }

# Install chaincode on all peers of an organization
function installChaincode() {
  ORG=$1
  setGlobals $ORG

  # Array of peer addresses
  PEER_ADDRESSES=("peer0.org${ORG}.brahma.com" "peer1.org${ORG}.brahma.com")  # Add more peers if needed

  for PEER_ADDRESS in "${PEER_ADDRESSES[@]}"; do
    set -x
    peer lifecycle chaincode queryinstalled --output json | jq -r 'try (.installed_chaincodes[].package_id)' | grep ^${PACKAGE_ID}$ >&log.txt
    if test $? -ne 0; then
      peer lifecycle chaincode install ${CC_NAME}.tar.gz >&log.txt
      res=$?
    fi
    { set +x; } 2>/dev/null
    cat log.txt
    verifyResult $res "Chaincode installation on $PEER_ADDRESS has failed"
    successln "Chaincode is installed on $PEER_ADDRESS"
  done
}


# queryInstalled PEER ORG
function queryInstalled() {
  ORG=$1
  setGlobals $ORG

  # Array of peer addresses
  PEER_ADDRESSES=("peer0.org${ORG}.brahma.com" "peer1.org${ORG}.brahma.com")  # Add more peers if needed

  for PEER_ADDRESS in "${PEER_ADDRESSES[@]}"; do
    set -x
    peer lifecycle chaincode queryinstalled --output json | jq -r 'try (.installed_chaincodes[].package_id)' | grep ^${PACKAGE_ID}$ >&log.txt
    res=$?
    { set +x; } 2>/dev/null
    cat log.txt
    verifyResult $res "Query installed on $PEER_ADDRESS has failed"
    successln "Query installed successful on $PEER_ADDRESS on channel"
  done
}

# approveForMyOrg VERSION PEER ORG
function approveForMyOrg() {
  ORG=$1
  setGlobals $ORG

  # Array of peer addresses
  PEER_ADDRESSES=("peer0.org${ORG}.brahma.com" "peer1.org${ORG}.brahma.com")  # Add more peers if needed
  
  for PEER_ADDRESS in "${PEER_ADDRESSES[@]}"; do
    set -x
    peer lifecycle chaincode approveformyorg -o localhost:7050 --ordererTLSHostnameOverride orderer.brahma.com --tls --cafile "$ORDERER_CA" --channelID $CHANNEL_NAME --name ${CC_NAME} --version ${CC_VERSION} --package-id ${PACKAGE_ID} --peerAddresses $PEER_ADDRESS --sequence ${CC_SEQUENCE} ${INIT_REQUIRED} ${CC_END_POLICY} ${CC_COLL_CONFIG} >&log.txt
    res=$?
    { set +x; } 2>/dev/null
    cat log.txt
    verifyResult $res "Chaincode definition approved on $PEER_ADDRESS on channel '$CHANNEL_NAME' failed"
    successln "Chaincode definition approved on $PEER_ADDRESS on channel '$CHANNEL_NAME'"
  done
}

# checkCommitReadiness VERSION PEER ORG
function checkCommitReadiness() {
  ORG=$1
  # shift 1
  setGlobals $ORG
  infoln "Checking the commit readiness of the chaincode definition on peer0.org${ORG} on channel '$CHANNEL_NAME'..."
  local rc=1
  local COUNTER=1
  PEER_ADDRESSES=("peer0.org${ORG}.brahma.com" "peer1.org${ORG}.brahma.com")  # Add more peers if needed
  # continue to poll
  # we either get a successful response, or reach MAX RETRY
  for PEER_ADDRESS in "${PEER_ADDRESSES[@]}"; do
    while [ $rc -ne 0 -a $COUNTER -lt $MAX_RETRY ]; do
      sleep $DELAY
      infoln "Attempting to check the commit readiness of the chaincode definition on peer0.org${ORG}, Retry after $DELAY seconds."
      set -x
      peer lifecycle chaincode checkcommitreadiness --channelID $CHANNEL_NAME --name ${CC_NAME} --version ${CC_VERSION} --peerAddresses $PEER_ADDRESS --sequence ${CC_SEQUENCE} ${INIT_REQUIRED} ${CC_END_POLICY} ${CC_COLL_CONFIG} --output json >&log.txt
      res=$?
      { set +x; } 2>/dev/null
      let rc=0
      for var in "$@"; do
        grep "$var" log.txt &>/dev/null || let rc=1
      done
      COUNTER=$(expr $COUNTER + 1)
    done
    cat log.txt
    if test $rc -eq 0; then
      infoln "Checking the commit readiness of the chaincode definition successful on peer0.org${ORG} on channel '$CHANNEL_NAME'"
    else
      fatalln "After $MAX_RETRY attempts, Check commit readiness result on peer0.org${ORG} is INVALID!"
    fi
  done
}

# commitChaincodeDefinition VERSION PEER ORG (PEER ORG)...
function commitChaincodeDefinition() {
  for ORG in "$@"; do
    parsePeerConnectionParameters $ORG
    res=$?
    verifyResult $res "Invoke transaction failed on channel '$CHANNEL_NAME' due to uneven number of peer and org parameters "

    # while 'peer chaincode' command can get the orderer endpoint from the
    # peer (if join was successful), let's supply it directly as we know
    # it using the "-o" option
    PEER_ADDRESSES=("peer0.org${ORG}.brahma.com" "peer1.org${ORG}.brahma.com")  # Add more peers if needed
    for PEER_ADDRESS in "${PEER_ADDRESSES[@]}"; do
      set -x
      peer lifecycle chaincode commit -o localhost:7050 --ordererTLSHostnameOverride orderer.brahma.com --tls --cafile "$ORDERER_CA" --channelID $CHANNEL_NAME --name ${CC_NAME} "${PEER_CONN_PARMS[@]}" --version ${CC_VERSION} --peerAddresses $PEER_ADDRESS --sequence ${CC_SEQUENCE} ${INIT_REQUIRED} ${CC_END_POLICY} ${CC_COLL_CONFIG} >&log.txt
      res=$?
      { set +x; } 2>/dev/null
      cat log.txt
      verifyResult $res "Chaincode definition commit failed on peer0.org${ORG} on channel '$CHANNEL_NAME' failed"
      successln "Chaincode definition committed on channel '$CHANNEL_NAME'"
    done
  done
}

# # queryCommitted ORG
# function queryCommitted() {
#   ORG=$1
#   setGlobals $ORG
#   EXPECTED_RESULT="Version: ${CC_VERSION}, Sequence: ${CC_SEQUENCE}, Endorsement Plugin: escc, Validation Plugin: vscc"
#   infoln "Querying chaincode definition on peer0.org${ORG} on channel '$CHANNEL_NAME'..."
#   local rc=1
#   local COUNTER=1
#   # continue to poll
#   # we either get a successful response, or reach MAX RETRY
#   while [ $rc -ne 0 -a $COUNTER -lt $MAX_RETRY ]; do
#     sleep $DELAY
#     infoln "Attempting to Query committed status on peer0.org${ORG}, Retry after $DELAY seconds."
#     set -x
#     peer lifecycle chaincode querycommitted --channelID $CHANNEL_NAME --name ${CC_NAME} >&log.txt
#     res=$?
#     { set +x; } 2>/dev/null
#     test $res -eq 0 && VALUE=$(cat log.txt | grep -o '^Version: '$CC_VERSION', Sequence: [0-9]*, Endorsement Plugin: escc, Validation Plugin: vscc')
#     test "$VALUE" = "$EXPECTED_RESULT" && let rc=0
#     COUNTER=$(expr $COUNTER + 1)
#   done
#   cat log.txt
#   if test $rc -eq 0; then
#     successln "Query chaincode definition successful on peer0.org${ORG} on channel '$CHANNEL_NAME'"
#   else
#     fatalln "After $MAX_RETRY attempts, Query chaincode definition result on peer0.org${ORG} is INVALID!"
#   fi
# }

# Modified queryCommitted function to query chaincode definition on all peers of an organization

function queryCommitted() {
  ORG=$1
  setGlobals $ORG
  EXPECTED_RESULT="Version: ${CC_VERSION}, Sequence: ${CC_SEQUENCE}, Endorsement Plugin: escc, Validation Plugin: vscc"
  infoln "Querying chaincode definition on peers in org${ORG} on channel '$CHANNEL_NAME'..."
  local rc=1
  local COUNTER=1
  
  # Loop through each peer in the organization
  for ((i=1; i<3; i++)); do
    PEER="peer${i}.org${ORG}"
    PEER_ADDRESS_VAR="PEER${i}_ADDRESS"
    PEER_TLS_ROOT_CERT_VAR="PEER${i}_TLS_ROOT_CERT"

    # continue to poll
    # we either get a successful response, or reach MAX RETRY
    while [ $rc -ne 0 -a $COUNTER -lt $MAX_RETRY ]; do
      sleep $DELAY
      infoln "Attempting to Query committed status on $PEER, Retry after $DELAY seconds."
      
      set -x
      # Querying the current peer
      peer lifecycle chaincode querycommitted --channelID $CHANNEL_NAME --name ${CC_NAME} --peerAddresses ${!PEER_ADDRESS_VAR} --tlsRootCertFiles ${!PEER_TLS_ROOT_CERT_VAR} >&log.txt
      res=$?
      { set +x; } 2>/dev/null
      
      # Check if the query was successful and if the result matches the expected result
      if [ $res -eq 0 ]; then
        VALUE=$(cat log.txt | grep -o '^Version: '$CC_VERSION', Sequence: [0-9]*, Endorsement Plugin: escc, Validation Plugin: vscc')
        if [ "$VALUE" = "$EXPECTED_RESULT" ]; then
          let rc=0
        fi
      fi

      cat log.txt
      if [ $rc -eq 0 ]; then
      successln "Query chaincode definition successful on $PEER in org${ORG} on channel '$CHANNEL_NAME'"
      else
      fatalln "After $MAX_RETRY attempts, Query chaincode definition result on $PEER in org${ORG} is INVALID!"
      fi

      COUNTER=$(expr $COUNTER + 1)
    done

    # Reset the counter for the next peer
    COUNTER=1

    # If the query was successful for the current peer, break the loop
    if [ $rc -eq 0 ]; then
      break
    fi
  done
  

}


function chaincodeInvokeInit() {
  for ORG in "$@"; do
    parsePeerConnectionParameters $ORG
    res=$?
    verifyResult $res "Invoke transaction failed on channel '$CHANNEL_NAME' due to uneven number of peer and org parameters "

    # while 'peer chaincode' command can get the orderer endpoint from the
    # peer (if join was successful), let's supply it directly as we know
    # it using the "-o" option
    PEER_ADDRESSES=("peer0.org${ORG}.brahma.com" "peer1.org${ORG}.brahma.com")  # Add more peers if needed
    for PEER_ADDRESS in "${PEER_ADDRESSES[@]}"; do
      set -x
      fcn_call='{"function":"'${CC_INIT_FCN}'","Args":[]}'
      infoln "invoke fcn call:${fcn_call}"
      peer chaincode invoke -o localhost:7050 --peerAddresses $PEER_ADDRESS --ordererTLSHostnameOverride orderer.brahma.com --tls --cafile "$ORDERER_CA" -C $CHANNEL_NAME -n ${CC_NAME} "${PEER_CONN_PARMS[@]}" --isInit -c ${fcn_call} >&log.txt
      res=$?
      { set +x; } 2>/dev/null
      cat log.txt
      verifyResult $res "Invoke execution on $PEERS failed "
      successln "Invoke transaction successful on $PEERS on channel '$CHANNEL_NAME'"
    done
  done

}

# function chaincodeQuery() {
#   ORG=$1
#   setGlobals $ORG
#   infoln "Querying on peer0.org${ORG} on channel '$CHANNEL_NAME'..."
#   local rc=1
#   local COUNTER=1
#   # continue to poll
#   # we either get a successful response, or reach MAX RETRY
#   while [ $rc -ne 0 -a $COUNTER -lt $MAX_RETRY ]; do
#     sleep $DELAY
#     infoln "Attempting to Query peer0.org${ORG}, Retry after $DELAY seconds."
#     set -x
#     peer chaincode query -C $CHANNEL_NAME -n ${CC_NAME} -c '{"Args":["org.hyperledger.fabric:GetMetadata"]}' >&log.txt
#     res=$?
#     { set +x; } 2>/dev/null
#     let rc=$res
#     COUNTER=$(expr $COUNTER + 1)
#   done
#   cat log.txt
#   if test $rc -eq 0; then
#     successln "Query successful on peer0.org${ORG} on channel '$CHANNEL_NAME'"
#   else
#     fatalln "After $MAX_RETRY attempts, Query result on peer0.org${ORG} is INVALID!"
#   fi
# }


# Modified chaincodeQuery function to query chaincode on all peers of an organization
function chaincodeQuery() {
  ORG=$1
  setGlobals $ORG
  infoln "Querying on peers in org${ORG} on channel '$CHANNEL_NAME'..."
  local rc=1
  local COUNTER=1

  # Loop through each peer in the organization
  for ((i=0; i<4; i++)); do
    PEER="peer${i}.org${ORG}"
    
    # continue to poll
    # we either get a successful response, or reach MAX RETRY
    while [ $rc -ne 0 -a $COUNTER -lt $MAX_RETRY ]; do
      sleep $DELAY
      infoln "Attempting to Query $PEER, Retry after $DELAY seconds."
      set -x
      # Querying the current peer
      peer chaincode query -C $CHANNEL_NAME -n ${CC_NAME} -c '{"Args":["org.hyperledger.fabric:GetMetadata"]}' >&log.txt
      res=$?
      { set +x; } 2>/dev/null
      let rc=$res
      COUNTER=$(expr $COUNTER + 1)
    done

    # Reset the counter for the next peer
    COUNTER=1
  done

  cat log.txt
  if test $rc -eq 0; then
    successln "Query successful on peers in org${ORG} on channel '$CHANNEL_NAME'"
  else
    fatalln "After $MAX_RETRY attempts, Query result on peers in org${ORG} is INVALID!"
  fi
}
