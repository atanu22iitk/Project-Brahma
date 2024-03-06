'use strict'; 
const { Contract } = require('fabric-contract-api');

class MedicalRecordContract extends Contract {
    async initLedger(ctx) {
        const medicalRecord = {
            
            patientId: 'B1',
            docId: 'A101',
            contentId:'123',
            timeStamp: '1200',
        };

        await ctx.stub.putState('initData', Buffer.from(JSON.stringify(medicalRecord)));
        return 'Ledger initialized with an array containing a single empty object';
    }

    async createMedicalRecord(ctx, documentID, contentID, patientID, timestamp) {
        
        const dataBytes = await ctx.stub.getState('initData');
        if (!dataBytes) {
            throw new Error('Initial data of Medical Record does not exist');
        }
        let medicalRecord = JSON.parse(dataBytes.toString());
        // Create a new medical record object
        medicalRecord.patientId = patientID;
        medicalRecord.docId = documentID;
        medicalRecord.contentId = contentID;
        medicalRecord.timeStamp = timestamp;

        const key = documentID+'_'+timestamp;
        await ctx.stub.putState(`${key}`, Buffer.from(JSON.stringify(medicalRecord)));
        return key;
    }

    async queryMedicalRecord(ctx, key) {
        const DataBytes = await ctx.stub.getState(key);

        if (!DataBytes || DataBytes.length === 0) {
            throw new Error(`MedicalRecord with key "${key}" does not exist`);
        }

        let medicalRecord = JSON.parse(DataBytes.toString());
        if (!medicalRecord) {
            throw new Error(`Data on Medical Record with "${key}" does not exist`);
        }else{
            
            let ISTtime = new Date(Number(medicalRecord.timeStamp))
            let TimeStamp = ISTtime.toLocaleString("en-US", { timeZoneName: 'short', timeZone: 'Asia/Kolkata', month: 'short', day: 'numeric', 
            year: 'numeric', hour: 'numeric', minute: 'numeric', second: 'numeric'});
            medicalRecord.timeStamp = TimeStamp;
            return medicalRecord;
        }
    }

   
}

module.exports = MedicalRecordContract;
