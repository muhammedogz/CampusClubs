using System.ComponentModel.DataAnnotations;

namespace Server.Models;

public class Event
{
    [Key] /* annotation */
    public int EventId { get; set; }

    [Required]
    public string EventName { get; set; } = string.Empty;

    [Required]
    public DateTime EventDate { get; set; } = DateTime.Now;

    [Required]
    public string Description { get; set; } = string.Empty;

    // the default value above makes not allow to nulls.
    public DateTime? ValidFrom { get; set; }
    
    // public DateTime? DeletedDate { get; set; } = DateTime.Now;
    public DateTime? ValidUntil { get; set; }

}