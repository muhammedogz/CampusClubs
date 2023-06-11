using Server.Models;

namespace Server.DTOs;

public class ClubDto
{
  public int ClubId { get; set; }
  public string? Name { get; set; }
  public string? Description { get; set; }
  public string? Image { get; set; }
  public string? Tag { get; set; }
  public DateTime CreatedAt { get; set; }
  public DateTime? DeletedAt { get; set; }
  public UserDto? Advisor { get; set; }
  public ApprovalStatus ApprovalStatus { get; set; }
  public List<EventDto>? Events { get; set; }
  public List<AnnouncementDto>? Announcements { get; set; }
  public List<UserDto>? Users { get; set; }
}