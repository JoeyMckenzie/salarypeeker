import { Injectable } from '@angular/core';
import { HttpClient} from "@angular/common/http";
import {getBaseUrl} from "../../main";
import {Observable} from "rxjs/Observable";

@Injectable()
export class SalaryDataService {

  constructor(private http: HttpClient) { }

  getAllSalaryData(): Observable<SalaryRecord[]> {
    return this.http.get<SalaryRecord[]>(getBaseUrl() + 'api/salary-data', {responseType: 'json'});
  }

  getFilteredSalaryData(agency: string,  lowerLimit?: number, upperLimit?: number,  year?: string) {
    let route = getBaseUrl() + 'api/salary-data/' + agency;

    if (lowerLimit !== null)
      route = route + '/' + lowerLimit.toString() + '/' + upperLimit.toString();

    if (year !== null && year !== 'All')
      route = route + '/' + year;

    // console.log(route);

    return this.http.get<SalaryRecord[]>(route, {responseType: 'json'});
  }

  getSalaryDataByEmployeeName(employee: string) {
    return this.http.get<SalaryRecord[]>(getBaseUrl() + 'api/salary-data/employee/' + encodeURI(employee), {responseType: 'json'});
  }

  getSalaryDataByJobTitle(title: string) {
    return this.http.get<SalaryRecord[]>(getBaseUrl() + 'api/salary-data/job/' + encodeURI(title), {responseType: 'json'});
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
