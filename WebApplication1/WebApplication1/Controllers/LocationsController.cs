using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using WebApplication1.Models;
using WebApplication1.Services;

namespace WebApplication1.Controllers;

[ApiController]
[Route("api/locations")]
public class LocationsController(AppDbContext db) : ControllerBase
{
    [HttpGet]
    public IActionResult GetAll() => Ok(db.Locations.OrderBy(x => x.Id).ToList());

    [HttpPost, Authorize]
    public IActionResult Create([FromBody] Location body)
    {
        body.Id = 0;
        db.Locations.Add(body);
        db.SaveChanges();
        return Ok(body);
    }

    [HttpPut("{id}"), Authorize]
    public IActionResult Update(int id, [FromBody] Location body)
    {
        if (!db.Locations.Any(x => x.Id == id)) return NotFound();
        body.Id = id;
        db.Entry(body).State = EntityState.Modified;
        db.SaveChanges();
        db.Entry(body).Reload();
        return Ok(body);
    }

    [HttpDelete("{id}"), Authorize]
    public IActionResult Delete(int id)
    {
        var item = db.Locations.Find(id);
        if (item == null) return NotFound();
        db.Locations.Remove(item);
        db.SaveChanges();
        return NoContent();
    }

    [HttpGet("footer-contact")]
    public IActionResult GetFooterContact()
    {
        var fc = db.FooterContacts.Find(1);
        return fc is null ? NotFound() : Ok(fc);
    }

    [HttpPut("footer-contact"), Authorize]
    public IActionResult UpdateFooterContact([FromBody] FooterContact body)
    {
        body.Id = 1;
        var exists = db.FooterContacts.Any(x => x.Id == 1);
        db.Entry(body).State = exists ? EntityState.Modified : EntityState.Added;
        db.SaveChanges();
        db.Entry(body).Reload();
        return Ok(body);
    }

    [HttpGet("headquarters")]
    public IActionResult GetHeadquarters()
    {
        var hq = db.Hq.Find(1);
        return hq is null ? NotFound() : Ok(hq);
    }

    [HttpPut("headquarters"), Authorize]
    public IActionResult UpdateHeadquarters([FromBody] Headquarters body)
    {
        body.Id = 1;
        var exists = db.Hq.Any(x => x.Id == 1);
        db.Entry(body).State = exists ? EntityState.Modified : EntityState.Added;
        db.SaveChanges();
        db.Entry(body).Reload();
        return Ok(body);
    }
}
