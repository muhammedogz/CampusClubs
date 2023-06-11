using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Server.Models;

public class User
{
  [Key]
  [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
  public int UserId { get; set; }

  [Required]
  public string UserName { get; set; } = string.Empty;
  [Required]
  public string FirstName { get; set; } = string.Empty;
  [Required]
  public string LastName { get; set; } = string.Empty;
  [Required]
  public string Email { get; set; } = string.Empty;
  [Required]
  public string Department { get; set; } = string.Empty;
  public string? Image { get; set; } = string.Empty;
  public bool IsAdvisor { get; set; }
  public bool IsSuperAdmin { get; set; }

  [DataType(DataType.Date)]
  public DateTime CreatedAt { get; set; }
  [DataType(DataType.Date)]
  public DateTime? DeletedAt { get; set; }

  public List<UserClub> UserClubs { get; set; } = new List<UserClub>();
  public List<UserEvent> UserEvents { get; set; } = new List<UserEvent>();
}