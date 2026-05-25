using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using WebApplication1.Models;
using WebApplication1.Services;

namespace WebApplication1.Controllers;

[ApiController]
[Route("api/home")]
public class HomeController(AppDbContext db) : ControllerBase
{
    [HttpGet("stats")]
    public IActionResult GetStats() => Ok(db.HomeStats.OrderBy(x => x.Id).ToList());

    [HttpPost("stats"), Authorize]
    public IActionResult CreateStat([FromBody] HomeStat body)
    {
        body.Id = 0;
        db.HomeStats.Add(body);
        db.SaveChanges();
        return Ok(body);
    }

    [HttpPut("stats/{id}"), Authorize]
    public IActionResult UpdateStat(int id, [FromBody] HomeStat body)
    {
        if (!db.HomeStats.Any(x => x.Id == id)) return NotFound();
        body.Id = id;
        db.Entry(body).State = EntityState.Modified;
        db.SaveChanges();
        db.Entry(body).Reload();
        return Ok(body);
    }

    [HttpDelete("stats/{id}"), Authorize]
    public IActionResult DeleteStat(int id)
    {
        var item = db.HomeStats.Find(id);
        if (item == null) return NotFound();
        db.HomeStats.Remove(item);
        db.SaveChanges();
        return NoContent();
    }

    [HttpGet("features")]
    public IActionResult GetFeatures() => Ok(db.HomeFeatures.OrderBy(x => x.Id).ToList());

    [HttpPost("features"), Authorize]
    public IActionResult CreateFeature([FromBody] HomeFeature body)
    {
        body.Id = 0;
        db.HomeFeatures.Add(body);
        db.SaveChanges();
        return Ok(body);
    }

    [HttpPut("features/{id}"), Authorize]
    public IActionResult UpdateFeature(int id, [FromBody] HomeFeature body)
    {
        if (!db.HomeFeatures.Any(x => x.Id == id)) return NotFound();
        body.Id = id;
        db.Entry(body).State = EntityState.Modified;
        db.SaveChanges();
        db.Entry(body).Reload();
        return Ok(body);
    }

    [HttpDelete("features/{id}"), Authorize]
    public IActionResult DeleteFeature(int id)
    {
        var item = db.HomeFeatures.Find(id);
        if (item == null) return NotFound();
        db.HomeFeatures.Remove(item);
        db.SaveChanges();
        return NoContent();
    }
}
