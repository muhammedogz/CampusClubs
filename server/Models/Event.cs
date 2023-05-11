using System.ComponentModel.DataAnnotations;

namespace Server.Models;

public class Event
{
    [Key] /* annotation */
    public int eventId { get; set; }

    [Required]
    public string name { get; set; } = string.Empty;

    [Required]
    public string slug { get; set; } = string.Empty;

    [Required]
    public string description { get; set; } = string.Empty;
    
    [Required]
    public string image { get; set; } = string.Empty;

    [Required]
    public string location { get; set; } = string.Empty;    

    [Required]
    public string type { get; set; } = string.Empty;    

    [Required]
    public DateTime date { get; set; } = DateTime.Now;

    // the default value above makes not allow to nulls.
    public DateTime? validFrom { get; set; }
    
    // public DateTime? DeletedDate { get; set; } = DateTime.Now;
    public DateTime? validUntil { get; set; }

}