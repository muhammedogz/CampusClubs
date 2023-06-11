using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Server.Models;

public class Club
{
  [Key]
  [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
  public int ClubId { get; set; }

  [Required]
  public string? Name { get; set; }

  public string? Description { get; set; }

  public string? Image { get; set; }
  public string? Tag { get; set; }

  public DateTime CreatedAt { get; set; }

  public DateTime? DeletedAt { get; set; }
  public int AdvisorId { get; set; }

  // Navigation properties
  [ForeignKey("AdvisorId")]
  public User? Advisor { get; set; }
  public List<Event> Events { get; set; } = new List<Event>();
  public List<Announcement> Announcements { get; set; } = new List<Announcement>();
  public List<UserClub> UserClubs { get; set; } = new List<UserClub>();
}
