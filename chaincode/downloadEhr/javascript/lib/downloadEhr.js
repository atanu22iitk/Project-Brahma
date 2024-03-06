'use strict';

const { Contract } = require('fabric-contract-api');

class EHRDownload extends Contract {
    
    async initLedger(ctx) {
        console.info('============= START : Initialize Ledger ===========');
        const ehr_data = {
            patientId: 'B011',
            ehrID: 'ehr123',
            actions: 'downloaded',
            timestamp: '1200',
        };
        await ctx.stub.putState('ehr_data0', Buffer.from(JSON.stringify(ehr_data)));
        return 'ehr data Ledger initialized successfully';
    }

    async downloadEHR(ctx, patientId, ehrID, timestamp) {
                // Check if the EHR exists on the blockchain
        const ehrAsBytes = await ctx.stub.getState('ehr_data0');
        if (!ehrAsBytes || ehrAsBytes.length === 0) {
            throw new Error(`EHR with ID ${ehrID} does not exist`);
        }
        
        // Parse the EHR data
        const ehr = JSON.parse(ehrAsBytes.toString());
        ehr.patientId = patientId;
        ehr.ehrID = ehrID;
        ehr.timestamp = timestamp;

        const key = ehrID + '_' + timestamp;


        // Get the current date and time
        // const timestamp = new Date().toISOString();
    
        // Perform the download operation (e.g., download from IPFS)
        // In this case, we're just logging the download action
        console.log(`EHR downloaded: ${ehrID} for patient ${patientId} at ${timestamp}`);
    
              // Update the blockchain with download action
        
        await ctx.stub.putState(key, Buffer.from(JSON.stringify(ehr)));
    
        // Return the downloaded EHR
        return key;
    }
    async queryEhrStatus(ctx, key) {
        const DataBytes = await ctx.stub.getState(key);

        if (!DataBytes || DataBytes.length === 0) {
            throw new Error(`EHR Report with key ${key} does not exist`);
        }

        let ehr_data = JSON.parse(DataBytes.toString());
        if (!ehr_data) {
            throw new Error(`data on the ${key} EHR data does not exist`);
        }else{
            let ISTtime = new Date(Number(ehr_data.timestamp))
            let TimeStamp = ISTtime.toLocaleString("en-US", { timeZoneName: 'short', timeZone: 'Asia/Kolkata', month: 'short', day: 'numeric', 
            year: 'numeric', hour: 'numeric', minute: 'numeric', second: 'numeric'});
            ehr_data.timestamp = TimeStamp;
            return ehr_data;
        }

    }
}

module.exports = EHRDownload;
