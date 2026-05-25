using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using WebApplication1.Models;
using WebApplication1.Services;

namespace WebApplication1.Controllers;

[ApiController]
[Route("api/services")]
public class ServicesController(AppDbContext db) : ControllerBase
{
    [HttpGet]
    public IActionResult GetAll() => Ok(db.Services.OrderBy(x => x.Id).ToList());

    [HttpPost, Authorize]
    public IActionResult Create([FromBody] Service body)
    {
        body.Id = 0;
        db.Services.Add(body);
        db.SaveChanges();
        return Ok(body);
    }

    [HttpPut("{id}"), Authorize]
    public IActionResult Update(int id, [FromBody] Service body)
    {
        if (!db.Services.Any(x => x.Id == id)) return NotFound();
        body.Id = id;
        db.Entry(body).State = EntityState.Modified;
        db.SaveChanges();
        db.Entry(body).Reload();
        return Ok(body);
    }

    [HttpDelete("{id}"), Authorize]
    public IActionResult Delete(int id)
    {
        var item = db.Services.Find(id);
        if (item == null) return NotFound();
        db.Services.Remove(item);
        db.SaveChanges();
        return NoContent();
    }

    [HttpGet("process")]
    public IActionResult GetProcess() => Ok(db.ServiceSteps.OrderBy(x => x.Id).ToList());

    [HttpPost("process"), Authorize]
    public IActionResult CreateStep([FromBody] ServiceStep body)
    {
        body.Id = 0;
        db.ServiceSteps.Add(body);
        db.SaveChanges();
        return Ok(body);
    }

    [HttpPut("process/{id}"), Authorize]
    public IActionResult UpdateStep(int id, [FromBody] ServiceStep body)
    {
        if (!db.ServiceSteps.Any(x => x.Id == id)) return NotFound();
        body.Id = id;
        db.Entry(body).State = EntityState.Modified;
        db.SaveChanges();
        db.Entry(body).Reload();
        return Ok(body);
    }

    [HttpDelete("process/{id}"), Authorize]
    public IActionResult DeleteStep(int id)
    {
        var item = db.ServiceSteps.Find(id);
        if (item == null) return NotFound();
        db.ServiceSteps.Remove(item);
        db.SaveChanges();
        return NoContent();
    }
}
