namespace DariPortfolio.API.Models;

public class CvDownload
{
    public Guid Id { get; set; } = Guid.NewGuid();
    public DateTimeOffset CreatedAt { get; set; } = DateTimeOffset.UtcNow;
    public string? UserAgent { get; set; }
    public string? Referrer { get; set; }
}
