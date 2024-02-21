/*
 * Copyright IBM Corp. All Rights Reserved.
 *
 * SPDX-License-Identifier: Apache-2.0
 */

'use strict';

const { Wallets } = require('fabric-network');
const FabricCAServices = require('fabric-ca-client');
const fs = require('fs');
const path = require('path');


async function registerUser(userID, password, orgName) {
    
    try {
        
        // load the network configuration
        const ccpPath = path.resolve(__dirname, '..', '..', 'brahma_network', 'organizations', 'peerOrganizations', `${orgName}.brahma.com`, `connection-${orgName}.json`);
        const ccp = JSON.parse(fs.readFileSync(ccpPath, 'utf8'));

        // Create a new CA client for interacting with the CA.
        const caURL = ccp.certificateAuthorities[`ca.${orgName}.brahma.com`].url;
        const ca = new FabricCAServices(caURL);


        // Create a new file system based wallet for managing identities.
        const walletPath = path.join(process.cwd(), 'wallet');
        const wallet = await Wallets.newFileSystemWallet(walletPath);
        console.log(`Wallet path: ${walletPath}`);
        console.log("user is: ",userID);

        // Check to see if we've already enrolled the user.
        const userIdentity = await wallet.get(userID);
        if (userIdentity) {
            console.log(`An identity for the user ${userID} already exists in the wallet`);
            return;
        }

        // Check to see if we've already enrolled the admin user.
        const adminIdentity = await wallet.get(`${orgName}Admin`);
        if (!adminIdentity) {
            console.log(`An identity for the admin user "${orgName}Admin" does not exist in the wallet`);
            console.log('Run the enrollAdmin.js application before retrying');
            return;
        }

        // build a user object for authenticating with the CA
        const provider = wallet.getProviderRegistry().getProvider(adminIdentity.type);
        const adminUser = await provider.getUserContext(adminIdentity, 'org1Admin');

        // Register the user, enroll the user, and import the new identity into the wallet.
        const secret = await ca.register({
            affiliation: `${orgName}.department1`,
            enrollmentID: userID,
            role: 'client',
            pwd: password
        }, adminUser);
        const enrollment = await ca.enroll({
            enrollmentID: userID,
            enrollmentSecret: secret
        });
        const x509Identity = {
            credentials: {
                certificate: enrollment.certificate,
                privateKey: enrollment.key.toBytes(),
            },
            mspId: `${orgName}MSP`,
            type: 'X.509',
        };
        
        await wallet.put(userID, x509Identity);
        console.log(`Successfully registered and enrolled admin user ${userID} and imported it into the wallet`);
        return true;

    } catch (error) {
        console.error(`Failed to register user ${userID}: ${error}`);
        process.exit(1);
    }
}
module.exports = registerUser;
// main(process.argv[2],process.argv[3]);
