using System;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata;

namespace SalaryPeeker.Models
{
    public class SalaryPeekerContext : DbContext
    {
        public SalaryPeekerContext()
        {
        }

        public SalaryPeekerContext(DbContextOptions options)
            : base(options)
        {
        }

        public virtual DbSet<SalaryRecord> SalaryRecords { get; set; }

        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {
            if (!optionsBuilder.IsConfigured)
            {
                optionsBuilder.UseSqlite("Data Source=SalaryPeeker.db");
            }
        }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<SalaryRecord>(entity =>
            {
                entity.ToTable("all-data");

                entity.HasIndex(e => e.Id)
                    .HasName("all-data_Id_uindex")
                    .IsUnique();

                entity.Property(e => e.Id).ValueGeneratedNever();

                entity.Property(e => e.BasePay).HasColumnName("Base Pay");

                entity.Property(e => e.EmployeeName).HasColumnName("Employee Name");

                entity.Property(e => e.JobTitle).HasColumnName("Job Title");

                entity.Property(e => e.OtherPay).HasColumnName("Other Pay");

                entity.Property(e => e.OvertimePay).HasColumnName("Overtime Pay");

                entity.Property(e => e.TotalPay).HasColumnName("Total Pay");

                entity.Property(e => e.TotalPayBenefits).HasColumnName("Total Pay & Benefits");
            });

        }
    }
}
