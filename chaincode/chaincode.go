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
