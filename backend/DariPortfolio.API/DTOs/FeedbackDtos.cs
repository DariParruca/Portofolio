using System.ComponentModel.DataAnnotations;

namespace DariPortfolio.API.DTOs;

public record SubmitFeedbackRequest(
    [Required, StringLength(80, MinimumLength = 1)] string Name,
    [EmailAddress, StringLength(200)] string? Email,
    [Range(1, 5)] int Rating,
    [Required, StringLength(2000, MinimumLength = 1)] string Message,
    string? Company,
    int? DwellMs
);

public record AdminFeedbackRequest([Required] string Key);

public record FeedbackResponse(
    Guid Id,
    string Name,
    string? Email,
    int Rating,
    string Message,
    DateTimeOffset CreatedAt
);
