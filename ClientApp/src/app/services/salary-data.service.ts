import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {getBaseUrl} from "../../main";
import {Observable} from "rxjs/Observable";

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable()
export class SalaryDataService {

  constructor(private http: HttpClient) { }



  getAllSalaryData() {
    return this.http.get(getBaseUrl() + 'api/salary-data', httpOptions);
  }

  getFilteredSalaryData(agency: string,  lowerLimit?: number, upperLimit?: number,  year?: string) {
    let route = getBaseUrl() + 'api/salary-data/' + agency;

    if (lowerLimit !== null)
      route = route + '/' + lowerLimit.toString() + '/' + upperLimit.toString();

    if (year !== null && year !== 'All')
      route = route + '/' + year;

    // console.log(route);

    return this.http.get(route);
  }

  getSalaryDataByEmployeeName(employee: string) {
    return this.http.get(getBaseUrl() + 'api/salary-data/employee/' + encodeURI(employee));
  }

  getSalaryDataByJobTitle(title: string) {
    return this.http.get(getBaseUrl() + 'api/salary-data/job/' + encodeURI(title));
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
