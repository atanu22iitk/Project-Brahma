package main

// package chaincode

import (
	"github.com/hyperledger/fabric-contract-api-go/contractapi"
)

type SmartContract struct {
	contractapi.Contract
}

type Hospital struct {
	HospitalId string   `json:"HospitalId"`
	Doctors    []string `json:"Doctors"`
	Staffs     []string `json:"Staff"`
	Patients   []string `json:"Patients"`
}

type Doctor struct {
	HospitalId   string `json:"HospitalId"`
	DoctorId     string `json:"DoctorId"`
	ServiceNo    string `json:"ServiceNo"`
	DoctorStatus bool   `json:"DoctorStatus"`
}

type Staff struct {
	HospitalId  string `json:"HospitalId"`
	StaffId     string `json:"StaffId"`
	ServiceNo   string `json:"ServiceNo"`
	StaffStatus bool   `json:"StaffStatus"`
}

type Patient struct {
	HospitalId    string   `json:"HospitalId"`
	PatientId     string   `json:"PatientId"`
	ServiceNo     string   `json:"ServiceNo"`
	HealthRecords []string `json:"HealthRecord"`
}

type HealthRecord struct {
	DoctorsId   []string `json:"DoctorId"`
	StaffsId    []string `json:"StaffId"`
	PatientId   string   `json:"PatientId"`
	Description string   `json:"Description"`
	Reports     []string `json:"Report"`
	CurrentTime string   `json:"CurrentTime"`
}

type Report struct {
	HealthRecordId string `json:"HealthRecord"`
	ReportId       string `json:"ReportId"`
	Description    string `json:"Description"`
	CurrentTime    string `json:"CurrentTime"`
}

/ #######################################################################################################
// ###################################### HOSPITAL OPERATIONS ######################################
// #######################################################################################################

/*
	@dev function to create a new hospital
	@param hospitalId - string value
*/

func (s *SmartContract) AddHospital(ctx contractapi.TransactionContextInterface, hospitalId string) error {
	// check input parameters not be empty
	if hospitalId == "" {
		return fmt.Errorf("hospitalId is required")
	}

	// check if hospital already not exists
	if hospitalExists, err := s.HasHospitalExists(ctx, hospitalId); err != nil {
		return fmt.Errorf("failed to check hospital existence: %v", err)
	} else if hospitalExists {
		return fmt.Errorf("hospital %s already exists", hospitalId)
	}

	// create hospital instance
	hospital := Hospital{
		HospitalId: hospitalId,
		Doctors:    []string{},
		Staffs:     []string{},
		Patients:   []string{},
	}

	// parse the hospital
	hospitalJSON, err := json.Marshal(hospital)
	if err != nil {
		return fmt.Errorf("error marshalling hospital record: %v", err)
	}

	// save the hospital
	return ctx.GetStub().PutState(hospitalId, hospitalJSON)
}

/*
	@dev function to update a hospital
	@param hospitalId - string value
*/

func (s *SmartContract) UpdateHospital(ctx contractapi.TransactionContextInterface, hospitalId string) error {
	// check input parameter not be empty
	if hospitalId == "" {
		return fmt.Errorf("hospitalId is required")
	}

	// check if hospital must exists
	if hospitalExists, err := s.HasHospitalExists(ctx, hospitalId); err != nil {
		return fmt.Errorf("failed to check hospital existence: %v", err)
	} else if !hospitalExists {
		return fmt.Errorf("hospital %s does not exists", hospitalId)
	}

	// get the hospital
	hospitalJSON, err := ctx.GetStub().GetState(hospitalId)
	if err != nil {
		return fmt.Errorf("failed to read from world state: %v", err)
	}
	if hospitalJSON == nil {
		return fmt.Errorf("hospital %s does not exist", hospitalId)
	}

	// save the updated hospital
	return ctx.GetStub().PutState(hospitalId, hospitalJSON)
}

