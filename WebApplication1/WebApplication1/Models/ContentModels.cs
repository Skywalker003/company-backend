using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;
namespace WebApplication1.Models;

// Home
public class HomeStat
{
    public int Id { get; set; }
    public int End { get; set; }
    public string Suffix { get; set; } = "";
    public string Label { get; set; } = "";
    [JsonPropertyName("static")]
    public bool IsStatic { get; set; }
}

public class HomeFeature
{
    public int Id { get; set; }
    public string Title { get; set; } = "";
    public string Desc { get; set; } = "";
}

// Testimonials
public class Testimonial
{
    public int Id { get; set; }
    public string Name { get; set; } = "";
    public string Role { get; set; } = "";
    public string Company { get; set; } = "";
    public int Rating { get; set; }
    public string Quote { get; set; } = "";
}

// About
public class AboutWhoWeAreItem
{
    public int Id { get; set; }
    public int Order { get; set; }
    public string Paragraph { get; set; } = "";
}

public class MissionVisionItem
{
    public int Id { get; set; }
    public string Icon { get; set; } = "";
    public string Title { get; set; } = "";
    public string Description { get; set; } = "";
}

public class CoreValue
{
    public int Id { get; set; }
    public string Icon { get; set; } = "";
    public string Title { get; set; } = "";
    public string Desc { get; set; } = "";
}

public class GallerySlide
{
    public int Id { get; set; }
    public string Src { get; set; } = "";
    public string Caption { get; set; } = "";
}

// Services
public class Service
{
    public int Id { get; set; }
    public string Title { get; set; } = "";
    public string ShortDescription { get; set; } = "";
    public string Desc { get; set; } = "";
    public string Color { get; set; } = "";
    public string Bg { get; set; } = "";
    public string Icon { get; set; } = "";
    public string Anchor { get; set; } = "";
    public string Image { get; set; } = "";
    public List<string> Items { get; set; } = [];
}

public class ServiceStep
{
    public int Id { get; set; }
    public string Step { get; set; } = "";
    public string Icon { get; set; } = "";
    public string Title { get; set; } = "";
    public string Desc { get; set; } = "";
}

// Portfolio
public class PortfolioTopic
{
    [Key]
    public string Id { get; set; } = "";
    public string Label { get; set; } = "";
    public string FullLabel { get; set; } = "";
    public List<string> SubFilters { get; set; } = [];
}

public class PortfolioItem
{
    public int Id { get; set; }
    public string Topic { get; set; } = "";
    public string SubCategory { get; set; } = "";
    public string Tag { get; set; } = "";
    public bool Featured { get; set; }
    public string Title { get; set; } = "";
    public string Description { get; set; } = "";
    public List<string> Highlights { get; set; } = [];
    public string? Phase { get; set; }
}

// Careers
public class Job
{
    public int Id { get; set; }
    public string Title { get; set; } = "";
    public string Type { get; set; } = "";
    public string Location { get; set; } = "";
    public string Desc { get; set; } = "";
}

public class CareersReason
{
    public int Id { get; set; }
    public string Icon { get; set; } = "";
    public string Title { get; set; } = "";
    public string Desc { get; set; } = "";
}

// Internship
public class TagGroup
{
    public string Label { get; set; } = "";
    public List<string> Tags { get; set; } = [];
}

public class InternDomain
{
    public int Id { get; set; }
    public string Title { get; set; } = "";
    public string Badge { get; set; } = "";
    public string BadgeColor { get; set; } = "";
    public string Desc { get; set; } = "";
    public string DomainKey { get; set; } = "";
    public string Image { get; set; } = "";
    public string RolesLabel { get; set; } = "";
    public List<string> Roles { get; set; } = [];
    public string? TagsLabel { get; set; }
    public List<TagGroup> TagGroups { get; set; } = [];
}

public class InternReason
{
    public int Id { get; set; }
    public string Icon { get; set; } = "";
    public string Title { get; set; } = "";
    public string Text { get; set; } = "";
}

public class InternBenefit
{
    public int Id { get; set; }
    public string Benefit { get; set; } = "";
}

public class InternStep
{
    public int Id { get; set; }
    public string Num { get; set; } = "";
    public string Title { get; set; } = "";
    public string Text { get; set; } = "";
}

public class EligibilityCard
{
    public int Id { get; set; }
    public string Icon { get; set; } = "";
    public string Title { get; set; } = "";
    public string Text { get; set; } = "";
}

public class InternFAQ
{
    public int Id { get; set; }
    public string Q { get; set; } = "";
    public string A { get; set; } = "";
}

// Locations
public class Location
{
    public int Id { get; set; }
    public string Type { get; set; } = "";
    public string Name { get; set; } = "";
    public string Address { get; set; } = "";
    public string MapUrl { get; set; } = "";
}

public class FooterContact
{
    [Key]
    [JsonIgnore]
    public int Id { get; set; }
    public string Email { get; set; } = "";
    public string Hours { get; set; } = "";
    public string Address { get; set; } = "";
}

public class Headquarters
{
    [Key]
    [JsonIgnore]
    public int Id { get; set; }
    public string Name { get; set; } = "";
    public string Subtitle { get; set; } = "";
    public string MapUrl { get; set; } = "";
}
