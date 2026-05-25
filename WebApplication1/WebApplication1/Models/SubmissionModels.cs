using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;
namespace WebApplication1.Models;

public class ContactEnquiry
{
    public int Id { get; set; }
    public string? SubmittedAt { get; set; }
    public string Name { get; set; } = "";
    public string Email { get; set; } = "";
    public string? Phone { get; set; }
    public string? OrgName { get; set; }
    public string? Address { get; set; }
    public string Message { get; set; } = "";
}

public class JobApplication
{
    public int Id { get; set; }
    public string? SubmittedAt { get; set; }
    public string FirstName { get; set; } = "";
    public string LastName { get; set; } = "";
    public string Email { get; set; } = "";
    public string? Phone { get; set; }
    public string? Position { get; set; }
    public string? Address { get; set; }
    public string? ResumeUrl { get; set; }
    public string? PhotoUrl { get; set; }
}

public class InternshipApplication
{
    public int Id { get; set; }
    public string? SubmittedAt { get; set; }
    public string FullName { get; set; } = "";
    public string? Gender { get; set; }
    public string? Dob { get; set; }
    public string Email { get; set; } = "";
    public string? Phone { get; set; }
    public string? FullAddress { get; set; }
    public string? District { get; set; }
    public string? State { get; set; }
    public string? Pincode { get; set; }
    public string? CollegeName { get; set; }
    public string? CollegeLocation { get; set; }
    public string? RegisterNo { get; set; }
    public string? Qualification { get; set; }
    public string? Department { get; set; }
    public string? CurrentStatus { get; set; }
    public string? PassedYear { get; set; }
    public string? Domain { get; set; }
    public string? Role { get; set; }
    public string? Mode { get; set; }
    public string? Duration { get; set; }
    public string? StartDate { get; set; }
    public string? EndDate { get; set; }
    public List<string>? Skills { get; set; }
    public List<string>? Tools { get; set; }
    public string? Experience { get; set; }
    public string? ResumeUrl { get; set; }
    public string? BonafideUrl { get; set; }
    public string? IdProofUrl { get; set; }
}

public record PagedResult<T>(List<T> Items, int Total);
public record MarkViewedRequest(string Type, int Id);

public class ViewedSubmissionsRow
{
    [Key]
    [JsonIgnore]
    public int Id { get; set; }
    public int[] Contact { get; set; } = [];
    public int[] Jobs { get; set; } = [];
    public int[] Intern { get; set; } = [];
}
