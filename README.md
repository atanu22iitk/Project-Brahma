# Project-Brahma
1. This is an MTech Project at IIT Kanpur. This project delivers a healthcare and EHR application based on Blockchain using Hyperledger Fabric.
2. Use the Brahma_network folder to replace first-network/Test-network folder after completing the installation of Hyperledger fabric in your local machine. 
3. Add and replace config folder(/fabric-samples/config) with brahma-config folder. Necessary changes have already been made in the register Enroll.sh file. No need to worry.
4. You need to give permission to all the sh files (chmod 777 <file_name>).
5. Please follow the complete installation guide in the link https://dev.to/deadwin19/how-to-install-hyperledger-fabric-v24-on-ubuntu-2004-236f
6. Also refer this official documentation to understand the installation process. https://hyperledger-fabric.readthedocs.io/en/release-2.5/getting_started.html
7. Refer this official documentation for understanding how test network is designed and what arguments to pass when running brahma.sh file. https://hyperledger-fabric.readthedocs.io/en/release-2.5/tutorials.html
8. Follow the couchDB turial for deploying smart contracts and other features https://hyperledger-fabric.readthedocs.io/en/release-2.2/couchdb_tutorial.html
9. This project is implemented using fabric-ca crypto tool only. it uses raft consensus mechanism and it contains only two organisations with two peers each.
10. For further updates on the project stay tuned.
## Installation Procedure for Hyperledger Fabric in Ubuntu
1. Please follow the installation guide given in the link https://dev.to/deadwin19/how-to-install-hyperledger-fabric-v24-on-ubuntu-2004-236f
2. Make sure that you have installed latest Docker and Docker-Compose
3. Follow the procedure to install fabric 2.4.4 and fabric-ca 1.5.3
4. After running the installation command - Download the latest release of Fabric samples, docker images, and binaries.
      curl -sSL https://bit.ly/2ysbOFE | bash -s
5. Go to the directory called fabric-samples. Download the brahma-network and config-brahma folders given here in th repo and paste them inside fabric-samples directory.
6. Go to the integrated terminal in VS Code or any code editor and move in the directory by
         cd fabric-samples/brahma_network/
7. Then run the following command
         ./brahma.sh up createChannel -ca -c <channel name of your choice> -s couchdb
8. Please note we are using Hyperledger fabric with fabric-ca crypto tool and couchdb as state database for org ledgers and states to be saved.
---------------------------------------------------------------------------------------------------------------------------------------------------------

Command for deploying chaincode
./brahma.sh deployCC -ccn basic -ccp ../asset-transfer-basic/chaincode-go -ccl go -c brahmachannel

### Procedure for adding an additional organisation in fabric-network
1. download the file add_org3.zip folder.
2. It contains two main folders - addOrg3 and org3-scripts
3. Copy and paste addOrg3 folder under brahma-network/ and save the org3-scripts under scripts/.
4. You need to add the following in envVar.sh
export PEER0_ORG3_CA=${PWD}/organizations/peerOrganizations/org3.brahma.com/tlsca/tlsca.org3.brahma.com-cert.pem
export PEER1_ORG3_CA=${PWD}/organizations/peerOrganizations/org3.brahma.com/tlsca/tlsca.org3.brahma.com-cert.pem
6. In setGlobalsCLI:
7. elif [ $USING_ORG -eq 3 ]; then
    export CORE_PEER_ADDRESS=peer0.org3.brahma.com:11051 (Replace with actual port no)
8. In setGlobals():
   elif [ $USING_ORG -eq 3 ]; then
    export CORE_PEER_LOCALMSPID="Org3MSP"
    export CORE_PEER_TLS_ROOTCERT_FILE=$PEER0_ORG3_CA
    export CORE_PEER_MSPCONFIGPATH=${PWD}/organizations/peerOrganizations/org3.brahma.com/users/Admin@org3.brahma.com/msp
    export CORE_PEER_ADDRESS=localhost:11051   (Replace with actual ID and port no)
9. Do necessary changes also in deployCC.sh and in deployCCAAS.sh
10. Do changes or add the code for anchor peer update in createAnchorPeerUpdate():
    elif [ $ORG -eq 3 ]; then
    HOST0="peer0.org3.brahma.com"
    PORT0=11051 
    HOST1="peer1.org3.brahma.com"
    PORT1=11053
11. now you run below code to add org3 in brahma network
    cd addOrg3/
    ./addOrg3.sh -ca -c <channelName> -s couchdb

---------------------------------------------------------------------------------------------------------------------------------
1. "brahma_netwrork_3_orgs" is an amended version of brahma netwrok with 3 ORGs and each Org with two peers each.
2. Simply run the commands to execute.
----------------------------------------------------------------------------------------------------------------------------------------
Folder "dist"
1. encrypt.py file takes a document file, generates a random key. encrypts document with the key.
2. You need to give path to a pdf file/document.
3. next run exchkey_client.py - it will ask for private key file (.pem file). You need to specify its path.
4. thereafter you need to enter Server IP address. (make sure to provide access to port no 12345 on your PC - sudo ufw allow 12345/tcp.
5. once done key file shall be transfered to the client.
6. here I have used public key of Client to encrypt key generated by Server. The Client is decrypting using his Private key.
   
