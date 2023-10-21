package main

// package chaincode

import (
	"github.com/hyperledger/fabric-contract-api-go/contractapi"
)

type SmartContract struct {
	contractapi.Contract
}

type Hospital struct {
	HospitalId byte   `json:"hospitalId"`
	Doctors    []byte `json:"doctors"`
	Staffs     []byte `json:"staff"`
	Patients   []byte `json:"patients"`
}

type Doctor struct {
	HospitalId   byte `json:"hospitalId"`
	DoctorId     byte `json:"doctorId"`
	ServiceNo    byte `json:"serviceNo"`
	DoctorStatus bool `json:"doctorStatus"`
}

type Staff struct {
	HospitalId  byte `json:"hospitalId"`
	StaffId     byte `json:"staffId"`
	ServiceNo   byte `json:"serviceNo"`
	StaffStatus bool `json:"staffStatus"`
}

type Patient struct {
	HospitalId    byte   `json:"hospitalId"`
	PatientId     byte   `json:"patientId"`
	ServiceNo     byte   `json:"serviceNo"`
	HealthRecords []byte `json:"healthRecord"`
}

type HealthRecord struct {
	DoctorsId   []byte `json:"doctorId"`
	StaffsId    []byte `json:"staffId"`
	PatientId   byte   `json:"patientId"`
	Description byte   `json:"description"`
	Reports     []byte `json:"report"`
	CurrentTime string `json:"currentTime"`
}

type Report struct {
	HealthRecordId byte   `json:"healthRecord"`
	ReportId       byte   `json:"reportId"`
	Description    byte   `json:"description"`
	CurrentTime    string `json:"currentTime"`
}
