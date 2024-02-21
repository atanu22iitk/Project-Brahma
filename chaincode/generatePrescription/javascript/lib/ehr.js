/*
 * Copyright IBM Corp. All Rights Reserved.
 *
 * SPDX-License-Identifier: Apache-2.0
 */

'use strict';

const { Contract } = require('fabric-contract-api');

class ehr extends Contract {
    //initLedger
    async initLedger (ctx){
        console.info('============= START : Initialize Ledger ===========');
        await ctx.stub.putState("test", "Practice Data");
        return "Success";
    
    }
        
    //WriteData
    async writeData(ctx, key, value) {
        console.info('============= START : WriteData ===========');
        await ctx.stub.putState(key, value);
        console.log ("Value is : " + value)
        return value;
        console.info('============= END : WriteData ===========');
    }
    //ReadData
    async readData(ctx, key) {
        console.info('============= START : readData ===========');
        const data = await ctx.stub.getState(key);
        if (!data || data.length === 0) {
            throw new Error(`The data ${key} does not exist`);
        }
        console.log(data.toString());
        return data.toString();
    }
    
    //checkUserExistsById
    async checkUserExists(ctx, userId) {
        console.log("Entering checkUserExists function"); // Log entry into the function
    
        const userKey = ctx.stub.createCompositeKey('user', [userId]);
        console.log("Generated user key:", userKey); // Log the generated user key
    
        const userExists = await ctx.stub.getState(userKey);
        console.log("Retrieved userExists:", userExists); // Log the retrieved userExists state
    
        if (userExists && userExists.length > 0) {
            console.log("User exists."); // Log that the user exists
            console.log("Exiting checkUserExists function"); // Log exiting the function
            return true;
        } else {
            console.log("User does not exist."); // Log that the user does not exist
            console.log("Exiting checkUserExists function"); // Log exiting the function
            return false;
        }
    }
    
    
    
    //getAllUsersByOrg
    async listAllUsers(ctx) {
        console.log("Entering listAllUsers function"); // Add a logging statement to indicate entry into the function
    
        const iterator = await ctx.stub.getStateByPartialCompositeKey('user', []);
        const users = [];
    
        console.log("Retrieved iterator:", iterator); // Log the iterator to see if it's retrieved successfully
    
        // Iterate over the iterator
        while (true) {
            const result = await iterator.next();
    
            if (result.value && result.value.value.toString()) {
                let user;
                try {
                    user = JSON.parse(result.value.value.toString('utf8'));
                } catch (err) {
                    console.log("Error parsing user data:", err); // Log any errors during parsing
                    user = result.value.value.toString('utf8');
                }
                console.log("Retrieved user:", user); // Log the user data retrieved
                users.push(user);
            }
    
            if (result.done) {
                console.log("Iterator finished. Closing..."); // Log when the iteration is finished
                await iterator.close();
                console.log("Iterator closed."); // Log when the iterator is closed
                console.log("Exiting listAllUsers function"); // Log when exiting the function
                return JSON.stringify(users);
            }
        }
    }
    
    
    

}

module.exports = ehr;
