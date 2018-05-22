using Microsoft.EntityFrameworkCore;

namespace SalaryPeeker.Data
{
    public class SalaryPeekerDbContext : DbContext
    {
        public SalaryPeekerDbContext(DbContextOptions options)
            : base(options)
        {
        }
    }
}