/*
 * Copyright IBM Corp. All Rights Reserved.
 *
 * SPDX-License-Identifier: Apache-2.0
 */

'use strict';

const { Gateway, Wallets } = require('fabric-network');
const fs = require('fs');
const path = require('path');
// Function to generate a timestamp with nanosecond precision
async function generateTimestamp() {
    const hrtime = process.hrtime();
    console.log('hrtime:', hrtime);
    const nanoseconds = hrtime[0] * 1e9 + hrtime[1]; // Convert to nanoseconds
    return nanoseconds.toString();
}

// In the main function we can also pass the organisation name as well
async function main(userID, channelName, contractName, functionName, orgName, patientId, doctorId, staffId, prescriptionId, department, hospId) {
//async function main(userID, channelName, contractName, orgName) {
    try {
        // Get the current timestamp
        const time =await generateTimestamp();
        console.log('time:', time);
        // Create the key using patientId and timestamp
        const key = userID + '_' + time;
        // load the network configuration
        const ccpPath = path.resolve(__dirname, '..', '..', 'brahma_network', 'organizations', 'peerOrganizations', `${orgName}.brahma.com`, `connection-${orgName}.json`);
        let ccp = JSON.parse(fs.readFileSync(ccpPath, 'utf8'));

        // Create a new file system based wallet for managing identities.
        const walletPath = path.join(process.cwd(), 'wallet'+orgName);
        const wallet = await Wallets.newFileSystemWallet(walletPath);
        console.log(`Wallet path: ${walletPath}`);

        // Check to see if we've already enrolled the user.
        const identity = await wallet.get(userID);
        if (!identity) {
            console.log(`An identity for the user ${userID} does not exist in the wallet`);
            console.log('Run the registerUser.js application before retrying');
            return;
        }

        // Create a new gateway for connecting to our peer node.
        const gateway = new Gateway();
        console.log('gateway:', gateway);
        await gateway.connect(ccp, { wallet, identity: userID, discovery: { enabled: true, asLocalhost: true } });

        // Get the network (channel) our contract is deployed to.
        const network = await gateway.getNetwork(channelName);
        console.log('network:', network);
        // Get the contract from the network.
        const contract = network.getContract(contractName);
        var timeDate = String(Date.now());

        // Submit the specified transaction.
        const resData = await contract.submitTransaction(`${functionName}`, `${patientId}`, `${doctorId}`, `${staffId}`, `${prescriptionId}`, `${department}`, `${hospId}`, `${timeDate}`);
        //await contract.submitTransaction('initLedger', 'initialNullValues');
        console.log(`Transaction has been submitted. Got "${resData.toString()}" , as data for the user`);

        // Disconnect from the gateway.
        await gateway.disconnect();

    } catch (error) {
        console.error(`Failed to submit transaction: ${error}`);
        process.exit(1);
    }
}
//main(process.argv[2], process.argv[3], process.argv[4], process.argv[5]);
main(process.argv[2], process.argv[3], process.argv[4], process.argv[5], process.argv[6], process.argv[7], process.argv[8], process.argv[9], process.argv[10], process.argv[11], process.argv[12]);
// pass the parameters in following sequence userID, channelName, contractName, functionName, orgName, value
// key is in the format userid_timestamp, values should be patientId, doctorId, staffId, prescriptionId, department, hospId in sequence
//node invoke.js B0000002 newbrahmach genPrescription updatePrescriptionData org1 B0000001 D0000001 S00001 PRE00001 Eye Hosp051