/*
	@dev function to delete a hospital
	@param hospitalId - string value
*/

func (s *SmartContract) DeleteHospital(ctx contractapi.TransactionContextInterface, hospitalId string) error {
	// check input parameter not be empty
	if hospitalId == "" {
		return fmt.Errorf("hospitalId is required")
	}
	// check if hospital must exists
	if hospitalExists, err := s.HasHospitalExists(ctx, hospitalId); err != nil {
		return fmt.Errorf("failed to check hospital existence: %v", err)
	} else if !hospitalExists {
		return fmt.Errorf("hospital %s does not exists", hospitalId)
	}

	// delete the hospital
	return ctx.GetStub().DelState(hospitalId)
}

/*
@dev function to check hospital is already exists or not
@param hospitalId - string value
*/

func (s *SmartContract) HasHospitalExists(ctx contractapi.TransactionContextInterface, hospitalId string) (bool, error) {
	// check input parameter not be empty
	if hospitalId == "" {
		return false, fmt.Errorf("hospitalId is required")
	}

	// get the hospital
	hospitalJSON, err := ctx.GetStub().GetState(hospitalId)
	if err != nil {
		return false, fmt.Errorf("Failed to read hospital data from state %v", err)
	}

	return hospitalJSON != nil, nil
}


/*
	@dev function to get hospital details
	@param hospitalId - string value
*/

func (s *SmartContract) GetHospital(ctx contractapi.TransactionContextInterface, hospitalId string) (*Hospital, error) {
	// check input parameter not be empty
	if hospitalId == "" {
		return nil, fmt.Errorf("hospitalId is required")
	}

	// check if hospital must exists
	if hospitalExists, err := s.HasHospitalExists(ctx, hospitalId); err != nil {
		return nil, fmt.Errorf("failed to check hospital existence: %v", err)
	} else if !hospitalExists {
		return nil, fmt.Errorf("hospital %s does not exists", hospitalId)
	}

	// get the hospital
	hospitalJSON, err := ctx.GetStub().GetState(hospitalId)
	if err != nil {
		return nil, fmt.Errorf("failed to read from world state: %v", err)
	}
	if hospitalJSON == nil {
		return nil, fmt.Errorf("hospital %s does not exist", hospitalId)
	}

	// create hospital instance
	var hospital Hospital
	err = json.Unmarshal(hospitalJSON, &hospital)
	if err != nil {
		return nil, fmt.Errorf("error unmarshalling hospital record: %v", err)
	}

	return &hospital, nil
}

/*
	@dev function to get doctors id inside hospital
	@param hospitalId - string value
*/

func (s *SmartContract) GetDoctorsByHospital(ctx contractapi.TransactionContextInterface, hospitalId string) ([]string, error) {
	// check input parameter not be empty
	if hospitalId == "" {
		return nil, fmt.Errorf("hospitalId is required")
	}

	// check if hospital must exists
	if hospitalExists, err := s.HasHospitalExists(ctx, hospitalId); err != nil {
		return nil, fmt.Errorf("failed to check hospital existence: %v", err)
	} else if !hospitalExists {
		return nil, fmt.Errorf("hospital %s does not exists", hospitalId)
	}

	hospitalJSON, err := ctx.GetStub().GetState(hospitalId)
	if err != nil {
		return nil, fmt.Errorf("failed to read from world state: %v", err)
	}
	if hospitalJSON == nil {
		return nil, fmt.Errorf("hospital %s does not exist", hospitalId)
	}

	var hospital Hospital
	err = json.Unmarshal(hospitalJSON, &hospital)
	if err != nil {
		return nil, fmt.Errorf("error unmarshalling hospital JSON: %v", err)
	}

	var doctors []string
	for _, doctorId := range hospital.Doctors {
		doctorJSON, err := ctx.GetStub().GetState(doctorId)
		if err != nil {
			return nil, fmt.Errorf("failed to read doctor data from world state: %v", err)
		}
		if doctorJSON == nil {
			continue
		}

		var doctor Doctor
		err = json.Unmarshal(doctorJSON, &doctor)
		if err != nil {
			return nil, fmt.Errorf("error unmarshalling doctor JSON: %v", err)
		}

		doctors = append(doctors, doctor.DoctorId)
	}

	return doctors, nil
}

