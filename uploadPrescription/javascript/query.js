/*
 * Copyright IBM Corp. All Rights Reserved.
 *
 * SPDX-License-Identifier: Apache-2.0
 */

'use strict';

const { Gateway, Wallets } = require('fabric-network');
const path = require('path');
const fs = require('fs');
const { log } = require('console');
//const registerUser = require('./registerUser.js');

// in the main function we can pass the organization name as well as the parameters for the transaction
async function main(orgName, hospId, channelName, contractName, functionName, key) {
    try {
        
        // load the network configuration
        const ccpPath = path.resolve(__dirname, '..', '..', 'brahma_network', 'organizations', 'peerOrganizations', `${orgName}.brahma.com`, `connection-${orgName}.json`);
        const ccp = JSON.parse(fs.readFileSync(ccpPath, 'utf8'));

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
        }else{
            console.log("Identity in the wallet exists for the user: ",hospId);
        }

        // Create a new gateway for connecting to our peer node.
        const gateway = new Gateway();
        await gateway.connect(ccp, { wallet, identity: hospId, discovery: { enabled: true, asLocalhost: true } });

        // Get the network (channel) our contract is deployed to.
        const network = await gateway.getNetwork(channelName);
        // Get the contract from the network.
        const contract = network.getContract(contractName);
        // Evaluate the specified transaction.
        console.log(`Evaluating transaction: ${functionName}`);
        console.log(`Key: ${key}`);
        const resData = await contract.evaluateTransaction(`${functionName}`, `${key}`);
        console.log(`Got ${resData.toString()} , as data for the user`); 
        // Disconnect from the gateway.
        await gateway.disconnect();
        
    } catch (error) {
        console.error(`Failed to evaluate transaction: ${error}`);
        process.exit(1);
    }
}
module.exports = main;
main(process.argv[2], process.argv[3], process.argv[4], process.argv[5], process.argv[6], process.argv[7]);
// pass the parameters in following sequence hospId, channelName, contractName, functionName, orgName, key
// key is in the format hospId_timestamp
// values you get are in the format of JSON string patientId, doctorId, staffId, prescriptionId, department, hospId