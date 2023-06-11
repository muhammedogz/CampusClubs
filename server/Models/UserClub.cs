using System.ComponentModel.DataAnnotations.Schema;

namespace Server.Models;

public enum Role
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

  public Role Role { get; set; }
}