using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using WebApplication1.Models;
using WebApplication1.Services;

namespace WebApplication1.Controllers;

[ApiController]
[Route("api/about")]
public class AboutController(AppDbContext db) : ControllerBase
{
    [HttpGet("stats")]
    public IActionResult GetStats() => Ok(db.HomeStats.OrderBy(x => x.Id).ToList());

    [HttpGet("who-we-are")]
    public IActionResult GetWhoWeAre()
        => Ok(db.AboutWhoWeAre.OrderBy(x => x.Order).Select(x => x.Paragraph).ToArray());

    [HttpPut("who-we-are"), Authorize]
    public IActionResult UpdateWhoWeAre([FromBody] string[] body)
    {
        db.AboutWhoWeAre.RemoveRange(db.AboutWhoWeAre.ToList());
        for (var i = 0; i < body.Length; i++)
            db.AboutWhoWeAre.Add(new AboutWhoWeAreItem { Order = i, Paragraph = body[i] });
        db.SaveChanges();
        return Ok(body);
    }

    [HttpGet("mission-vision")]
    public IActionResult GetMissionVision() => Ok(db.MissionVision.OrderBy(x => x.Id).ToList());

    [HttpPost("mission-vision"), Authorize]
    public IActionResult CreateMissionVision([FromBody] MissionVisionItem body)
    {
        body.Id = 0;
        db.MissionVision.Add(body);
        db.SaveChanges();
        return Ok(body);
    }

    [HttpPut("mission-vision/{id}"), Authorize]
    public IActionResult UpdateMissionVision(int id, [FromBody] MissionVisionItem body)
    {
        if (!db.MissionVision.Any(x => x.Id == id)) return NotFound();
        body.Id = id;
        db.Entry(body).State = EntityState.Modified;
        db.SaveChanges();
        db.Entry(body).Reload();
        return Ok(body);
    }

    [HttpDelete("mission-vision/{id}"), Authorize]
    public IActionResult DeleteMissionVision(int id)
    {
        var item = db.MissionVision.Find(id);
        if (item == null) return NotFound();
        db.MissionVision.Remove(item);
        db.SaveChanges();
        return NoContent();
    }

    [HttpGet("core-values")]
    public IActionResult GetCoreValues() => Ok(db.CoreValues.OrderBy(x => x.Id).ToList());

    [HttpPost("core-values"), Authorize]
    public IActionResult CreateCoreValue([FromBody] CoreValue body)
    {
        body.Id = 0;
        db.CoreValues.Add(body);
        db.SaveChanges();
        return Ok(body);
    }

    [HttpPut("core-values/{id}"), Authorize]
    public IActionResult UpdateCoreValue(int id, [FromBody] CoreValue body)
    {
        if (!db.CoreValues.Any(x => x.Id == id)) return NotFound();
        body.Id = id;
        db.Entry(body).State = EntityState.Modified;
        db.SaveChanges();
        db.Entry(body).Reload();
        return Ok(body);
    }

    [HttpDelete("core-values/{id}"), Authorize]
    public IActionResult DeleteCoreValue(int id)
    {
        var item = db.CoreValues.Find(id);
        if (item == null) return NotFound();
        db.CoreValues.Remove(item);
        db.SaveChanges();
        return NoContent();
    }

    [HttpGet("gallery")]
    public IActionResult GetGallery() => Ok(db.GallerySlides.OrderBy(x => x.Id).ToList());

    [HttpPost("gallery"), Authorize]
    public IActionResult CreateSlide([FromBody] GallerySlide body)
    {
        body.Id = 0;
        db.GallerySlides.Add(body);
        db.SaveChanges();
        return Ok(body);
    }

    [HttpPut("gallery/{id}"), Authorize]
    public IActionResult UpdateSlide(int id, [FromBody] GallerySlide body)
    {
        if (!db.GallerySlides.Any(x => x.Id == id)) return NotFound();
        body.Id = id;
        db.Entry(body).State = EntityState.Modified;
        db.SaveChanges();
        db.Entry(body).Reload();
        return Ok(body);
    }

    [HttpDelete("gallery/{id}"), Authorize]
    public IActionResult DeleteSlide(int id)
    {
        var item = db.GallerySlides.Find(id);
        if (item == null) return NotFound();
        db.GallerySlides.Remove(item);
        db.SaveChanges();
        return NoContent();
    }
}
