/*
 * Copyright IBM Corp. All Rights Reserved.
 *
 * SPDX-License-Identifier: Apache-2.0
 */

'use strict';

const { Gateway, Wallets } = require('fabric-network');
const fs = require('fs');
const path = require('path');


// In the main function we can also pass the organisation name as well
// here hospId is akin to Hospital ID
async function main(orgName, hospId, channelName, contractName , functionName, ehrId, patientID, ) {

    try {
       // Get the current timestamp
       var timestamp = String(Date.now());
       console.log('time:', timestamp);
        // load the network configuration
        const ccpPath = path.resolve(__dirname, '..', '..', 'brahma_network', 'organizations', 'peerOrganizations', `${orgName}.brahma.com`, `connection-${orgName}.json`);
        let ccp = JSON.parse(fs.readFileSync(ccpPath, 'utf8'));

        // Create a new file system based wallet for managing identities.
        const walletPath = path.join(process.cwd(), 'wallet', orgName, hospId);
        const wallet = await Wallets.newFileSystemWallet(walletPath);
        console.log(`Wallet path: ${walletPath}`);

        // Check to see if we've already enrolled the user.
        const identity = await wallet.get(hospId); 
        if (!identity) {
            console.log(`An identity for the user ${hospId} does not exist in the wallet`);
            console.log('Run the registerUser.js application before retrying');
            return;
        }

        // Create a new gateway for connecting to our peer node.
        const gateway = new Gateway();
        console.log('gateway:', gateway);
        await gateway.connect(ccp, { wallet, identity: hospId, discovery: { enabled: true, asLocalhost: true } });

        // Get the network (channel) our contract is deployed to.
        const network = await gateway.getNetwork(channelName);
        console.log('network:', network);
        // Get the contract from the network.
        const contract = network.getContract(contractName);

        
       

        // Submit the specified transaction.
        const result = await contract.submitTransaction(`${functionName}`, `${patientID}`, `${ehrId}`, `${timestamp}`);
        
        console.log(`Transaction has been submitted. Got "${result.toString()}" , as data for the user`);


        // Disconnect from the gateway.
        await gateway.disconnect();

    } catch (error) {
        console.error(`Failed to submit transaction: ${error}`);
        process.exit(1);
    }
}
module.exports = main;
main(process.argv[2], process.argv[3], process.argv[4], process.argv[5], process.argv[6],process.argv[7], process.argv[8]);
// pass the parameters in following sequence patientID, ehrID, org_name, hospID (hospId), channelName, contractName, functionName orgName, value
// key is in the format hospId_timestamp, values should be patientId, doctorId, staffId, prescriptionId, department, hospId in sequence
//node invoke.js B0000002 newbrahmach genPrescription updatePrescriptionData org1 B0000001 D0000001 S00001 PRE00001 Eye Hosp051