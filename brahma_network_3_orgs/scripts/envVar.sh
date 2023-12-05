#!/bin/bash
#
# Copyright IBM Corp All Rights Reserved
#
# SPDX-License-Identifier: Apache-2.0
#

# This is a collection of bash functions used by different scripts

# imports
. scripts/utils.sh

export CORE_PEER_TLS_ENABLED=true
export ORDERER_CA=${PWD}/organizations/ordererOrganizations/brahma.com/tlsca/tlsca.brahma.com-cert.pem
export PEER0_ORG1_CA=${PWD}/organizations/peerOrganizations/org1.brahma.com/tlsca/tlsca.org1.brahma.com-cert.pem
export PEER1_ORG1_CA=${PWD}/organizations/peerOrganizations/org1.brahma.com/tlsca/tlsca.org1.brahma.com-cert.pem
export PEER0_ORG2_CA=${PWD}/organizations/peerOrganizations/org2.brahma.com/tlsca/tlsca.org2.brahma.com-cert.pem
export PEER1_ORG2_CA=${PWD}/organizations/peerOrganizations/org2.brahma.com/tlsca/tlsca.org2.brahma.com-cert.pem
export PEER0_ORG3_CA=${PWD}/organizations/peerOrganizations/org3.brahma.com/tlsca/tlsca.org3.brahma.com-cert.pem
export PEER1_ORG3_CA=${PWD}/organizations/peerOrganizations/org3.brahma.com/tlsca/tlsca.org3.brahma.com-cert.pem
# export PEER0_ORG3_CA=${PWD}/organizations/peerOrganizations/org3.brahma.com/tlsca/tlsca.org3.brahma.com-cert.pem
export ORDERER_ADMIN_TLS_SIGN_CERT=${PWD}/organizations/ordererOrganizations/brahma.com/orderers/orderer.brahma.com/tls/server.crt
export ORDERER_ADMIN_TLS_PRIVATE_KEY=${PWD}/organizations/ordererOrganizations/brahma.com/orderers/orderer.brahma.com/tls/server.key

# Set environment variables for the peer org
setGlobals() {
  echo "--------------------####################### i am setGlobals"
  local USING_ORG=""
  if [ -z "$OVERRIDE_ORG" ]; then
    USING_ORG=$1
  else
    USING_ORG="${OVERRIDE_ORG}"
  fi
  infoln "Using organization ${USING_ORG}"
  if [ $USING_ORG -eq 1 ]; then
    export CORE_PEER_LOCALMSPID="Org1MSP"
    export CORE_PEER_TLS_ROOTCERT_FILE=$PEER0_ORG1_CA
    export CORE_PEER_MSPCONFIGPATH=${PWD}/organizations/peerOrganizations/org1.brahma.com/users/Admin@org1.brahma.com/msp
    export CORE_PEER_ADDRESS=localhost:7052
    # export CORE_PEER_ADDRESS=localhost:7054
  elif [ $USING_ORG -eq 2 ]; then
    export CORE_PEER_LOCALMSPID="Org2MSP"
    export CORE_PEER_TLS_ROOTCERT_FILE=$PEER0_ORG2_CA
    export CORE_PEER_MSPCONFIGPATH=${PWD}/organizations/peerOrganizations/org2.brahma.com/users/Admin@org2.brahma.com/msp
    export CORE_PEER_ADDRESS=localhost:9051
    # export CORE_PEER_ADDRESS=localhost:9053
  elif [ $USING_ORG -eq 3 ]; then
    export CORE_PEER_LOCALMSPID="Org3MSP"
    export CORE_PEER_TLS_ROOTCERT_FILE=$PEER0_ORG3_CA
    export CORE_PEER_MSPCONFIGPATH=${PWD}/organizations/peerOrganizations/org3.brahma.com/users/Admin@org3.brahma.com/msp
    export CORE_PEER_ADDRESS=localhost:9061
  else
    errorln "ORG Unknown"
  fi

  if [ "$VERBOSE" == "true" ]; then
    env | grep CORE
  fi
}

# Set environment variables for use in the CLI container
setGlobalsCLI() {
  setGlobals $1 

  local USING_ORG=""
  if [ -z "$OVERRIDE_ORG" ]; then
    USING_ORG=$1
  else
    USING_ORG="${OVERRIDE_ORG}"
  fi
  if [ $USING_ORG -eq 1 ]; then
    export CORE_PEER_ADDRESS=peer0.org1.brahma.com:7052
  # elif [ $USING_ORG -eq 1 1]; then
  #   export CORE_PEER_ADDRESS=peer1.org1.brahma.com:7054
  elif [ $USING_ORG -eq 2 ]; then
    export CORE_PEER_ADDRESS=peer0.org2.brahma.com:9051
  elif [ $USING_ORG -eq 3 ]; then
    export CORE_PEER_ADDRESS=peer0.org3.brahma.com:9061
  # elif [ $USING_ORG -eq 2 1]; then
  #   export CORE_PEER_ADDRESS=peer1.org2.brahma.com:9053
  # elif [ $USING_ORG -eq 3 ]; then
  #   export CORE_PEER_ADDRESS=peer0.org3.brahma.com:11051
  else
    errorln "ORG Unknown"
  fi
}

# parsePeerConnectionParameters $@
# Helper function that sets the peer connection parameters for a chaincode
# operation
parsePeerConnectionParameters() {       #################################------------ I have to amend this function properly ---------------################
  PEER_CONN_PARMS=()
  PEERS=""
  while [ "$#" -gt 0 ]; do
    setGlobals $1
    PEER1="peer0.org$1"
    # PEER2="peer1.org$1"

    ## Set peer addresses
    if [ -z "$PEERS" ]
    then
	PEERS="$PEER"
    else
	PEERS="$PEERS $PEER"
    fi
    PEER_CONN_PARMS=("${PEER_CONN_PARMS[@]}" --peerAddresses $CORE_PEER_ADDRESS)
    ## Set path to TLS certificate
    CA=PEER0_ORG$1_CA
    TLSINFO=(--tlsRootCertFiles "${!CA}")
    PEER_CONN_PARMS=("${PEER_CONN_PARMS[@]}" "${TLSINFO[@]}")
    # shift by one to get to the next organization
    shift
  done
}

verifyResult() {
  if [ $1 -ne 0 ]; then
    fatalln "$2"
  fi
}