/*
	@dev function to get staff's id inside hospital
	@param hospitalId - string value
*/

func (s *SmartContract) GetStaffsByHospital(ctx contractapi.TransactionContextInterface, hospitalId string) ([]string, error) {
	// check input parameter not be empty
	if hospitalId == "" {
		return nil, fmt.Errorf("hospitalId is required")
	}

	// check if hospital must exists
	if hospitalExists, err := s.HasHospitalExists(ctx, hospitalId); err != nil {
		return nil, fmt.Errorf("failed to check hospital existence: %v", err)
	} else if !hospitalExists {
		return nil, fmt.Errorf("hospital %s does not exists", hospitalId)
	}

	hospitalJSON, err := ctx.GetStub().GetState(hospitalId)
	if err != nil {
		return nil, fmt.Errorf("failed to read from world state: %v", err)
	}
	if hospitalJSON == nil {
		return nil, fmt.Errorf("hospital %s does not exist", hospitalId)
	}

	var hospital Hospital
	err = json.Unmarshal(hospitalJSON, &hospital)
	if err != nil {
		return nil, fmt.Errorf("error unmarshalling hospital JSON: %v", err)
	}

	var staffs []string
	for _, staffId := range hospital.Staffs {
		staffJSON, err := ctx.GetStub().GetState(staffId)
		if err != nil {
			return nil, fmt.Errorf("failed to read patient data from world state: %v", err)
		}
		if staffJSON == nil {
			continue
		}

		var staff Staff
		err = json.Unmarshal(staffJSON, &staff)
		if err != nil {
			return nil, fmt.Errorf("error unmarshalling staff JSON: %v", err)
		}

		staffs = append(staffs, staff.StaffId)
	}

	return staffs, nil
}

/*
	@dev function to get patient's id inside hospital
	@param hospitalId - string value
*/

func (s *SmartContract) GetPatientsByHospital(ctx contractapi.TransactionContextInterface, hospitalId string) ([]string, error) {
	// check input parameter not be empty
	if hospitalId == "" {
		return nil, fmt.Errorf("hospitalId is required")
	}

	// check if hospital must exists
	if hospitalExists, err := s.HasHospitalExists(ctx, hospitalId); err != nil {
		return nil, fmt.Errorf("failed to check hospital existence: %v", err)
	} else if !hospitalExists {
		return nil, fmt.Errorf("hospital %s does not exists", hospitalId)
	}

	hospitalJSON, err := ctx.GetStub().GetState(hospitalId)
	if err != nil {
		return nil, fmt.Errorf("failed to read from world state: %v", err)
	}
	if hospitalJSON == nil {
		return nil, fmt.Errorf("hospital %s does not exist", hospitalId)
	}

	var hospital Hospital
	err = json.Unmarshal(hospitalJSON, &hospital)
	if err != nil {
		return nil, fmt.Errorf("error unmarshalling hospital JSON: %v", err)
	}

	var patients []string
	for _, patientId := range hospital.Patients {
		patientJSON, err := ctx.GetStub().GetState(patientId)
		if err != nil {
			return nil, fmt.Errorf("failed to read patient data from world state: %v", err)
		}
		if patientJSON == nil {
			continue
		}

		var patient Patient
		err = json.Unmarshal(patientJSON, &patient)
		if err != nil {
			return nil, fmt.Errorf("error unmarshalling patient JSON: %v", err)
		}

		patients = append(patients, patient.PatientId)
	}

	return patients, nil
}

