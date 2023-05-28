using System.ComponentModel.DataAnnotations;
namespace Server.Models;

public class Announcement
{
    [Key] /* annotation */
    public int announcementId { get; set; }

    [Required]
    public string title { get; set; } = string.Empty;

    [Required]
    public string description { get; set; } = string.Empty;

    [Required]
    public DateTime date { get; set; } = DateTime.Now;

    // the default value above makes not allow to nulls.
    public DateTime? validFrom { get; set; }
    
    // public DateTime? DeletedDate { get; set; } = DateTime.Now;
    public DateTime? validUntil { get; set; }

}