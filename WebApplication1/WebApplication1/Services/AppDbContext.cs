using System.Text.Json;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.ChangeTracking;
using WebApplication1.Models;

namespace WebApplication1.Services;

public class AppDbContext(DbContextOptions<AppDbContext> options) : DbContext(options)
{
    // Home
    public DbSet<HomeStat> HomeStats => Set<HomeStat>();
    public DbSet<HomeFeature> HomeFeatures => Set<HomeFeature>();
    public DbSet<Testimonial> Testimonials => Set<Testimonial>();

    // About
    public DbSet<AboutWhoWeAreItem> AboutWhoWeAre => Set<AboutWhoWeAreItem>();
    public DbSet<MissionVisionItem> MissionVision => Set<MissionVisionItem>();
    public DbSet<CoreValue> CoreValues => Set<CoreValue>();
    public DbSet<GallerySlide> GallerySlides => Set<GallerySlide>();

    // Services
    public DbSet<Service> Services => Set<Service>();
    public DbSet<ServiceStep> ServiceSteps => Set<ServiceStep>();

    // Portfolio
    public DbSet<PortfolioTopic> PortfolioTopics => Set<PortfolioTopic>();
    public DbSet<PortfolioItem> PortfolioItems => Set<PortfolioItem>();

    // Careers
    public DbSet<Job> Jobs => Set<Job>();
    public DbSet<CareersReason> CareersReasons => Set<CareersReason>();

    // Internship
    public DbSet<InternDomain> InternDomains => Set<InternDomain>();
    public DbSet<InternReason> InternReasons => Set<InternReason>();
    public DbSet<InternBenefit> InternBenefits => Set<InternBenefit>();
    public DbSet<InternStep> InternSteps => Set<InternStep>();
    public DbSet<EligibilityCard> EligibilityCards => Set<EligibilityCard>();
    public DbSet<InternFAQ> InternFAQs => Set<InternFAQ>();

    // Locations
    public DbSet<Location> Locations => Set<Location>();
    public DbSet<FooterContact> FooterContacts => Set<FooterContact>();
    public DbSet<Headquarters> Hq => Set<Headquarters>();

    // Submissions
    public DbSet<ContactEnquiry> ContactEnquiries => Set<ContactEnquiry>();
    public DbSet<JobApplication> JobApplications => Set<JobApplication>();
    public DbSet<InternshipApplication> InternshipApplications => Set<InternshipApplication>();
    public DbSet<ViewedSubmissionsRow> ViewedSubmissions => Set<ViewedSubmissionsRow>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        var opts = new JsonSerializerOptions { PropertyNamingPolicy = JsonNamingPolicy.CamelCase };

        // Items 1 & 2: value comparers for all List<string> / int[] native array properties
        // so EF detects content changes (not just reference changes) on tracked entities.
        var stringListComparer = new ValueComparer<List<string>>(
            (a, b) => a != null && b != null && a.SequenceEqual(b),
            c => c.Aggregate(0, (h, v) => HashCode.Combine(h, v.GetHashCode())),
            c => c.ToList()
        );

        var nullableStringListComparer = new ValueComparer<List<string>?>(
            (a, b) => (a == null && b == null) || (a != null && b != null && a.SequenceEqual(b)),
            c => c == null ? 0 : c.Aggregate(0, (h, v) => HashCode.Combine(h, v.GetHashCode())),
            c => c == null ? null : c.ToList()
        );

        var intArrayComparer = new ValueComparer<int[]>(
            (a, b) => a != null && b != null && a.SequenceEqual(b),
            c => c.Aggregate(0, (h, v) => HashCode.Combine(h, v)),
            c => c.ToArray()
        );

        modelBuilder.Entity<Service>()
            .Property(e => e.Items)
            .Metadata.SetValueComparer(stringListComparer);

        modelBuilder.Entity<PortfolioTopic>()
            .Property(e => e.SubFilters)
            .Metadata.SetValueComparer(stringListComparer);

        modelBuilder.Entity<PortfolioItem>()
            .Property(e => e.Highlights)
            .Metadata.SetValueComparer(stringListComparer);

        modelBuilder.Entity<InternDomain>()
            .Property(e => e.Roles)
            .Metadata.SetValueComparer(stringListComparer);

        modelBuilder.Entity<InternshipApplication>()
            .Property(e => e.Skills)
            .Metadata.SetValueComparer(nullableStringListComparer);

        modelBuilder.Entity<InternshipApplication>()
            .Property(e => e.Tools)
            .Metadata.SetValueComparer(nullableStringListComparer);

        // Item 5: value comparer for ViewedSubmissionsRow int[] arrays
        modelBuilder.Entity<ViewedSubmissionsRow>()
            .Property(e => e.Contact)
            .Metadata.SetValueComparer(intArrayComparer);

        modelBuilder.Entity<ViewedSubmissionsRow>()
            .Property(e => e.Jobs)
            .Metadata.SetValueComparer(intArrayComparer);

        modelBuilder.Entity<ViewedSubmissionsRow>()
            .Property(e => e.Intern)
            .Metadata.SetValueComparer(intArrayComparer);

        // TagGroups JSONB conversion + comparer (existing)
        var tagGroupsComparer = new ValueComparer<List<TagGroup>>(
            (a, b) => JsonSerializer.Serialize(a, opts) == JsonSerializer.Serialize(b, opts),
            c => JsonSerializer.Serialize(c, opts).GetHashCode(),
            c => JsonSerializer.Deserialize<List<TagGroup>>(JsonSerializer.Serialize(c, opts), opts) ?? new List<TagGroup>()
        );

        modelBuilder.Entity<InternDomain>()
            .Property(e => e.TagGroups)
            .HasConversion(
                v => JsonSerializer.Serialize(v, opts),
                v => JsonSerializer.Deserialize<List<TagGroup>>(v, opts) ?? new List<TagGroup>(),
                tagGroupsComparer
            )
            .HasColumnType("jsonb");
    }
}
