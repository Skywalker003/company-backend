using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using WebApplication1.Models;
using WebApplication1.Services;

namespace WebApplication1.Controllers;

[ApiController]
[Route("api/submissions")]
public class SubmissionsController(AppDbContext db, IWebHostEnvironment env) : ControllerBase
{
    // ── Contact ───────────────────────────────────────────────────────────────

    [HttpGet("contact"), Authorize]
    public IActionResult GetContact([FromQuery] int page = 1, [FromQuery] int limit = 20)
    {
        var q = db.ContactEnquiries.OrderByDescending(x => x.Id);
        return Ok(new PagedResult<ContactEnquiry>(q.Skip((page - 1) * limit).Take(limit).ToList(), q.Count()));
    }

    [HttpPost("contact")]
    public IActionResult CreateContact([FromBody] ContactEnquiry body)
    {
        body.Id = 0;
        body.SubmittedAt = DateTime.UtcNow.ToString("o");
        db.ContactEnquiries.Add(body);
        db.SaveChanges();
        return Ok(body);
    }

    // ── Jobs ──────────────────────────────────────────────────────────────────

    [HttpGet("jobs"), Authorize]
    public IActionResult GetJobs([FromQuery] int page = 1, [FromQuery] int limit = 20)
    {
        var q = db.JobApplications.OrderByDescending(x => x.Id);
        return Ok(new PagedResult<JobApplication>(q.Skip((page - 1) * limit).Take(limit).ToList(), q.Count()));
    }

    [HttpPost("jobs")]
    public IActionResult CreateJob([FromBody] JobApplication body)
    {
        body.Id = 0;
        body.SubmittedAt = DateTime.UtcNow.ToString("o");
        db.JobApplications.Add(body);
        db.SaveChanges();
        return Ok(body);
    }

    // ── Internship ────────────────────────────────────────────────────────────

    [HttpGet("internship"), Authorize]
    public IActionResult GetInternship([FromQuery] int page = 1, [FromQuery] int limit = 20)
    {
        var q = db.InternshipApplications.OrderByDescending(x => x.Id);
        return Ok(new PagedResult<InternshipApplication>(q.Skip((page - 1) * limit).Take(limit).ToList(), q.Count()));
    }

    [HttpPost("internship")]
    public IActionResult CreateInternship([FromBody] InternshipApplication body)
    {
        body.Id = 0;
        body.SubmittedAt = DateTime.UtcNow.ToString("o");
        db.InternshipApplications.Add(body);
        db.SaveChanges();
        return Ok(body);
    }

    // ── File upload ───────────────────────────────────────────────────────────

    [HttpPost("upload")]
    public async Task<IActionResult> Upload(IFormFile file)
    {
        if (file == null || file.Length == 0) return BadRequest("No file.");
        if (file.Length > 5 * 1024 * 1024) return BadRequest("File exceeds 5 MB.");

        var ext = Path.GetExtension(file.FileName).ToLowerInvariant();
        string[] allowed = [".pdf", ".doc", ".docx", ".jpg", ".jpeg", ".png"];
        if (!allowed.Contains(ext)) return BadRequest("File type not allowed.");

        var uploadsDir = Path.Combine(
            env.WebRootPath ?? Path.Combine(env.ContentRootPath, "wwwroot"), "uploads");

        try { Directory.CreateDirectory(uploadsDir); }
        catch (Exception ex) { return StatusCode(500, $"Could not create uploads directory: {ex.Message}"); }

        var filename = $"{Guid.NewGuid()}{ext}";
        try
        {
            await using var stream = System.IO.File.Create(Path.Combine(uploadsDir, filename));
            await file.CopyToAsync(stream);
        }
        catch (Exception ex) { return StatusCode(500, $"File write failed: {ex.Message}"); }

        return Ok(new { url = $"/uploads/{filename}" });
    }

    // ── Delete ────────────────────────────────────────────────────────────────

    [HttpDelete("contact/{id}"), Authorize]
    public IActionResult DeleteContact(int id)
    {
        var item = db.ContactEnquiries.Find(id);
        if (item == null) return NotFound();
        db.ContactEnquiries.Remove(item);
        db.SaveChanges();
        return NoContent();
    }

    [HttpDelete("jobs/{id}"), Authorize]
    public IActionResult DeleteJob(int id)
    {
        var item = db.JobApplications.Find(id);
        if (item == null) return NotFound();
        db.JobApplications.Remove(item);
        db.SaveChanges();
        return NoContent();
    }

    [HttpDelete("internship/{id}"), Authorize]
    public IActionResult DeleteInternship(int id)
    {
        var item = db.InternshipApplications.Find(id);
        if (item == null) return NotFound();
        db.InternshipApplications.Remove(item);
        db.SaveChanges();
        return NoContent();
    }

    // ── Viewed tracking ───────────────────────────────────────────────────────

    [HttpGet("viewed"), Authorize]
    public IActionResult GetViewed()
        => Ok(db.ViewedSubmissions.Find(1) ?? new ViewedSubmissionsRow());

    [HttpPost("view"), Authorize]
    public IActionResult MarkViewed([FromBody] MarkViewedRequest body)
    {
        var row = db.ViewedSubmissions.Find(1);
        if (row == null) { row = new ViewedSubmissionsRow { Id = 1 }; db.ViewedSubmissions.Add(row); }

        switch (body.Type)
        {
            case "contact": row.Contact = [..new HashSet<int>(row.Contact) { body.Id }]; break;
            case "jobs":    row.Jobs    = [..new HashSet<int>(row.Jobs)    { body.Id }]; break;
            case "intern":  row.Intern  = [..new HashSet<int>(row.Intern)  { body.Id }]; break;
            default: return BadRequest("Invalid submission type.");
        }

        db.SaveChanges();
        return Ok();
    }
}
