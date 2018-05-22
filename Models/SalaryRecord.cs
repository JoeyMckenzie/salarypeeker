using System;
using System.Collections.Generic;

namespace SalaryPeeker.Models
{
    public partial class SalaryRecord
    {
        public long Id { get; set; }
        public string EmployeeName { get; set; }
        public string JobTitle { get; set; }
        public long? BasePay { get; set; }
        public long? OvertimePay { get; set; }
        public long? OtherPay { get; set; }
        public long? Benefits { get; set; }
        public long? TotalPay { get; set; }
        public long? TotalPayBenefits { get; set; }
        public long? Year { get; set; }
        public string Notes { get; set; }
        public string Agency { get; set; }
        public string Status { get; set; }
    }
}
