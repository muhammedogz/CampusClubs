using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Server.Models;

public class Announcement
{
  [Key]
  [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
  public int AnnouncementId { get; set; }

  [Required]
  public string? Title { get; set; }

  [Required]
  public string? Description { get; set; }

  public DateTime Date { get; set; }

  public DateTime CreatedAt { get; set; }

  public DateTime? DeletedAt { get; set; }

  [ForeignKey(nameof(Club))]
  public int ClubId { get; set; }
  public Club? Club { get; set; }
}