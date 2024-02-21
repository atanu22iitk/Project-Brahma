/*
 * Copyright IBM Corp. All Rights Reserved.
 *
 * SPDX-License-Identifier: Apache-2.0
 */

'use strict';

const FabricCAServices = require('fabric-ca-client');
const { Wallets } = require('fabric-network');
const fs = require('fs');
const path = require('path');

async function enrollAdmin(orgName,userID) {
    if (userID != null && userID == `${orgName}Admin`) {
        try {
            // load the network configuration
            console.log("successful","load the network configuration");
            const ccpPath = path.resolve(__dirname, '..', '..', 'brahma_network', 'organizations', 'peerOrganizations', `${orgName}.brahma.com`, `connection-${orgName}.json`);
            console.log("successful",ccpPath);
            const ccp = JSON.parse(fs.readFileSync(ccpPath, 'utf8'));
            
    
            // Create a new CA client for interacting with the CA.
            const caInfo = ccp.certificateAuthorities[`ca.${orgName}.brahma.com`];
            console.log("Printing CA info: \n",caInfo);
            const caTLSCACerts = caInfo.tlsCACerts.pem;
            const ca = new FabricCAServices(caInfo.url, { trustedRoots: caTLSCACerts, verify: false }, caInfo.caName);
            console.log("successful",caInfo.url,caInfo.caName);
    
            // Create a new file system based wallet for managing identities.
            const walletPath = path.join(process.cwd(), 'wallet');
            const wallet = await Wallets.newFileSystemWallet(walletPath);
            console.log(`Wallet path: ${walletPath}`);
            console.log("successful",wallet);
    
            // Check to see if we've already enrolled the admin user.
            const identity = await wallet.get(`${orgName}Admin`);
            if (identity) {
                console.log(`An identity for the admin user "${orgName}Admin" already exists in the wallet`);
                return;
            }
    
            // Enroll the admin user, and import the new identity into the wallet.
            const enrollment = await ca.enroll({ enrollmentID: `${orgName}Admin`, enrollmentSecret: `${orgName}Admin@123` });
            const x509Identity = {
                credentials: {
                    certificate: enrollment.certificate,
                    privateKey: enrollment.key.toBytes(),
                },
                mspId: `${orgName}MSP`,
                type: 'X.509',
            };
            await wallet.put(`${orgName}Admin`, x509Identity);
            console.log(`Successfully enrolled admin user "${orgName}Admin" and imported it into the wallet`);
    
        } catch (error) {
            console.error(`Failed to enroll admin user "${orgName}Admin": ${error}`);
            process.exit(1);
        }
    } else {
        console.log("User ID should not be null and equal to orgNameAdmin, pass the parameters correctly.");
    }
    
}
module.exports = enrollAdmin;
enrollAdmin(process.argv[2],process.argv[3]);