// #######################################################################################################
// ###################################### DOCTOR OPERATIONS ######################################
// #######################################################################################################

/*
	@dev function to create a new doctor
	@param hospitalId - string value
	@param doctorId - string value
	@param serviceNo - string value
*/

func (s *SmartContract) AddDoctor(ctx contractapi.TransactionContextInterface, hospitalId string, doctorId string, serviceNo string) error {
	// check parameters not be empty
	if hospitalId == "" || doctorId == "" || serviceNo == "" {
		return fmt.Errorf("hospitalId, doctorId and serviceNo are required")
	}

	// check if hospital must exists
	if hospitalExists, err := s.HasHospitalExists(ctx, hospitalId); err != nil {
		return fmt.Errorf("failed to check hospital existence: %v", err)
	} else if !hospitalExists {
		return fmt.Errorf("hospital %s does not exists", hospitalId)
	}

	// check if doctor already not exists
	if doctorExists, err := s.HasDoctorExists(ctx, doctorId); err != nil {
		return fmt.Errorf("failed to check doctor existence: %v", err)
	} else if doctorExists {
		return fmt.Errorf("doctor %s already exists", doctorId)
	}

	// create doctor instance
	doctor := Doctor{
		HospitalId:   hospitalId,
		DoctorId:     doctorId,
		ServiceNo:    serviceNo,
		DoctorStatus: true,
	}

	// parse the doctor
	doctorJSON, err := json.Marshal(doctor)
	if err != nil {
		return fmt.Errorf("error marshalling hospital record: %v", err)
	}

	// save the doctor
	err = ctx.GetStub().PutState(doctorId, doctorJSON)
	if err != nil {
		return fmt.Errorf("failed to put doctor record in world state: %v", err)
	}

	// get the hospital details
	hospitalJSON, err := ctx.GetStub().GetState(hospitalId)
	if err != nil {
		return fmt.Errorf("failed to read from world state: %v", err)
	}
	if hospitalJSON == nil {
		return fmt.Errorf("hospital %s does not exist", hospitalId)
	}

	// create hospital instance
	var hospital Hospital
	err = json.Unmarshal(hospitalJSON, &hospital)
	if err != nil {
		return fmt.Errorf("error unmarshalling hospital record: %v", err)
	}

	// append the doctor to the doctors list
	hospital.Doctors = append(hospital.Doctors, doctorId)

	// parse updated hospital details
	updatedHospitalJSON, err := json.Marshal(hospital)
	if err != nil {
		return fmt.Errorf("error marshalling updated hospital record: %v", err)
	}

	// save the updated hospital
	return ctx.GetStub().PutState(hospitalId, updatedHospitalJSON)
}

/*
	@dev function to update a new doctor
	@param hospitalId - string value
	@param doctorId - string value
*/

func (s *SmartContract) UpdateDoctor(ctx contractapi.TransactionContextInterface, hospitalId string, doctorId string) error {
	// Input validation
	if hospitalId == "" || doctorId == "" {
		return fmt.Errorf("hospitalId and doctorId are required")
	}

	// Check if the hospital exists
	hospitalExists, err := s.HasHospitalExists(ctx, hospitalId)
	if err != nil {
		return fmt.Errorf("failed to check hospital existence: %v", err)
	} else if !hospitalExists {
		return fmt.Errorf("hospital %s does not exist", hospitalId)
	}

	// Check if the doctor exists
	doctorExists, err := s.HasDoctorExists(ctx, doctorId)
	if err != nil {
		return fmt.Errorf("failed to check doctor existence: %v", err)
	} else if !doctorExists {
		return fmt.Errorf("doctor %s does not exist", doctorId)
	}

	// Retrieve the doctor's current data
	doctorJSON, err := ctx.GetStub().GetState(doctorId)
	if err != nil {
		return fmt.Errorf("failed to read doctor data from world state: %v", err)
	} else if doctorJSON == nil {
		return fmt.Errorf("the doctor %s does not exist", doctorId)
	}

	var doctor Doctor
	err = json.Unmarshal(doctorJSON, &doctor)
	if err != nil {
		return fmt.Errorf("error unmarshalling doctor JSON: %v", err)
	}

	// Check that the doctor is part of the hospital
	if doctor.HospitalId != hospitalId {
		return fmt.Errorf("doctor %s is not part of hospital %s", doctorId, hospitalId)
	}

	updatedDoctorJSON, err := json.Marshal(doctor)
	if err != nil {
		return fmt.Errorf("error marshalling updated doctor data: %v", err)
	}

	// Save the updated doctor
	return ctx.GetStub().PutState(doctorId, updatedDoctorJSON)
}

