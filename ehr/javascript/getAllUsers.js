/*
 * Copyright IBM Corp. All Rights Reserved.
 *
 * SPDX-License-Identifier: Apache-2.0
 */

'use strict';

const FabricCAServices = require('fabric-ca-client');
const fs = require('fs');
const path = require('path');


// Define your chaincode logic
const { Contract } = require('fabric-contract-api');

class getAllUsers extends Contract {

    async listRegisteredUsers(ctx) {
        // Check the organization name to list users of a particular org
        const orgName = ctx.clientIdentity.getMSPID();

        // Perform authorization checks if necessary

        // Retrieve all keys from the state database
        const iterator = await ctx.stub.getStateByRange('', '');

        const registeredUsers = [];

        // Iterate over the keys returned by the iterator
        while (true) {
            const result = await iterator.next();

            if (result.done) {
                break;
            }

            // Extract the key (user ID) from the iterator result
            const userId = result.value.key;

            // Check if the user ID belongs to the specified organization
            if (userId.includes(orgName)) {
                registeredUsers.push(userId.toString('utf8'));
            }
        }

        // Close the iterator
        await iterator.close();

        // Return the list of registered users
        return JSON.stringify(registeredUsers);
    }
}

// Export the chaincode class
module.exports = getAllUsers;



