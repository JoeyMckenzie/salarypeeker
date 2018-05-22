import { Component, OnInit } from '@angular/core';
import { SalaryDataService, SalaryRecord, PagingService } from "../services";
declare var $:any;

@Component({
  selector: 'app-salary-data',
  templateUrl: './salary-data.component.html',
  styleUrls: ['./salary-data.component.css']
})
export class SalaryDataComponent implements OnInit {

  constructor(public salaryDataService: SalaryDataService) { }

  // Display properties
  public salaries: SalaryRecord[];
  public useSpinner: boolean = false;
  public resultCount: number;
  public paging: any = {};
  public pagedRecords: SalaryRecord[];
  public agency: string = 'All';
  public salaryRange: string;
  public lowerLimit: number;
  public upperLimit: number;
  public year: string;
  public jobTitle: string;
  public employeeName: string;
  public alertUser: boolean;

  // Sort table
  public sortBy: string;
  public orderByAscending: boolean = true;
  public sortByType: string;

  // Data for chart
  public chartDataSalaries = [];
  public chartDataPayTypes = [];
  public loadGraph: boolean;
  type = 'bar';
  data: object;
  options = {
    responsive: true,
    maintainAspectRatio: false,
    tooltips: {
      callbacks: {
        label: function(tooltipItem, data) {
          return '$' + tooltipItem.yLabel.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
        },
      },
    },
    scales: {
      yAxes: [{
        ticks: {
          beginAtZero: true,
          callback: function(value, index, values) {
            if(parseInt(value) >= 1000){
              return '$' + value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
            } else {
              return '$' + value;
            }
          }
        }
      }]
    }
  };


  ngOnInit() {
    this.useSpinner = true;

    this.salaryDataService.getAllSalaryData()
      .subscribe(data => {
        this.salaries = data;


        // Get total number of results
        this.resultCount = this.salaries.length;

        // Initialize page to 1
        this.setPage(1);
        this.setChartData();
        // console.log(this.salaries);
      });
  }

  //
  // Wrapper for filter type
  public async setSortBy(field: string) {
    this.sortBy = field;
    this.orderByAscending = !this.orderByAscending;

    switch (this.sortByType) {
      case 'filtered':
        await this.getFilteredSalaries(this.agency, this.salaryRange, this.year);
        break;
      case 'job':
        await this.getSalaryByJob(this.jobTitle);
        break;
      case 'employee':
        await this.getSalaryByEmployee(this.employeeName);
        break;
      default:
        await this.getSalaries();
        break;
    }
  }

  //
  // Wrapper for selected agency
  public async setAgency(agency: string) {
    this.agency = agency;
    await this.getFilteredSalaries(this.agency, this.salaryRange, this.year);
  }

  //
  // Wrapper for salary bounds
  public setSalaryRange(range: string):void {
    switch (range) {
      case '0-49':
        this.lowerLimit = 0; this.upperLimit = 49999;
        break;
      case '50-99':
        this.lowerLimit = 50000; this.upperLimit = 99999;
        break;
      case '100-199':
        this.lowerLimit = 100000; this.upperLimit = 199999;
        break;
      case '200+':
        this.lowerLimit = 200000; this.upperLimit = 1000000;
        break;
      default:
        this.lowerLimit = 0; this.upperLimit = 1000000;
        break;
    }
  }

  //
  // Set to first page on new filtered model
  public setPage(page: number):void {
    if (page < 1 || page > this.paging.totalPages) {
      return;
    }

    // get paging object from service
    this.paging = PagingService.getPagination(this.salaries.length, page);

    // get current page of items
    this.pagedRecords = this.salaries.slice(this.paging.startIndex, this.paging.endIndex + 1);
    // console.log(this.pagedRecords);
  }

  //
  // Retrieve all salaries
  public async getSalaries() {
    this.useSpinner = true;
    this.loadGraph = false;

    await this.salaryDataService.getAllSalaryData()
      .subscribe(data => {
        this.salaries = data;

        if (this.sortBy !== null || this.sortBy !== undefined) this.sortResults(this.sortBy, this.orderByAscending);

        // Get total number of results
        this.resultCount = this.salaries.length;

        // Initialize page to 1
        this.setPage(1);
        this.setChartData();

        // console.log(this.salaries);
    });
  }


  //
  // Get filtered salaries
  public async getFilteredSalaries(agency: string, salaryRange?: string, year?: string) {
    // Clear search fields
    this.employeeName = null; this.jobTitle = null;
    this.useSpinner = true;
    this.loadGraph = false;
    this.setSalaryRange(salaryRange);
    this.sortByType = 'filtered';

    await this.salaryDataService.getFilteredSalaryData(agency, this.lowerLimit, this.upperLimit, year)
      .subscribe(data => {
        this.salaries = data;

        if (this.sortBy !== null || this.sortBy !== undefined) this.sortResults(this.sortBy, this.orderByAscending);

        // Get total number of results
        this.resultCount = this.salaries.length;

        // Initialize page to 1
        if (this.resultCount !== 0) this.setPage(1);
        this.setChartData();

      });
  }

