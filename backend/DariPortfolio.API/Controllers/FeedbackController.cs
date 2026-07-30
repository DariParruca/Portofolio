using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using DariPortfolio.API.Data;
using DariPortfolio.API.DTOs;
using DariPortfolio.API.Models;
using DariPortfolio.API.Services;

namespace DariPortfolio.API.Controllers;

[ApiController]
[Route("api/feedback")]
public class FeedbackController(AppDbContext db, EmailService email, IConfiguration config) : ControllerBase
{
    [HttpPost]
    public async Task<IActionResult> Submit([FromBody] SubmitFeedbackRequest req)
    {
        // Honeypot — bots fill hidden fields
        if (!string.IsNullOrEmpty(req.Company))
            return Ok(new { ok = true });

        // Too-fast submission is likely a bot (< 2 s)
        if (req.DwellMs is int ms && ms < 2000)
            return Ok(new { ok = true });

        if (db.Feedback is not null)
        {
            db.Feedback.Add(new Feedback
            {
                Name = req.Name.Trim(),
                Email = string.IsNullOrWhiteSpace(req.Email) ? null : req.Email.Trim(),
                Rating = req.Rating,
                Message = req.Message.Trim(),
            });
            try
            {
                await db.SaveChangesAsync();
            }
            catch
            {
                // Ignore persistence errors in free-hosted environments.
            }
        }

        var stars = new string('★', req.Rating) + new string('☆', 5 - req.Rating);
        try
        {
            await email.SendAdminAlertAsync(
                $"🛡️ New gate feedback ({stars}) — {req.Name}",
                $"""
                <div style="font-family:system-ui,sans-serif;max-width:560px">
                  <h2 style="color:#8a6a2a">New visitor left a note</h2>
                  <p><b>Name:</b> {HtmlEncode(req.Name)}<br/>
                  <b>Email:</b> {HtmlEncode(req.Email ?? "—")}<br/>
                  <b>Rating:</b> {stars}</p>
                  <p style="background:#f6efdc;border-left:3px solid #c9a84c;padding:10px;white-space:pre-wrap">{HtmlEncode(req.Message)}</p>
                </div>
                """
            );
        }
        catch
        {
            // Ignore email errors in free-hosted environments.
        }

        return Ok(new { ok = true });
    }

    [HttpPost("admin")]
    public async Task<IActionResult> GetAdmin([FromBody] AdminFeedbackRequest req)
    {
        var expected = config["Admin:FeedbackKey"];
        if (string.IsNullOrEmpty(expected) || req.Key != expected)
            return Unauthorized(new { message = "Unauthorized" });

        try
        {
            var rows = await db.Feedback
                .OrderByDescending(f => f.CreatedAt)
                .Take(500)
                .Select(f => new FeedbackResponse(f.Id, f.Name, f.Email, f.Rating, f.Message, f.CreatedAt))
                .ToListAsync();

            var cvCount = await db.CvDownloads.CountAsync();

            return Ok(new { feedback = rows, cvDownloads = cvCount });
        }
        catch
        {
            return Ok(new { feedback = Array.Empty<object>(), cvDownloads = 0 });
        }
    }

    private static string HtmlEncode(string s) =>
        System.Net.WebUtility.HtmlEncode(s);
}
