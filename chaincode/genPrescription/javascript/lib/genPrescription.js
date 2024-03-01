'use strict';

const { Contract } = require('fabric-contract-api');

class genPrescription extends Contract {
    async initLedger(ctx) {
        const prescriptionDataStruct = {
            patientId: 'B1',
            doctorId: 'D1',
            staffId: 'S1',
            prescriptionId: 'PRE1',
            department: 'Gynaecology',
            hospId: 'Hosp1',
            timestamp: '29Feb:1500',
        };

        const presDataArray = [Object.assign({}, prescriptionDataStruct)];
        await ctx.stub.putState('presData', Buffer.from(JSON.stringify(presDataArray[0])));
        return 'Ledger initialized with an array containing a single empty object';
    }

    async updatePrescriptionData(ctx, patientId, doctorId, staffId, prescriptionId, department, hospId, timeDate) {
        const dataArrayBytes = await ctx.stub.getState('presData');
        if (!dataArrayBytes) {
            throw new Error(`data on the key presData does not exist`);
        }
        let presDataArray = JSON.parse(dataArrayBytes.toString());
        // const presDataArray = [Object.assign({}, presDataString)];
        // if (!presDataArray || presDataArray.length === 0) {
        //     presDataArray.push({}); // Initialize with an empty object if array is empty
        //     throw new Error('Array does not exist or has not been initialized');
        // }
        
        // timeDate = timeDate.toLocaleString("en-US", { timeZoneName: 'short' });

        // const lastObjIndex = presDataArray.length - 1;
        presDataArray.patientId = patientId;
        presDataArray.doctorId = doctorId;
        presDataArray.staffId = staffId;
        presDataArray.prescriptionId = prescriptionId;
        presDataArray.department = department;
        presDataArray.hospId = hospId;
        presDataArray.timestamp = timeDate;

        const key = patientId + '_' + timeDate;
        await ctx.stub.putState(`${key}`, Buffer.from(JSON.stringify(presDataArray)));
        return key;
    }

    async queryPrescriptionData(ctx, key) {
        const prescriptionDataBytes = await ctx.stub.getState(key);

        if (!prescriptionDataBytes || prescriptionDataBytes.length === 0) {
            throw new Error(`Prescription data with key ${key} does not exist`);
        }

        const prescriptionData = JSON.parse(prescriptionDataBytes.toString());
        return prescriptionData;
    }

    async checkUserExists(ctx, userId) {
        const userKey = ctx.stub.createCompositeKey('user', [userId]);
        const userExists = await ctx.stub.getState(userKey);

        if (userExists && userExists.length > 0) {
            return true;
        } else {
            return false;
        }
    }

    async listAllUsers(ctx) {
        const iterator = await ctx.stub.getStateByPartialCompositeKey('user', []);
        const users = [];

        while (true) {
            const result = await iterator.next();

            if (result.value && result.value.value.toString()) {
                let user;
                try {
                    user = JSON.parse(result.value.value.toString('utf8'));
                } catch (err) {
                    user = result.value.value.toString('utf8');
                }
                users.push(user);
            }

            if (result.done) {
                await iterator.close();
                return JSON.stringify(users);
            }
        }
    }
}

module.exports = genPrescription;