  //
  // Search salary be employee
  public async getSalaryByEmployee(employee: string) {
    // Alert users if entering null string
    if (employee === null || employee === undefined)
    {
      this.alertUser = true;
      return;
    }

    this.loadGraph = false;
    this.sortByType = 'employee';
    this.alertUser = false;
    this.jobTitle = null; this.resetFilters();

    await this.salaryDataService.getSalaryDataByEmployeeName(employee)
      .subscribe(data => {
        this.salaries = data;

        if (this.sortBy !== null || this.sortBy !== undefined) this.sortResults(this.sortBy, this.orderByAscending);

        // Get total number of results
        this.resultCount = this.salaries.length;

        // Initialize page to 1
        if (this.resultCount !== 0) this.setPage(1);
        this.setChartData();

        // console.log(this.salaries);
      });
  }

  //
  // Search salary by job title
  public async getSalaryByJob(job: string) {
    // Alert users if entering null string
    if (job === null || job === undefined)
    {
      this.alertUser = true;
      return;
    }

    this.loadGraph = false;
    this.sortByType = 'job';
    this.alertUser = false;
    this.employeeName = null; this.resetFilters();

    await this.salaryDataService.getSalaryDataByJobTitle(job)
      .subscribe(data => {
        this.salaries = data;

        if (this.sortBy !== null || this.sortBy !== undefined) this.sortResults(this.sortBy, this.orderByAscending);

        // Get total number of results
        this.resultCount = this.salaries.length;

        // Initialize page to 1
        if (this.resultCount !== 0) this.setPage(1);
        this.setChartData();

        // console.log(this.salaries);
      });
  }


  //
  // Clears and resets
  public clearSalaryData():void {
    this.useSpinner = false;
    this.salaries = null;
  }

  public async clearSort() {
    this.sortBy = null;
    this.orderByAscending = false;
    this.resetFilters();
    await this.getSalaries();
  }

  public resetFilters():void {
    this.salaryRange = 'All';
    this.agency = 'All';
    this.year = 'All';

    // $("#allYears").prop("checked", true);
    // $("#allAgencies").prop("checked", true);
    // $("#allSalaries").prop("checked", true);
  }

  //
  // Sort values
  public sortResults(prop: string, asc: boolean):void {
    // Sort by identifier
    this.salaries = this.salaries.sort(function (a, b) {
      if (asc) {
        return (a[prop] > b[prop]) ? 1 : ((a[prop] < b[prop]) ? -1 : 0);
      } else {
        return (b[prop] > a[prop]) ? 1 : ((b[prop] < a[prop]) ? -1 : 0);
      }
    });
  }

  // Chart values
  public setChartData():void {
    // Clear previous chart data
    this.chartDataSalaries = [];
    this.chartDataPayTypes = [];

    // Get pay value totals
    let basePayTotal: number = 0;
    let overtimePayTotal: number = 0;
    let otherPayTotal: number = 0;
    let benefitsTotal: number = 0;
    let totalPayTotal: number = 0;
    let totalPayBenefitsTotal: number = 0;

    for (let i = 0; i < this.salaries.length; i++) {
      basePayTotal += this.salaries[i]['basePay'];
      overtimePayTotal += this.salaries[i]['overtimePay'];
      otherPayTotal += this.salaries[i]['otherPay'];
      benefitsTotal += this.salaries[i]['benefits'];
      totalPayTotal += this.salaries[i]['totalPay'];
      totalPayBenefitsTotal += this.salaries[i]['totalPayBenefits'];
    }


    this.chartDataPayTypes = [basePayTotal, overtimePayTotal, otherPayTotal, benefitsTotal, totalPayTotal, totalPayBenefitsTotal];

    this.data = {
      labels: ["Base Pay", "Overtime Pay", "Other Pay", "Benefits Pay", "Total Pay", "Total Pay + Benfits"],
      datasets: [
        {
          label: "Total Pay",
          fill: false,
          backgroundColor: ["rgba(255, 99, 132, 0.2)","rgba(255, 159, 64, 0.2)","rgba(255, 205, 86, 0.2)","rgba(75, 192, 192, 0.2)","rgba(54, 162, 235, 0.2)","rgba(153, 102, 255, 0.2)","rgba(201, 203, 207, 0.2)"],"borderColor":["rgb(255, 99, 132)","rgb(255, 159, 64)","rgb(255, 205, 86)","rgb(75, 192, 192)","rgb(54, 162, 235)","rgb(153, 102, 255)","rgb(201, 203, 207)"],
          borderWidth: 1,
          data: this.chartDataPayTypes
        }
      ]
    };

    // console.log("chartDataPayTypes: " + this.chartDataPayTypes);
  }
}
