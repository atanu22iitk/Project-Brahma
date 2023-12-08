#!/bin/bash
#
# Copyright IBM Corp All Rights Reserved
#
# SPDX-License-Identifier: Apache-2.0
#

function createOrg3 {
	infoln "Enrolling the CA admin"
	mkdir -p ../organizations/peerOrganizations/org3.brahma.com/

	export FABRIC_CA_CLIENT_HOME=${PWD}/../organizations/peerOrganizations/org3.brahma.com/

  set -x
  fabric-ca-client enroll -u https://admin:adminpw@localhost:11054 --caname ca-org3 --tls.certfiles "${PWD}/fabric-ca/org3/tls-cert.pem"
  { set +x; } 2>/dev/null

  echo 'NodeOUs:
  Enable: true
  ClientOUIdentifier:
    Certificate: cacerts/localhost-11054-ca-org3.pem
    OrganizationalUnitIdentifier: client
  PeerOUIdentifier:
    Certificate: cacerts/localhost-11054-ca-org3.pem
    OrganizationalUnitIdentifier: peer
  AdminOUIdentifier:
    Certificate: cacerts/localhost-11054-ca-org3.pem
    OrganizationalUnitIdentifier: admin
  OrdererOUIdentifier:
    Certificate: cacerts/localhost-11054-ca-org3.pem
    OrganizationalUnitIdentifier: orderer' > "${PWD}/../organizations/peerOrganizations/org3.brahma.com/msp/config.yaml"

	infoln "Registering peer0"
  set -x
	fabric-ca-client register --caname ca-org3 --id.name peer0 --id.secret peer0pw --id.type peer --tls.certfiles "${PWD}/fabric-ca/org3/tls-cert.pem"
  { set +x; } 2>/dev/null

  infoln "Registering peer1"
  set -x
	fabric-ca-client register --caname ca-org3 --id.name peer1 --id.secret peer1pw --id.type peer --tls.certfiles "${PWD}/fabric-ca/org3/tls-cert.pem"
  { set +x; } 2>/dev/null

  infoln "Registering user"
  set -x
  fabric-ca-client register --caname ca-org3 --id.name user1 --id.secret user1pw --id.type client --tls.certfiles "${PWD}/fabric-ca/org3/tls-cert.pem"
  { set +x; } 2>/dev/null

  infoln "Registering the org admin"
  set -x
  fabric-ca-client register --caname ca-org3 --id.name org3admin --id.secret org3adminpw --id.type admin --tls.certfiles "${PWD}/fabric-ca/org3/tls-cert.pem"
  { set +x; } 2>/dev/null

  infoln "Generating the peer0 msp"
  set -x
	fabric-ca-client enroll -u https://peer0:peer0pw@localhost:11054 --caname ca-org3 -M "${PWD}/../organizations/peerOrganizations/org3.brahma.com/peers/peer0.org3.brahma.com/msp" --csr.hosts peer0.org3.brahma.com --tls.certfiles "${PWD}/fabric-ca/org3/tls-cert.pem"
  { set +x; } 2>/dev/null

  cp "${PWD}/../organizations/peerOrganizations/org3.brahma.com/msp/config.yaml" "${PWD}/../organizations/peerOrganizations/org3.brahma.com/peers/peer0.org3.brahma.com/msp/config.yaml"

  infoln "Generating the peer0-tls certificates"
  set -x
  fabric-ca-client enroll -u https://peer0:peer0pw@localhost:11054 --caname ca-org3 -M "${PWD}/../organizations/peerOrganizations/org3.brahma.com/peers/peer0.org3.brahma.com/tls" --enrollment.profile tls --csr.hosts peer0.org3.brahma.com --csr.hosts localhost --tls.certfiles "${PWD}/fabric-ca/org3/tls-cert.pem"
  { set +x; } 2>/dev/null


  cp "${PWD}/../organizations/peerOrganizations/org3.brahma.com/peers/peer0.org3.brahma.com/tls/tlscacerts/"* "${PWD}/../organizations/peerOrganizations/org3.brahma.com/peers/peer0.org3.brahma.com/tls/ca.crt"
  cp "${PWD}/../organizations/peerOrganizations/org3.brahma.com/peers/peer0.org3.brahma.com/tls/signcerts/"* "${PWD}/../organizations/peerOrganizations/org3.brahma.com/peers/peer0.org3.brahma.com/tls/server.crt"
  cp "${PWD}/../organizations/peerOrganizations/org3.brahma.com/peers/peer0.org3.brahma.com/tls/keystore/"* "${PWD}/../organizations/peerOrganizations/org3.brahma.com/peers/peer0.org3.brahma.com/tls/server.key"

  infoln "Generating the peer1 msp"
  set -x
	fabric-ca-client enroll -u https://peer1:peer1pw@localhost:11054 --caname ca-org3 -M "${PWD}/../organizations/peerOrganizations/org3.brahma.com/peers/peer1.org3.brahma.com/msp" --csr.hosts peer1.org3.brahma.com --tls.certfiles "${PWD}/fabric-ca/org3/tls-cert.pem"
  { set +x; } 2>/dev/null

  cp "${PWD}/../organizations/peerOrganizations/org3.brahma.com/msp/config.yaml" "${PWD}/../organizations/peerOrganizations/org3.brahma.com/peers/peer1.org3.brahma.com/msp/config.yaml"

  infoln "Generating the peer1-tls certificates"
  set -x
  fabric-ca-client enroll -u https://peer1:peer1pw@localhost:11054 --caname ca-org3 -M "${PWD}/../organizations/peerOrganizations/org3.brahma.com/peers/peer1.org3.brahma.com/tls" --enrollment.profile tls --csr.hosts peer1.org3.brahma.com --csr.hosts localhost --tls.certfiles "${PWD}/fabric-ca/org3/tls-cert.pem"
  { set +x; } 2>/dev/null


  cp "${PWD}/../organizations/peerOrganizations/org3.brahma.com/peers/peer1.org3.brahma.com/tls/tlscacerts/"* "${PWD}/../organizations/peerOrganizations/org3.brahma.com/peers/peer1.org3.brahma.com/tls/ca.crt"
  cp "${PWD}/../organizations/peerOrganizations/org3.brahma.com/peers/peer1.org3.brahma.com/tls/signcerts/"* "${PWD}/../organizations/peerOrganizations/org3.brahma.com/peers/peer1.org3.brahma.com/tls/server.crt"
  cp "${PWD}/../organizations/peerOrganizations/org3.brahma.com/peers/peer1.org3.brahma.com/tls/keystore/"* "${PWD}/../organizations/peerOrganizations/org3.brahma.com/peers/peer1.org3.brahma.com/tls/server.key"



  mkdir "${PWD}/../organizations/peerOrganizations/org3.brahma.com/msp/tlscacerts"
  cp "${PWD}/../organizations/peerOrganizations/org3.brahma.com/peers/peer0.org3.brahma.com/tls/tlscacerts/"* "${PWD}/../organizations/peerOrganizations/org3.brahma.com/msp/tlscacerts/ca.crt"
  cp "${PWD}/../organizations/peerOrganizations/org3.brahma.com/peers/peer1.org3.brahma.com/tls/tlscacerts/"* "${PWD}/../organizations/peerOrganizations/org3.brahma.com/msp/tlscacerts/ca.crt"

  mkdir "${PWD}/../organizations/peerOrganizations/org3.brahma.com/tlsca"
  cp "${PWD}/../organizations/peerOrganizations/org3.brahma.com/peers/peer0.org3.brahma.com/tls/tlscacerts/"* "${PWD}/../organizations/peerOrganizations/org3.brahma.com/tlsca/tlsca.org3.brahma.com-cert.pem"
  cp "${PWD}/../organizations/peerOrganizations/org3.brahma.com/peers/peer1.org3.brahma.com/tls/tlscacerts/"* "${PWD}/../organizations/peerOrganizations/org3.brahma.com/tlsca/tlsca.org3.brahma.com-cert.pem"

  mkdir "${PWD}/../organizations/peerOrganizations/org3.brahma.com/ca"
  cp "${PWD}/../organizations/peerOrganizations/org3.brahma.com/peers/peer0.org3.brahma.com/msp/cacerts/"* "${PWD}/../organizations/peerOrganizations/org3.brahma.com/ca/ca.org3.brahma.com-cert.pem"
  cp "${PWD}/../organizations/peerOrganizations/org3.brahma.com/peers/peer1.org3.brahma.com/msp/cacerts/"* "${PWD}/../organizations/peerOrganizations/org3.brahma.com/ca/ca.org3.brahma.com-cert.pem"

  infoln "Generating the user msp"
  set -x
	fabric-ca-client enroll -u https://user1:user1pw@localhost:11054 --caname ca-org3 -M "${PWD}/../organizations/peerOrganizations/org3.brahma.com/users/User1@org3.brahma.com/msp" --tls.certfiles "${PWD}/fabric-ca/org3/tls-cert.pem"
  { set +x; } 2>/dev/null

  cp "${PWD}/../organizations/peerOrganizations/org3.brahma.com/msp/config.yaml" "${PWD}/../organizations/peerOrganizations/org3.brahma.com/users/User1@org3.brahma.com/msp/config.yaml"

  infoln "Generating the org admin msp"
  set -x
	fabric-ca-client enroll -u https://org3admin:org3adminpw@localhost:11054 --caname ca-org3 -M "${PWD}/../organizations/peerOrganizations/org3.brahma.com/users/Admin@org3.brahma.com/msp" --tls.certfiles "${PWD}/fabric-ca/org3/tls-cert.pem"
  { set +x; } 2>/dev/null

  cp "${PWD}/../organizations/peerOrganizations/org3.brahma.com/msp/config.yaml" "${PWD}/../organizations/peerOrganizations/org3.brahma.com/users/Admin@org3.brahma.com/msp/config.yaml"
}
