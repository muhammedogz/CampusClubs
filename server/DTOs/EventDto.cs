namespace Server.DTOs;


public class EventDto
{
  public int EventId { get; set; }
  public string? Name { get; set; }
  public string? Description { get; set; }
  public string? Image { get; set; }
  public string? Location { get; set; }
  public string? Type { get; set; }
  public DateTime EventDate { get; set; }
  public DateTime CreatedAt { get; set; }
  public DateTime? DeletedAt { get; set; }
  public int ClubId { get; set; }
  public List<UserDto>? Users { get; set; }

}