using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Server.Models;

public class Event
{
  [Key]
  [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
  public int EventId { get; set; }

  [Required]
  public string? Name { get; set; }

  [Required]
  public string? Description { get; set; }

  public string? Image { get; set; }

  [Required]
  public string? Location { get; set; }

  [Required]
  public string? Type { get; set; }

  public EventApprovalStatus ApprovalStatus { get; set; } = EventApprovalStatus.Pending;

  public DateTime EventDate { get; set; }

  public DateTime CreatedAt { get; set; }

  public DateTime? DeletedAt { get; set; }

  [ForeignKey(nameof(Club))]
  public int ClubId { get; set; }
  public Club? Club { get; set; }
  public List<UserEvent>? UserEvents { get; set; }

}

public enum EventApprovalStatus
{
  Pending,
  Approved,
  Declined
}