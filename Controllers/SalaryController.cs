using System;
using System.Collections.Generic;
using System.Globalization;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.ActionConstraints;
using Microsoft.EntityFrameworkCore;
using Newtonsoft.Json;
using SalaryPeeker.Data;
using SalaryPeeker.Models;

namespace SalaryPeeker.Controllers
{
    [Route("api/salary-data")]
    public class SalaryController : Controller
    {
        private readonly SalaryPeekerContext _context;

        public SalaryController(SalaryPeekerContext context)
        {
            _context = context;
        }

        //
        // GET: /api/salary-data/
        [HttpGet]
        public async Task<IActionResult> AllSalaryData()
        {
            var model = await _context.SalaryRecords.ToListAsync();
            
            return Ok(model);
        }

        //
        // GET: /api/salary-data/:agency/:lowerLimit/:upperLimit/:year
        [HttpGet("{agency}")]
        [HttpGet("{agency}/{lowerLimit}/{upperLimit}")]
        [HttpGet("{agency}/{lowerLimit}/{upperLimit}/{year}")]
        public IActionResult GetFilteredSalaries(string agency, int? lowerLimit, int? upperLimit, int? year)
        {
            //
            // Salary range will always come in a pair, so just check lower limit
            var useSalaryRange = lowerLimit != null;
            var useYear = year != null;
            var useAgency = agency != "All";
            
            var model = _context.SalaryRecords.AsQueryable();
            
            if (useAgency)
            {
                var textInfo = Thread.CurrentThread.CurrentCulture.TextInfo;
                agency = textInfo.ToTitleCase(agency);

                model = from m in model
                    where m.Agency == agency
                    select m;
            }

            if (useSalaryRange)
                model = from m in model
                    where m.TotalPayBenefits >= lowerLimit && m.TotalPayBenefits < upperLimit
                    select m;

            if (useYear)
                model = from m in model
                    where m.Year == year
                    select m;

            return Ok(model.ToList());
        }

        
        //
        // GET /api/salary-data/employee/:name
        [HttpGet("employee/{employeeName}")]
        public IActionResult SearchByEmployeeName(string employeeName)
        {
            var model = _context.SalaryRecords.Where(m => m.EmployeeName.ToLower().Contains(employeeName.ToLower()));

            return Ok(model.ToList());
        }
        
        //
        // GET /api/salary-data/job/:title
        [HttpGet("job/{title}")]
        public IActionResult SearchByJobTitle(string title)
        {
            var model = _context.SalaryRecords.Where(m => m.JobTitle.ToLower().Contains(title.ToLower()));

            return Ok(model.ToList());
        }
        
    }
}