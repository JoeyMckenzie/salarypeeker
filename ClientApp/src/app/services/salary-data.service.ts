import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable()
export class SalaryDataService {

  constructor(private http: HttpClient) { }



  getAllSalaryData() {
    return this.http.get('api/salary', httpOptions);
  }

  getFilteredSalaryData(agency: string,  lowerLimit?: number, upperLimit?: number,  year?: string) {
    let route = 'api/salary/' + agency;

    if (lowerLimit !== null)
      route = route + '/' + lowerLimit.toString() + '/' + upperLimit.toString();

    if (year !== null && year !== 'All')
      route = route + '/' + year;

    console.log(route);

    return this.http.get(route, httpOptions);
  }

  getSalaryDataByEmployeeName(employee: string) {
    return this.http.get('api/salary/employee/' + encodeURI(employee), httpOptions);
  }

  getSalaryDataByJobTitle(title: string) {
    return this.http.get('api/salary/job/' + encodeURI(title), httpOptions);
  }
}

export class SalaryRecord {
  id: number;
  employeeName: string;
  jobTitle: string;
  basePay: number;
  overtimePay: number;
  otherPay: number;
  benefits: number;
  totalPay: number;
  totalPayBenefits: number;
  year: number;
  agency: string;
  status: string;
}
