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

  public ClubRole ClubRole { get; set; }
}