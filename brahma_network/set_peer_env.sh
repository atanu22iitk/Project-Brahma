#!/bin/bash

# Set the path to the fabric peer binaries
export PATH=${PWD}/../bin:$PATH

# Set the Fabric configuration path
export FABRIC_CFG_PATH=$PWD/../config-brahma/

# Set environment variables for Org1

export CORE_PEER_TLS_ENABLED=true
export CORE_PEER_LOCALMSPID="Org1MSP"
export CORE_PEER_TLS_ROOTCERT_FILE=${PWD}/organizations/peerOrganizations/org1.brahma.com/peers/peer0.org1.brahma.com/tls/ca.crt
export CORE_PEER_MSPCONFIGPATH=${PWD}/organizations/peerOrganizations/org1.brahma.com/users/Admin@org1.brahma.com/msp
export CORE_PEER_ADDRESS=localhost:7052
# export FABRIC_CA_SERVER_PORT=8054
echo "Peer environment for Org1 is set"
# Set environment variables for Org2

export CORE_PEER_TLS_ENABLED=true  
export CORE_PEER_LOCALMSPID="Org2MSP"
export CORE_PEER_TLS_ROOTCERT_FILE=${PWD}/organizations/peerOrganizations/org2.brahma.com/peers/peer0.org2.brahma.com/tls/ca.crt
export CORE_PEER_MSPCONFIGPATH=${PWD}/organizations/peerOrganizations/org2.brahma.com/users/Admin@org2.brahma.com/msp
export CORE_PEER_ADDRESS=localhost:9051
# export FABRIC_CA_SERVER_PORT=8055
echo "Peer environment for Org2 is set"


# run the following command to make this file executable
# chmod +x set_peer_env.sh

# invoking a chaincode for peer @Org1
peer chaincode invoke -o localhost:7050 --ordererTLSHostnameOverride orderer.brahma.com --tls --cafile "${PWD}/organizations/ordererOrganizations/brahma.com/orderers/orderer.brahma.com/msp/tlscacerts/tlsca.brahma.com-cert.pem" -C abcd -n basic --peerAddresses localhost:7052 --tlsRootCertFiles "${PWD}/organizations/peerOrganizations/org1.brahma.com/peers/peer0.org1.brahma.com/tls/ca.crt" --peerAddresses localhost:9051 --tlsRootCertFiles "${PWD}/organizations/peerOrganizations/org2.brahma.com/peers/peer0.org2.brahma.com/tls/ca.crt" -c '{"function":"InitLedger","Args":[]}'
echo "Chaincode invoked for Org1 and org2"

# for query of a chaincode use the following in the cli --mentioning the peer addresses is necessary
echo "Querying chaincode on peer0.org1... to get all the assets"
# change the Args field to query any other function
# peer chaincode query -o localhost:7050 --ordererTLSHostnameOverride orderer.brahma.com --tls --cafile "${PWD}/organizations/ordererOrganizations/brahma.com/orderers/orderer.brahma.com/msp/tlscacerts/tlsca.brahma.com-cert.pem" -C abcd -n basic --peerAddresses localhost:7052 --tlsRootCertFiles "${PWD}/organizations/peerOrganizations/org1.brahma.com/peers/peer0.org1.brahma.com/tls/ca.crt" -c '{"Args":["DeleteAsset","asset1"]}'
# peer chaincode query -o localhost:7050 --ordererTLSHostnameOverride orderer.brahma.com --tls --cafile "${PWD}/organizations/ordererOrganizations/brahma.com/orderers/orderer.brahma.com/msp/tlscacerts/tlsca.brahma.com-cert.pem" -C abcd -n basic --peerAddresses localhost:7052 --tlsRootCertFiles "${PWD}/organizations/peerOrganizations/org1.brahma.com/peers/peer0.org1.brahma.com/tls/ca.crt" -c '{"Args":["updateAsset","asset2","blue","5","atanu","1000"]}'
# peer chaincode query -o localhost:7050 --ordererTLSHostnameOverride orderer.brahma.com --tls --cafile "${PWD}/organizations/ordererOrganizations/brahma.com/orderers/orderer.brahma.com/msp/tlscacerts/tlsca.brahma.com-cert.pem" -C abcd -n basic --peerAddresses localhost:7052 --tlsRootCertFiles "${PWD}/organizations/peerOrganizations/org1.brahma.com/peers/peer0.org1.brahma.com/tls/ca.crt" -c '{"Args":["DeleteAsset","asset1"]}'

# peer chaincode query -o localhost:7050 --ordererTLSHostnameOverride orderer.brahma.com --tls --cafile "${PWD}/organizations/ordererOrganizations/brahma.com/orderers/orderer.brahma.com/msp/tlscacerts/tlsca.brahma.com-cert.pem" -C abcd -n basic --peerAddresses localhost:7052 --tlsRootCertFiles "${PWD}/organizations/peerOrganizations/org1.brahma.com/peers/peer0.org1.brahma.com/tls/ca.crt" -c '{"Args":["AssetExists","asset1"]}'
# peer chaincode query -o localhost:7050 --ordererTLSHostnameOverride orderer.brahma.com --tls --cafile "${PWD}/organizations/ordererOrganizations/brahma.com/orderers/orderer.brahma.com/msp/tlscacerts/tlsca.brahma.com-cert.pem" -C abcd -n basic --peerAddresses localhost:7052 --tlsRootCertFiles "${PWD}/organizations/peerOrganizations/org1.brahma.com/peers/peer0.org1.brahma.com/tls/ca.crt" -c '{"Args":["DeleteAsset","asset1"]}'
peer chaincode query -o localhost:7050 --ordererTLSHostnameOverride orderer.brahma.com --tls --cafile "${PWD}/organizations/ordererOrganizations/brahma.com/orderers/orderer.brahma.com/msp/tlscacerts/tlsca.brahma.com-cert.pem" -C abcd -n basic --peerAddresses localhost:7052 --tlsRootCertFiles "${PWD}/organizations/peerOrganizations/org1.brahma.com/peers/peer0.org1.brahma.com/tls/ca.crt" -c '{"Args":["GetAllAssets"]}'