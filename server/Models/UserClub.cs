using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Server.Models;

public enum ClubRole
{
  Advisor,
  Admin,
  Member,
}

public class UserClub
{
  [ForeignKey(nameof(User))]
  public int UserId { get; set; }
  public User? User { get; set; }

  [ForeignKey(nameof(Club))]
  public int ClubId { get; set; }
  public Club? Club { get; set; }

  public ClubRole ClubRole { get; set; } = ClubRole.Member;
  public ApprovalStatus ClubJoinApprovalStatus { get; set; } = ApprovalStatus.Pending;

  [DataType(DataType.Date)]
  public DateTime? DeletedAt { get; set; }
}