using Microsoft.EntityFrameworkCore;
using DariPortfolio.API.Models;

namespace DariPortfolio.API.Data;

public class AppDbContext(DbContextOptions<AppDbContext> options) : DbContext(options)
{
    public DbSet<Feedback> Feedback => Set<Feedback>();
    public DbSet<CvDownload> CvDownloads => Set<CvDownload>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Feedback>(e =>
        {
            e.HasKey(f => f.Id);
            e.Property(f => f.Name).HasMaxLength(80).IsRequired();
            e.Property(f => f.Email).HasMaxLength(200);
            e.Property(f => f.Message).HasMaxLength(2000).IsRequired();
        });

        modelBuilder.Entity<CvDownload>(e =>
        {
            e.HasKey(d => d.Id);
            e.Property(d => d.UserAgent).HasMaxLength(500);
            e.Property(d => d.Referrer).HasMaxLength(500);
        });
    }
}
