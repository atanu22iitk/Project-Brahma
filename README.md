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
5. Go to the directory called fabric-samples. Download the brahma-network and config-brahma folders given here in th repo and replace with test-network and c

