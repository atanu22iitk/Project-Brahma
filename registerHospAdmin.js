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


async function registerHospAdmin(orgName, HospId, hospAdminID, hospAdminPwd) {
    
    try {
        
        // load the network configuration
        const ccpPath = path.resolve(__dirname, 'brahma_network', 'organizations', 'peerOrganizations', `${orgName}.brahma.com`, `connection-${orgName}.json`);
        const ccp = JSON.parse(fs.readFileSync(ccpPath, 'utf8'));

        // Create a new CA client for interacting with the CA.
        const caURL = ccp.certificateAuthorities[`ca.${orgName}.brahma.com`].url;
        const ca = new FabricCAServices(caURL);


        // Create a new file system based wallet for managing identities.
        const walletPath_Admin = path.join(process.cwd(), 'wallet', orgName);
        const walletPath_HospAdmin = path.join(process.cwd(), 'wallet', orgName, HospId);
        const wallet_Admin = await Wallets.newFileSystemWallet(walletPath_Admin);
        const wallet_HospAdmin = await Wallets.newFileSystemWallet(walletPath_HospAdmin);
        console.log(`Admin Wallet path: ${walletPath_Admin}`);
        console.log(`Sub Admin Wallet path: ${walletPath_HospAdmin}`);
        

        // Check to see if we've already enrolled the user.
        const hospAdminIdentity = await wallet_HospAdmin.get(hospAdminID);
        if (hospAdminIdentity) {
            console.log(`An identity for the HospAdmin ${hospAdminID} already exists in the wallet`);
            return;
        }

        // Check to see if we've already enrolled the admin user.
        const adminIdentity = await wallet_Admin.get(`admin`);
        if (!adminIdentity) {
            console.log(`An identity for the admin user "admin" does not exist in the wallet`);
            console.log('Run the enrollAdmin.js application before retrying');
            return;
        }

        // build a user object for authenticating with the CA
        const provider = wallet_Admin.getProviderRegistry().getProvider(adminIdentity.type);
        const adminUser = await provider.getUserContext(adminIdentity, 'admin');

        // Register the user, enroll the user, and import the new identity into the wallet.
        const secret = await ca.register({
            affiliation: `${orgName}.department1`,
            enrollmentID: `${hospAdminID}`,
            role: 'admin',
            pwd: `${hospAdminPwd}`
        }, adminUser);
        const enrollment = await ca.enroll({
            enrollmentID: hospAdminID,
            enrollmentSecret: secret
        });
        const x509Identity = {
            credentials: {
                certificate: enrollment.certificate,
                privateKey: enrollment.key.toBytes(),
            },
            mspId: `${orgName.charAt(0).toUpperCase() + orgName.slice(1)}MSP`,
            type: 'X.509',
            HospInfo: `${HospId}`
        };
        
        await wallet_HospAdmin.put(hospAdminID, x509Identity);
        console.log(`Successfully registered and enrolled HospAdmin user ${hospAdminID} and imported it into the wallet`);
        

    } catch (error) {
        console.error(`Failed to register user ${hospAdminID}: ${error}`);
        process.exit(1);
    }
}
module.exports = registerHospAdmin;
registerHospAdmin(process.argv[2],process.argv[3],process.argv[4],process.argv[5]);
// pass the parameters in the format org1 A0001 ; 
