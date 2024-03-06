'use strict';

const { Contract } = require('fabric-contract-api');

class ShareEhr extends Contract {
    async initLedger(ctx) {
        const EhrData = {
            patientId: 'B1',
            doctorId: 'D1',
            ehrId: 'LR001',
            timestamp: '29Feb:1500',
        };
        await ctx.stub.putState('ShareEhrData', Buffer.from(JSON.stringify(EhrData)));
        return 'ShareEhrData Ledger initialized, containing a single object with some initial values';
    }

    async addSharingInfo(ctx, patientId, doctorId, ehrId, timeDate) {
        const dataBytes = await ctx.stub.getState('ShareEhrData');
        if (!dataBytes) {
            throw new Error(`data on the key ShareEhrData does not exist`);
        }
        let EhrData = JSON.parse(dataBytes.toString());
        EhrData.patientId = patientId;
        EhrData.doctorId = doctorId;
        EhrData.ehrId = ehrId;
        EhrData.timestamp = timeDate;

        const key = ehrId + '_' + timeDate;
        await ctx.stub.putState(`${key}`, Buffer.from(JSON.stringify(EhrData)));
        return key;
    }

    async queryLabReport(ctx, key) {
        const DataBytes = await ctx.stub.getState(key);

        if (!DataBytes || DataBytes.length === 0) {
            throw new Error(`EhrSharingInfo with key "${key}" does not exist`);
        }

        let EhrData = JSON.parse(DataBytes.toString());
        if (!EhrData) {
            throw new Error(`data on EhrSharingInfo with "${key}" does not exist`);
        }else{
            console.log(EhrData.timestamp);
            let ISTtime = new Date(Number(EhrData.timestamp))
            let TimeStamp = ISTtime.toLocaleString("en-US", { timeZoneName: 'short', timeZone: 'Asia/Kolkata', month: 'short', day: 'numeric', 
            year: 'numeric', hour: 'numeric', minute: 'numeric', second: 'numeric'});
            EhrData.timestamp = TimeStamp;
            console.log("updated time", EhrData.timestamp);
            return EhrData;
        }
    }
}

module.exports = ShareEhr;
