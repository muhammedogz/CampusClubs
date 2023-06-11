using Server.Models;

namespace Server.DTOs;

public class ClubDTO
{
  public int ClubId { get; set; }
  public string? Name { get; set; }
  public string? Description { get; set; }
  public string? Image { get; set; }
  public string? Tag { get; set; }
  public DateTime CreatedAt { get; set; }
  public DateTime? DeletedAt { get; set; }
  public UserDTO? Advisor { get; set; }
  public ApprovalStatus ApprovalStatus { get; set; }
  public List<EventDTO>? Events { get; set; }
  public List<AnnouncementDTO>? Announcements { get; set; }
  public List<UserDTO>? Users { get; set; }
}