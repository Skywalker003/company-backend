using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using WebApplication1.Models;
using WebApplication1.Services;

namespace WebApplication1.Controllers;

[ApiController]
[Route("api/portfolio")]
public class PortfolioController(AppDbContext db) : ControllerBase
{
    [HttpGet("topics")]
    public IActionResult GetTopics() => Ok(db.PortfolioTopics.OrderBy(x => x.Id).ToList());

    [HttpPost("topics"), Authorize]
    public IActionResult CreateTopic([FromBody] PortfolioTopic body)
    {
        if (string.IsNullOrWhiteSpace(body.Id)) return BadRequest("Topic id is required.");
        if (db.PortfolioTopics.Any(x => x.Id == body.Id)) return Conflict("Topic id already exists.");
        db.PortfolioTopics.Add(body);
        db.SaveChanges();
        return Ok(body);
    }

    [HttpPut("topics/{id}"), Authorize]
    public IActionResult UpdateTopic(string id, [FromBody] PortfolioTopic body)
    {
        if (!db.PortfolioTopics.Any(x => x.Id == id)) return NotFound();
        body.Id = id;
        db.Entry(body).State = EntityState.Modified;
        db.SaveChanges();
        db.Entry(body).Reload();
        return Ok(body);
    }

    [HttpDelete("topics/{id}"), Authorize]
    public IActionResult DeleteTopic(string id)
    {
        var item = db.PortfolioTopics.Find(id);
        if (item == null) return NotFound();
        db.PortfolioTopics.Remove(item);
        db.SaveChanges();
        return NoContent();
    }

    [HttpGet("items")]
    public IActionResult GetItems() => Ok(db.PortfolioItems.OrderBy(x => x.Id).ToList());

    [HttpPost("items"), Authorize]
    public IActionResult CreateItem([FromBody] PortfolioItem body)
    {
        body.Id = 0;
        db.PortfolioItems.Add(body);
        db.SaveChanges();
        return Ok(body);
    }

    [HttpPut("items/{id:int}"), Authorize]
    public IActionResult UpdateItem(int id, [FromBody] PortfolioItem body)
    {
        if (!db.PortfolioItems.Any(x => x.Id == id)) return NotFound();
        body.Id = id;
        db.Entry(body).State = EntityState.Modified;
        db.SaveChanges();
        db.Entry(body).Reload();
        return Ok(body);
    }

    [HttpDelete("items/{id:int}"), Authorize]
    public IActionResult DeleteItem(int id)
    {
        var item = db.PortfolioItems.Find(id);
        if (item == null) return NotFound();
        db.PortfolioItems.Remove(item);
        db.SaveChanges();
        return NoContent();
    }
}
