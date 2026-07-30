using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using DariPortfolio.API.Data;
using DariPortfolio.API.DTOs;
using DariPortfolio.API.Models;

namespace DariPortfolio.API.Controllers;

[ApiController]
[Route("api/cv-download")]
public class CvDownloadController(AppDbContext db) : ControllerBase
{
    [HttpPost]
    public async Task<IActionResult> Track([FromBody] TrackCvDownloadRequest req)
    {
        try
        {
            db.CvDownloads.Add(new CvDownload
            {
                UserAgent = req.UserAgent?[..Math.Min(500, req.UserAgent.Length)],
                Referrer = req.Referrer?[..Math.Min(500, req.Referrer.Length)],
            });
            await db.SaveChangesAsync();

            var count = await db.CvDownloads.CountAsync();
            return Ok(new { count });
        }
        catch
        {
            return Ok(new { count = 0 });
        }
    }

    [HttpGet("count")]
    public async Task<IActionResult> GetCount()
    {
        var count = await db.CvDownloads.CountAsync();
        return Ok(new { count });
    }
}
