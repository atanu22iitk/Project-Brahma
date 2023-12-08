#!/bin/bash

function one_line_pem {
    echo "`awk 'NF {sub(/\\n/, ""); printf "%s\\\\\\\n",$0;}' $1`"
}

function json_ccp {
    local PP=$(one_line_pem $5)
    local CP=$(one_line_pem $6)
    sed -e "s/\${ORG}/$1/" \
        -e "s/\${P0PORT}/$2/" \
        -e "s/\${P1PORT}/$3/" \
        -e "s/\${CAPORT}/$4/" \
        -e "s#\${PEERPEM}#$PP#" \
        -e "s#\${CAPEM}#$CP#" \
        ccp-template.json
}

function yaml_ccp {
    local PP=$(one_line_pem $5)
    local CP=$(one_line_pem $6)
    sed -e "s/\${ORG}/$1/" \
        -e "s/\${P0PORT}/$2/" \
        -e "s/\${P1PORT}/$3/" \
        -e "s/\${CAPORT}/$4/" \
        -e "s#\${PEERPEM}#$PP#" \
        -e "s#\${CAPEM}#$CP#" \
        ccp-template.yaml | sed -e $'s/\\\\n/\\\n          /g'
}

ORG=3
P0PORT=11051
P1PORT=11053
CAPORT=11054
PEERPEM=../organizations/peerOrganizations/org3.brahma.com/tlsca/tlsca.org3.brahma.com-cert.pem
CAPEM=../organizations/peerOrganizations/org3.brahma.com/ca/ca.org3.brahma.com-cert.pem

echo "$(json_ccp $ORG $P0PORT $P1PORT $CAPORT $PEERPEM $CAPEM)" > ../organizations/peerOrganizations/org3.brahma.com/connection-org3.json
echo "$(yaml_ccp $ORG $P0PORT $P1PORT $CAPORT $PEERPEM $CAPEM)" > ../organizations/peerOrganizations/org3.brahma.com/connection-org3.yaml
