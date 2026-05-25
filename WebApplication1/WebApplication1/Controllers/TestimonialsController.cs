using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using WebApplication1.Models;
using WebApplication1.Services;

namespace WebApplication1.Controllers;

[ApiController]
[Route("api/testimonials")]
public class TestimonialsController(AppDbContext db) : ControllerBase
{
    [HttpGet]
    public IActionResult GetAll() => Ok(db.Testimonials.OrderBy(x => x.Id).ToList());

    [HttpPost, Authorize]
    public IActionResult Create([FromBody] Testimonial body)
    {
        body.Id = 0;
        db.Testimonials.Add(body);
        db.SaveChanges();
        return Ok(body);
    }

    [HttpPut("{id}"), Authorize]
    public IActionResult Update(int id, [FromBody] Testimonial body)
    {
        if (!db.Testimonials.Any(x => x.Id == id)) return NotFound();
        body.Id = id;
        db.Entry(body).State = EntityState.Modified;
        db.SaveChanges();
        db.Entry(body).Reload();
        return Ok(body);
    }

    [HttpDelete("{id}"), Authorize]
    public IActionResult Delete(int id)
    {
        var item = db.Testimonials.Find(id);
        if (item == null) return NotFound();
        db.Testimonials.Remove(item);
        db.SaveChanges();
        return NoContent();
    }
}
