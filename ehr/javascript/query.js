/*
 * Copyright IBM Corp. All Rights Reserved.
 *
 * SPDX-License-Identifier: Apache-2.0
 */

'use strict';

const { Gateway, Wallets } = require('fabric-network');
const path = require('path');
const fs = require('fs');
const registerUser = require('./registerUser.js');

// in the main function we can pass the organization name as well as the parameters for the transaction
async function main(userID, orgName, channelName, contractName, functionName, fun1Name, fun2Name, key) {
    try {
        
        // load the network configuration
        const ccpPath = path.resolve(__dirname, '..', '..', 'brahma_network', 'organizations', 'peerOrganizations', `${orgName}.brahma.com`, `connection-${orgName}.json`);
        const ccp = JSON.parse(fs.readFileSync(ccpPath, 'utf8'));

        // Create a new file system based wallet for managing identities.
        const walletPath = path.join(process.cwd(), 'wallet');
        const wallet = await Wallets.newFileSystemWallet(walletPath);
        console.log(`Wallet path: ${walletPath}`);

        // Setting a default password for the user as userID@123
        const pass = userID + "@123";
        try {
            const result = await registerUser(userID, pass);
            if (!result) {
                console.log("User has not been registered successfully");
            }else{
            console.log("User has been registered successfully");
            }
        } catch (error) {
            console.log("Error in the chaincode function");
        }

        // Check to see if we've already enrolled the user.
        const identity = await wallet.get(userID);
        if (!identity) {
            console.log(`An identity for the user ${userID} does not exist in the wallet`);
            console.log('Run the registerUser.js application before retrying');
            return;
        }else{
            console.log("Identity in the wallet exists for the user: ",userID);
        }

        // Create a new gateway for connecting to our peer node.
        const gateway = new Gateway();
        await gateway.connect(ccp, { wallet, identity: userID, discovery: { enabled: true, asLocalhost: true } });

        // Get the network (channel) our contract is deployed to.
        const network = await gateway.getNetwork(channelName);
        //console.log(" Got the network as: ",network);
        //console.log(userID, orgName, channelName, contractName, functionName, fun1Name, fun2Name, key);
        // Get the contract from the network.
        const contract = network.getContract(contractName);
        //console.log(" Got the contract as: ",contract);
        // Evaluate the specified transaction.
        
        const resData = await contract.evaluateTransaction(fun2Name, key);
        console.log(`Got ${resData} , as data for the user`); 
        const userExistsResult = await contract.evaluateTransaction(fun1Name, `${userID}`);
        console.log(`Got ${userExistsResult} , User does not exist`);   
        // const allUsers = await contract.evaluateTransaction(functionName);
        // console.log(`Transaction has been evaluated, all registered Users are listed: ${allUsers.toString()}`);
        
        
        // console.log(`Transaction has been evaluated, result is: ${result.toString()}`);
        
        // Disconnect from the gateway.
        await gateway.disconnect();
        
    } catch (error) {
        console.error(`Failed to evaluate transaction: ${error}`);
        process.exit(1);
    }
}

main(process.argv[2], process.argv[3], process.argv[4], process.argv[5], process.argv[6], process.argv[7], process.argv[8], process.argv[9]);
