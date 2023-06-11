namespace Server.DTOs;

public class UserDto
{
  public int UserId { get; set; }

  public string? UserName { get; set; }

  public string? FirstName { get; set; }

  public string? LastName { get; set; }

  public string? Email { get; set; }

  public string? Department { get; set; }

  public string? Image { get; set; }

  public bool IsAdvisor { get; set; }

  public bool IsSuperAdmin { get; set; }

  public DateTime CreatedAt { get; set; }

  public DateTime? DeletedAt { get; set; }
  public List<ClubDto>? Clubs { get; set; }
  public List<EventDto>? Events { get; set; }
}