using System.ComponentModel.DataAnnotations;

namespace Server.Models;

public class Club
{
    [Key] /* annotation */
    public int ClubId { get; set; }

    [Required]
    public string ClubName { get; set; } = string.Empty;

    [Required]
    public string Slug { get; set; } = string.Empty;

    [Required]
    public string Description { get; set; } = string.Empty;

    [Required]
    public string Image { get; set; } = string.Empty;

    [Required]
    public User[]? Members { get; set; } = null;

    [Required]
    public Event[]? Events { get; set; } = null;

    [Required]
    public User? Advisor { get; set; } = null;

    // the default value above makes not allow to nulls.
    public DateTime? ValidFrom { get; set; }
    
    // public DateTime? DeletedDate { get; set; } = DateTime.Now;
    public DateTime? ValidUntil { get; set; }

}