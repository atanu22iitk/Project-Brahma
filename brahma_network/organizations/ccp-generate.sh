#!/bin/bash

function one_line_pem {
    echo "`awk 'NF {sub(/\\n/, ""); printf "%s\\\\\\\n",$0;}' $1`"
}

function json_ccp {
    echo "i am in function json_ccp"
    local PP=$(one_line_pem $5)
    local CP=$(one_line_pem $6)
    sed -e "s/\${ORG}/$1/" \
        -e "s/\${P0PORT}/$2/" \
        -e "s/\${P1PORT}/$3/" \
        -e "s/\${CAPORT}/$4/" \
        -e "s#\${PEERPEM}#$PP#" \
        -e "s#\${CAPEM}#$CP#" \
        organizations/ccp-template.json
}

function yaml_ccp {
    echo "i am in function yaml_ccp"
    local PP=$(one_line_pem $5)
    local CP=$(one_line_pem $6)
    sed -e "s/\${ORG}/$1/" \
        -e "s/\${P0PORT}/$2/" \
        -e "s/\${P1PORT}/$3/" \
        -e "s/\${CAPORT}/$4/" \
        -e "s#\${PEERPEM}#$PP#" \
        -e "s#\${CAPEM}#$CP#" \
        organizations/ccp-template.yaml | sed -e $'s/\\\\n/\\\n          /g'
}
echo "i am in function ccp-generate.sh"
ORG=1
P0PORT=7052
P1PORT=7054
CAPORT=8054
PEERPEM=organizations/peerOrganizations/org1.brahma.com/tlsca/tlsca.org1.brahma.com-cert.pem
echo "$PEERPEM"
CAPEM=organizations/peerOrganizations/org1.brahma.com/ca/ca.org1.brahma.com-cert.pem
echo "$CAPEM"
echo "$(json_ccp $ORG $P0PORT $P1PORT $CAPORT $PEERPEM $CAPEM)" > organizations/peerOrganizations/org1.brahma.com/connection-org1.json
echo "$(yaml_ccp $ORG $P0PORT $P1PORT $CAPORT $PEERPEM $CAPEM)" > organizations/peerOrganizations/org1.brahma.com/connection-org1.yaml

ORG=2
P0PORT=9051
P1PORT=9053
CAPORT=8055
PEERPEM=organizations/peerOrganizations/org2.brahma.com/tlsca/tlsca.org2.brahma.com-cert.pem
CAPEM=organizations/peerOrganizations/org2.brahma.com/ca/ca.org2.brahma.com-cert.pem

echo "$(json_ccp $ORG $P0PORT $P1PORT $CAPORT $PEERPEM $CAPEM)" > organizations/peerOrganizations/org2.brahma.com/connection-org2.json
echo "$(yaml_ccp $ORG $P0PORT $P1PORT $CAPORT $PEERPEM $CAPEM)" > organizations/peerOrganizations/org2.brahma.com/connection-org2.yaml
