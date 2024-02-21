#!/bin/bash
# infoln "Enrolling the CA admin"
mkdir -p organizations/peerOrganizations/org1.brahma.com/

export FABRIC_CA_CLIENT_HOME=${PWD}/organizations/peerOrganizations/org1.brahma.com/
# Set environment variables for Fabric CA client

export FABRIC_CA_CLIENT_TLS_CERTFILES=${PWD}/organizations/fabric-ca/org1/ca-cert.pem

# Set the enrollment ID and secret for authentication
export ENROLLMENT_ID=admin
export ENROLLMENT_SECRET=adminpw

# Set the Fabric CA server URL
export FABRIC_CA_SERVER_URL=https://localhost:8054

# Enroll the admin user to get an enrollment certificate
/home/fabric/fabric_brahma/fabric-samples/bin/fabric-ca-client enroll -u http://$ENROLLMENT_ID:$ENROLLMENT_SECRET@$FABRIC_CA_SERVER_URL --caname ca-org1 --tls.certfiles $FABRIC_CA_CLIENT_TLS_CERTFILES

# List all registered identities
/home/fabric/fabric_brahma/fabric-samples/bin/fabric-ca-client identity list

# Revoke the admin's enrollment certificate (optional)
/home/fabric/fabric_brahma/fabric-samples/bin/fabric-ca-client revoke -e $ENROLLMENT_ID

# Cleanup the client's local state (optional)
rm -rf $FABRIC_CA_CLIENT_HOME/*

