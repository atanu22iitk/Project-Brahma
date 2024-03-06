/*
 * Copyright IBM Corp. All Rights Reserved.
 *
 * SPDX-License-Identifier: Apache-2.0
 */

'use strict';

const MedicalRecordContract = require('./lib/uploadPrescription');

module.exports.MedicalRecordContract = MedicalRecordContract;
module.exports.contracts = [ MedicalRecordContract ];
