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


async function registerSubAdmin(orgName, subAdminID) {
    
    try {
        
        // load the network configuration
        const ccpPath = path.resolve(__dirname, '..', '..', 'brahma_network', 'organizations', 'peerOrganizations', `${orgName}.brahma.com`, `connection-${orgName}.json`);
        const ccp = JSON.parse(fs.readFileSync(ccpPath, 'utf8'));

        // Create a new CA client for interacting with the CA.
        const caURL = ccp.certificateAuthorities[`ca.${orgName}.brahma.com`].url;
        const ca = new FabricCAServices(caURL);


        // Create a new file system based wallet for managing identities.
        const walletPath = path.join(process.cwd(), 'wallet'+orgName);
        const wallet = await Wallets.newFileSystemWallet(walletPath);
        console.log(`Wallet path: ${walletPath}`);
        

        // Check to see if we've already enrolled the user.
        const subAdminIdentity = await wallet.get(subAdminID);
        if (subAdminIdentity) {
            console.log(`An identity for the subAdmin ${subAdminID} already exists in the wallet`);
            return;
        }

        // Check to see if we've already enrolled the admin user.
        const adminIdentity = await wallet.get(`admin`);
        if (!adminIdentity) {
            console.log(`An identity for the admin user "admin" does not exist in the wallet`);
            console.log('Run the enrollAdmin.js application before retrying');
            return;
        }

        // build a user object for authenticating with the CA
        const provider = wallet.getProviderRegistry().getProvider(adminIdentity.type);
        const adminUser = await provider.getUserContext(adminIdentity, 'admin');

        // Register the user, enroll the user, and import the new identity into the wallet.
        const secret = await ca.register({
            affiliation: `${orgName}.department1`,
            enrollmentID: subAdminID,
            role: 'admin',
            pwd: `${subAdminID}@123`
        }, adminUser);
        const enrollment = await ca.enroll({
            enrollmentID: subAdminID,
            enrollmentSecret: secret
        });
        const x509Identity = {
            credentials: {
                certificate: enrollment.certificate,
                privateKey: enrollment.key.toBytes(),
            },
            mspId: `${orgName.charAt(0).toUpperCase() + orgName.slice(1)}MSP`,
            type: 'X.509',
        };
        
        await wallet.put(subAdminID, x509Identity);
        console.log(`Successfully registered and enrolled subAdmin user ${subAdminID} and imported it into the wallet`);
        

    } catch (error) {
        console.error(`Failed to register user ${subAdminID}: ${error}`);
        process.exit(1);
    }
}
module.exports = registerSubAdmin;
registerSubAdmin(process.argv[2],process.argv[3]);
// pass the parameters in the format org1 A0001 ; password is set by default as subAdminID@123
