using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using WebApplication1.Models;
using WebApplication1.Services;

namespace WebApplication1.Controllers;

[ApiController]
[Route("api/internship")]
public class InternshipController(AppDbContext db) : ControllerBase
{
    [HttpGet("domains")]
    public IActionResult GetDomains() => Ok(db.InternDomains.OrderBy(x => x.Id).ToList());

    [HttpPost("domains"), Authorize]
    public IActionResult CreateDomain([FromBody] InternDomain body)
    {
        body.Id = 0;
        db.InternDomains.Add(body);
        db.SaveChanges();
        return Ok(body);
    }

    [HttpPut("domains/{id}"), Authorize]
    public IActionResult UpdateDomain(int id, [FromBody] InternDomain body)
    {
        if (!db.InternDomains.Any(x => x.Id == id)) return NotFound();
        body.Id = id;
        db.Entry(body).State = EntityState.Modified;
        db.SaveChanges();
        db.Entry(body).Reload();
        return Ok(body);
    }

    [HttpDelete("domains/{id}"), Authorize]
    public IActionResult DeleteDomain(int id)
    {
        var item = db.InternDomains.Find(id);
        if (item == null) return NotFound();
        db.InternDomains.Remove(item);
        db.SaveChanges();
        return NoContent();
    }

    [HttpGet("reasons")]
    public IActionResult GetReasons() => Ok(db.InternReasons.OrderBy(x => x.Id).ToList());

    [HttpPost("reasons"), Authorize]
    public IActionResult CreateReason([FromBody] InternReason body)
    {
        body.Id = 0;
        db.InternReasons.Add(body);
        db.SaveChanges();
        return Ok(body);
    }

    [HttpPut("reasons/{id}"), Authorize]
    public IActionResult UpdateReason(int id, [FromBody] InternReason body)
    {
        if (!db.InternReasons.Any(x => x.Id == id)) return NotFound();
        body.Id = id;
        db.Entry(body).State = EntityState.Modified;
        db.SaveChanges();
        db.Entry(body).Reload();
        return Ok(body);
    }

    [HttpDelete("reasons/{id}"), Authorize]
    public IActionResult DeleteReason(int id)
    {
        var item = db.InternReasons.Find(id);
        if (item == null) return NotFound();
        db.InternReasons.Remove(item);
        db.SaveChanges();
        return NoContent();
    }

    [HttpGet("benefits")]
    public IActionResult GetBenefits() => Ok(db.InternBenefits.OrderBy(x => x.Id).ToList());

    [HttpPost("benefits"), Authorize]
    public IActionResult CreateBenefit([FromBody] InternBenefit body)
    {
        body.Id = 0;
        db.InternBenefits.Add(body);
        db.SaveChanges();
        return Ok(body);
    }

    [HttpPut("benefits/{id}"), Authorize]
    public IActionResult UpdateBenefit(int id, [FromBody] InternBenefit body)
    {
        if (!db.InternBenefits.Any(x => x.Id == id)) return NotFound();
        body.Id = id;
        db.Entry(body).State = EntityState.Modified;
        db.SaveChanges();
        db.Entry(body).Reload();
        return Ok(body);
    }

    [HttpDelete("benefits/{id}"), Authorize]
    public IActionResult DeleteBenefit(int id)
    {
        var item = db.InternBenefits.Find(id);
        if (item == null) return NotFound();
        db.InternBenefits.Remove(item);
        db.SaveChanges();
        return NoContent();
    }

    [HttpGet("steps")]
    public IActionResult GetSteps() => Ok(db.InternSteps.OrderBy(x => x.Id).ToList());

    [HttpPost("steps"), Authorize]
    public IActionResult CreateStep([FromBody] InternStep body)
    {
        body.Id = 0;
        db.InternSteps.Add(body);
        db.SaveChanges();
        return Ok(body);
    }

    [HttpPut("steps/{id}"), Authorize]
    public IActionResult UpdateStep(int id, [FromBody] InternStep body)
    {
        if (!db.InternSteps.Any(x => x.Id == id)) return NotFound();
        body.Id = id;
        db.Entry(body).State = EntityState.Modified;
        db.SaveChanges();
        db.Entry(body).Reload();
        return Ok(body);
    }

    [HttpDelete("steps/{id}"), Authorize]
    public IActionResult DeleteStep(int id)
    {
        var item = db.InternSteps.Find(id);
        if (item == null) return NotFound();
        db.InternSteps.Remove(item);
        db.SaveChanges();
        return NoContent();
    }

    [HttpGet("eligibility")]
    public IActionResult GetEligibility() => Ok(db.EligibilityCards.OrderBy(x => x.Id).ToList());

    [HttpPost("eligibility"), Authorize]
    public IActionResult CreateCard([FromBody] EligibilityCard body)
    {
        body.Id = 0;
        db.EligibilityCards.Add(body);
        db.SaveChanges();
        return Ok(body);
    }

    [HttpPut("eligibility/{id}"), Authorize]
    public IActionResult UpdateCard(int id, [FromBody] EligibilityCard body)
    {
        if (!db.EligibilityCards.Any(x => x.Id == id)) return NotFound();
        body.Id = id;
        db.Entry(body).State = EntityState.Modified;
        db.SaveChanges();
        db.Entry(body).Reload();
        return Ok(body);
    }

    [HttpDelete("eligibility/{id}"), Authorize]
    public IActionResult DeleteCard(int id)
    {
        var item = db.EligibilityCards.Find(id);
        if (item == null) return NotFound();
        db.EligibilityCards.Remove(item);
        db.SaveChanges();
        return NoContent();
    }

    [HttpGet("faqs")]
    public IActionResult GetFaqs() => Ok(db.InternFAQs.OrderBy(x => x.Id).ToList());

    [HttpPost("faqs"), Authorize]
    public IActionResult CreateFaq([FromBody] InternFAQ body)
    {
        body.Id = 0;
        db.InternFAQs.Add(body);
        db.SaveChanges();
        return Ok(body);
    }

    [HttpPut("faqs/{id}"), Authorize]
    public IActionResult UpdateFaq(int id, [FromBody] InternFAQ body)
    {
        if (!db.InternFAQs.Any(x => x.Id == id)) return NotFound();
        body.Id = id;
        db.Entry(body).State = EntityState.Modified;
        db.SaveChanges();
        db.Entry(body).Reload();
        return Ok(body);
    }

    [HttpDelete("faqs/{id}"), Authorize]
    public IActionResult DeleteFaq(int id)
    {
        var item = db.InternFAQs.Find(id);
        if (item == null) return NotFound();
        db.InternFAQs.Remove(item);
        db.SaveChanges();
        return NoContent();
    }
}
