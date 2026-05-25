using System.Text.Json;
using WebApplication1.Models;

namespace WebApplication1.Services;

public static class DataSeeder
{
    public static void Seed(AppDbContext db)
    {
        if (db.HomeStats.Any()) return;

        var opts = new JsonSerializerOptions
        {
            PropertyNamingPolicy = JsonNamingPolicy.CamelCase,
            PropertyNameCaseInsensitive = true,
        };

        var dir = Path.Combine(AppContext.BaseDirectory, "data");

        T[] LoadArray<T>(string file) =>
            JsonSerializer.Deserialize<T[]>(File.ReadAllText(Path.Combine(dir, file)), opts) ?? [];

        T LoadOne<T>(string file) where T : new() =>
            JsonSerializer.Deserialize<T>(File.ReadAllText(Path.Combine(dir, file)), opts) ?? new T();

        // Home
        var stats = LoadArray<HomeStat>("home-stats.json");
        foreach (var x in stats) x.Id = 0;
        db.HomeStats.AddRange(stats);

        var features = LoadArray<HomeFeature>("home-features.json");
        foreach (var x in features) x.Id = 0;
        db.HomeFeatures.AddRange(features);

        // Testimonials
        var testimonials = LoadArray<Testimonial>("testimonials.json");
        foreach (var x in testimonials) x.Id = 0;
        db.Testimonials.AddRange(testimonials);

        // About
        var paragraphs = JsonSerializer.Deserialize<string[]>(
            File.ReadAllText(Path.Combine(dir, "about-who-we-are.json")), opts) ?? [];
        for (var i = 0; i < paragraphs.Length; i++)
            db.AboutWhoWeAre.Add(new AboutWhoWeAreItem { Order = i, Paragraph = paragraphs[i] });

        var mvItems = LoadArray<MissionVisionItem>("about-mission-vision.json");
        foreach (var x in mvItems) x.Id = 0;
        db.MissionVision.AddRange(mvItems);

        var coreValues = LoadArray<CoreValue>("about-core-values.json");
        foreach (var x in coreValues) x.Id = 0;
        db.CoreValues.AddRange(coreValues);

        var gallery = LoadArray<GallerySlide>("about-gallery.json");
        foreach (var x in gallery) x.Id = 0;
        db.GallerySlides.AddRange(gallery);

        // Services
        var services = LoadArray<Service>("services.json");
        foreach (var x in services) x.Id = 0;
        db.Services.AddRange(services);

        var serviceSteps = LoadArray<ServiceStep>("services-process.json");
        foreach (var x in serviceSteps) x.Id = 0;
        db.ServiceSteps.AddRange(serviceSteps);

        // Portfolio
        db.PortfolioTopics.AddRange(LoadArray<PortfolioTopic>("portfolio-topics.json"));

        var portfolioItems = LoadArray<PortfolioItem>("portfolio-items.json");
        foreach (var x in portfolioItems) x.Id = 0;
        db.PortfolioItems.AddRange(portfolioItems);

        // Careers
        var jobs = LoadArray<Job>("careers-jobs.json");
        foreach (var x in jobs) x.Id = 0;
        db.Jobs.AddRange(jobs);

        var careersReasons = LoadArray<CareersReason>("careers-reasons.json");
        foreach (var x in careersReasons) x.Id = 0;
        db.CareersReasons.AddRange(careersReasons);

        // Internship
        var internDomains = LoadArray<InternDomain>("internship-domains.json");
        foreach (var x in internDomains) x.Id = 0;
        db.InternDomains.AddRange(internDomains);

        var internReasons = LoadArray<InternReason>("internship-reasons.json");
        foreach (var x in internReasons) x.Id = 0;
        db.InternReasons.AddRange(internReasons);

        var internBenefits = LoadArray<InternBenefit>("internship-benefits.json");
        foreach (var x in internBenefits) x.Id = 0;
        db.InternBenefits.AddRange(internBenefits);

        var internSteps = LoadArray<InternStep>("internship-steps.json");
        foreach (var x in internSteps) x.Id = 0;
        db.InternSteps.AddRange(internSteps);

        var eligibility = LoadArray<EligibilityCard>("internship-eligibility.json");
        foreach (var x in eligibility) x.Id = 0;
        db.EligibilityCards.AddRange(eligibility);

        var faqs = LoadArray<InternFAQ>("internship-faqs.json");
        foreach (var x in faqs) x.Id = 0;
        db.InternFAQs.AddRange(faqs);

        // Locations
        var locations = LoadArray<Location>("locations.json");
        foreach (var x in locations) x.Id = 0;
        db.Locations.AddRange(locations);

        var footerContact = LoadOne<FooterContact>("footer-contact.json");
        footerContact.Id = 1;
        db.FooterContacts.Add(footerContact);

        var hq = LoadOne<Headquarters>("headquarters.json");
        hq.Id = 1;
        db.Hq.Add(hq);

        // Submissions
        var contactEnquiries = LoadArray<ContactEnquiry>("submissions-contact.json");
        foreach (var x in contactEnquiries) x.Id = 0;
        db.ContactEnquiries.AddRange(contactEnquiries);

        var jobApps = LoadArray<JobApplication>("submissions-jobs.json");
        foreach (var x in jobApps) x.Id = 0;
        db.JobApplications.AddRange(jobApps);

        var internApps = LoadArray<InternshipApplication>("submissions-internship.json");
        foreach (var x in internApps) x.Id = 0;
        db.InternshipApplications.AddRange(internApps);

        var viewed = LoadOne<ViewedSubmissionsRow>("submissions-viewed.json");
        viewed.Id = 1;
        db.ViewedSubmissions.Add(viewed);

        db.SaveChanges();
    }
}
