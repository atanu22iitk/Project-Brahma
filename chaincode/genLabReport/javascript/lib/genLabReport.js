'use strict';

const { Contract } = require('fabric-contract-api');

class GenLabReport extends Contract {
    async initLedger(ctx) {
        const labReport = {
            patientId: 'B1',
            doctorId: 'D1',
            staffId: 'S1',
            labReportId: 'LR001',
            labName: 'X-ray Lab',
            hospId: 'Hosp1',
            timestamp: '29Feb:1500',
        };
        await ctx.stub.putState('LRData', Buffer.from(JSON.stringify(labReport)));
        return 'labReport Ledger initialized, containing a single object with some initial values';
    }

    async addLabReport(ctx, patientId, doctorId, staffId, labReportId, labName, hospId, timeDate) {
        const dataBytes = await ctx.stub.getState('LRData');
        if (!dataBytes) {
            throw new Error(`data on the key LabReportData does not exist`);
        }
        let LRData = JSON.parse(dataBytes.toString());
        LRData.patientId = patientId;
        LRData.doctorId = doctorId;
        LRData.staffId = staffId;
        LRData.labReportId = labReportId;
        LRData.labName = labName;
        LRData.hospId = hospId;
        LRData.timestamp = timeDate;

        const key = patientId + '_' + timeDate;
        await ctx.stub.putState(`${key}`, Buffer.from(JSON.stringify(LRData)));
        return key;
    }

    async queryLabReport(ctx, key) {
        const labReportDataBytes = await ctx.stub.getState(key);

        if (!labReportDataBytes || labReportDataBytes.length === 0) {
            throw new Error(`Lab Report with key ${key} does not exist`);
        }

        let LRData = JSON.parse(labReportDataBytes.toString());
        if (!LRData) {
            throw new Error(`data on the key LabReportData does not exist`);
        }else{
            let ISTtime = new Date(Number(LRData.timestamp))
            let TimeStamp = ISTtime.toLocaleString("en-US", { timeZoneName: 'short', timeZone: 'Asia/Kolkata', month: 'short', day: 'numeric', 
            year: 'numeric', hour: 'numeric', minute: 'numeric', second: 'numeric'});
            LRData.timestamp = TimeStamp;
            return LRData;
        }

    }

    async checkUserExists(ctx, hospId) {
        const userKey = ctx.stub.createCompositeKey('client', [hospId]);
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

module.exports = GenLabReport;
