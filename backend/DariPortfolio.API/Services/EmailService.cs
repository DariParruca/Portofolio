using System.Net.Http.Headers;
using System.Text.Json;

namespace DariPortfolio.API.Services;

public class EmailService(IHttpClientFactory httpClientFactory, IConfiguration config, ILogger<EmailService> logger)
{
    public async Task SendAdminAlertAsync(string subject, string html)
    {
        var apiKey = config["Email:LovableApiKey"];
        var resendKey = config["Email:ResendApiKey"];
        var to = config["Email:AdminEmail"] ?? "parrucadari@gmail.com";

        if (string.IsNullOrEmpty(apiKey) || string.IsNullOrEmpty(resendKey))
        {
            logger.LogInformation("[email] skipped — no keys configured: {Subject}", subject);
            return;
        }

        var payload = new
        {
            from = "Portfolio Gate <onboarding@resend.dev>",
            to = new[] { to },
            subject,
            html
        };

        try
        {
            var client = httpClientFactory.CreateClient();
            using var req = new HttpRequestMessage(HttpMethod.Post, "https://connector-gateway.lovable.dev/resend/emails");
            req.Headers.Authorization = new AuthenticationHeaderValue("Bearer", apiKey);
            req.Headers.Add("X-Connection-Api-Key", resendKey);
            req.Content = JsonContent.Create(payload);

            var response = await client.SendAsync(req);
            if (!response.IsSuccessStatusCode)
                logger.LogError("[email] failed {Status}: {Body}", response.StatusCode, await response.Content.ReadAsStringAsync());
        }
        catch (Exception ex)
        {
            logger.LogError(ex, "[email] error");
        }
    }
}
