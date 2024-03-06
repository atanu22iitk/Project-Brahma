'use strict';

const { Contract } = require('fabric-contract-api');

class genPrescription extends Contract {
    async initLedger(ctx) {
        const prescriptionData = {
            patientId: 'B1',
            doctorId: 'D1',
            staffId: 'S1',
            prescriptionId: 'PRE1',
            department: 'Gynaecology',
            hospId: 'Hosp1',
            timestamp: '29Feb:1500',
        };
        await ctx.stub.putState('presData', Buffer.from(JSON.stringify(prescriptionData)));
        return 'prescriptionData Ledger initialized, containing a single object with some initial values';
    }

    async updatePrescriptionData(ctx, patientId, doctorId, staffId, prescriptionId, department, hospId, timeDate) {
        const dataBytes = await ctx.stub.getState('presData');
        if (!dataBytes) {
            throw new Error(`data on the key presData does not exist`);
        }
        let prescriptionData = JSON.parse(dataBytes.toString());
        prescriptionData.patientId = patientId;
        prescriptionData.doctorId = doctorId;
        prescriptionData.staffId = staffId;
        prescriptionData.prescriptionId = prescriptionId;
        prescriptionData.department = department;
        prescriptionData.hospId = hospId;
        prescriptionData.timestamp = timeDate;

        const key = patientId + '_' + timeDate;
        await ctx.stub.putState(`${key}`, Buffer.from(JSON.stringify(prescriptionData)));
        return key;
    }

    async queryPrescriptionData(ctx, key) {
        const prescriptionDataBytes = await ctx.stub.getState(key);

        if (!prescriptionDataBytes || prescriptionDataBytes.length === 0) {
            throw new Error(`Prescription data with key ${key} does not exist`);
        }

        let prescriptionData = JSON.parse(prescriptionDataBytes.toString());
        if (!prescriptionData) {
            throw new Error(`Prescription data with key ${key} does not exist`);
        }else{
            let ISTtime = new Date(Number(prescriptionData.timestamp))
            let TimeStamp = ISTtime.toLocaleString("en-US", { timeZoneName: 'short', timeZone: 'Asia/Kolkata', month: 'short', day: 'numeric', 
            year: 'numeric', hour: 'numeric', minute: 'numeric', second: 'numeric'});
            prescriptionData.timestamp = TimeStamp;
            return prescriptionData;
        }

    }

    async checkUserExists(ctx, userId) {
        const userKey = ctx.stub.createCompositeKey('client', [userId]);
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
