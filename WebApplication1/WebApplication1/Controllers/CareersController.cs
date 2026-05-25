using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using WebApplication1.Models;
using WebApplication1.Services;

namespace WebApplication1.Controllers;

[ApiController]
[Route("api/careers")]
public class CareersController(AppDbContext db) : ControllerBase
{
    [HttpGet("jobs")]
    public IActionResult GetJobs() => Ok(db.Jobs.OrderBy(x => x.Id).ToList());

    [HttpPost("jobs"), Authorize]
    public IActionResult CreateJob([FromBody] Job body)
    {
        body.Id = 0;
        db.Jobs.Add(body);
        db.SaveChanges();
        return Ok(body);
    }

    [HttpPut("jobs/{id}"), Authorize]
    public IActionResult UpdateJob(int id, [FromBody] Job body)
    {
        if (!db.Jobs.Any(x => x.Id == id)) return NotFound();
        body.Id = id;
        db.Entry(body).State = EntityState.Modified;
        db.SaveChanges();
        db.Entry(body).Reload();
        return Ok(body);
    }

    [HttpDelete("jobs/{id}"), Authorize]
    public IActionResult DeleteJob(int id)
    {
        var item = db.Jobs.Find(id);
        if (item == null) return NotFound();
        db.Jobs.Remove(item);
        db.SaveChanges();
        return NoContent();
    }

    [HttpGet("reasons")]
    public IActionResult GetReasons() => Ok(db.CareersReasons.OrderBy(x => x.Id).ToList());

    [HttpPost("reasons"), Authorize]
    public IActionResult CreateReason([FromBody] CareersReason body)
    {
        body.Id = 0;
        db.CareersReasons.Add(body);
        db.SaveChanges();
        return Ok(body);
    }

    [HttpPut("reasons/{id}"), Authorize]
    public IActionResult UpdateReason(int id, [FromBody] CareersReason body)
    {
        if (!db.CareersReasons.Any(x => x.Id == id)) return NotFound();
        body.Id = id;
        db.Entry(body).State = EntityState.Modified;
        db.SaveChanges();
        db.Entry(body).Reload();
        return Ok(body);
    }

    [HttpDelete("reasons/{id}"), Authorize]
    public IActionResult DeleteReason(int id)
    {
        var item = db.CareersReasons.Find(id);
        if (item == null) return NotFound();
        db.CareersReasons.Remove(item);
        db.SaveChanges();
        return NoContent();
    }
}