/*
	@dev function to delete a doctor
	@param hospitalId - string value
	@param doctorId - string value
*/

func (s *SmartContract) DeleteDoctor(ctx contractapi.TransactionContextInterface, hospitalId string, doctorId string) error {
	// check parameters not be empty
	if hospitalId == "" || doctorId == "" {
		return fmt.Errorf("hospitalId and doctorId are required")
	}

	// check ospital must exists
	if hospitalExists, err := s.HasHospitalExists(ctx, hospitalId); err != nil {
		return fmt.Errorf("failed to check hospital existence: %v", err)
	} else if !hospitalExists {
		return fmt.Errorf("hospital %s does not exists", hospitalId)
	}

	// check doctor must exists
	doctorExists, err := s.HasDoctorExists(ctx, doctorId)
	if err != nil {
		return fmt.Errorf("failed to check doctor existence: %v", err)
	} else if !doctorExists {
		return fmt.Errorf("doctor %s does not exist", doctorId)
	}

	// retrieve the doctor's current data
	doctorJSON, err := ctx.GetStub().GetState(doctorId)
	if err != nil {
		return fmt.Errorf("failed to read doctor from world state: %v", err)
	}
	if doctorJSON == nil {
		return fmt.Errorf("doctor %s does not exist", doctorId)
	}

	// delete doctor
	err = ctx.GetStub().DelState(doctorId)
	if err != nil {
		return fmt.Errorf("failed to delete doctor %s: %v", doctorId, err)
	}

	// get the hospital details
	hospitalJSON, err := ctx.GetStub().GetState(hospitalId)
	if err != nil {
		return fmt.Errorf("failed to read hospital from world state: %v", err)
	}
	if hospitalJSON == nil {
		return fmt.Errorf("hospital %s does not exist", hospitalId)
	}

	// create hospital instance
	var hospital Hospital
	err = json.Unmarshal(hospitalJSON, &hospital)
	if err != nil {
		return fmt.Errorf("error unmarshalling hospital record: %v", err)
	}

	// remove the doctor from the doctors list
	for i, docId := range hospital.Doctors {
		if docId == doctorId {
			hospital.Doctors = append(hospital.Doctors[:i], hospital.Doctors[i+1:]...)
			break
		}
	}

	// parse updated hospital details
	updatedHospitalJSON, err := json.Marshal(hospital)
	if err != nil {
		return fmt.Errorf("error marshalling updated hospital record: %v", err)
	}

	// save the updated hospital
	return ctx.GetStub().PutState(hospitalId, updatedHospitalJSON)
}

/*
	@dev function to check has doctor exists or not
	@param doctorId - string value
*/

func (s *SmartContract) HasDoctorExists(ctx contractapi.TransactionContextInterface, doctorId string) (bool, error) {
	// check parameters not be empty
	if doctorId == "" {
		return false, fmt.Errorf("doctorId is required")
	}

	// retrieve the doctor's current data
	doctorJSON, err := ctx.GetStub().GetState(doctorId)
	if err != nil {
		return false, fmt.Errorf("Failed to read doctor data from state %v", err)
	}

	return doctorJSON != nil, nil
}
