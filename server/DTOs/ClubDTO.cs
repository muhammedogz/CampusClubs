using Server.Models;

namespace Server.DTOs;

public class UserClubGetDTO
{
  public UserClubGetDTO(ClubRole clubRole, ApprovalStatus clubJoinApprovalStatus)
  {
    ClubRole = clubRole;
    ClubJoinApprovalStatus = clubJoinApprovalStatus;
  }

  public ClubRole ClubRole { get; set; }
  public ApprovalStatus ClubJoinApprovalStatus { get; set; }
}

public class ClubSummaryDTO
{
  public int ClubId { get; set; }
  public string? Name { get; set; }
  public string? Description { get; set; }
  public string? Image { get; set; }
  public string? Tag { get; set; }
  public ClubRole? ClubRole { get; set; }
  public UserClubGetDTO? User { get; set; } = null;
}

public class ClubDTO : ClubSummaryDTO
{
  public UserSummaryDTO? Advisor { get; set; }
  public List<EventSummaryDTO>? Events { get; set; }
  public List<AnnouncementDTO>? Announcements { get; set; }
  public List<UserSummaryDTO>? Users { get; set; }
}

public class CreateClubDTO
{
  public string? Name { get; set; }
  public string? Description { get; set; }
  public string? Image { get; set; }
  public string? Tag { get; set; }
  public int AdvisorId { get; set; }
}

public class UpdateClubDTO
{
  public string? Name { get; set; }
  public string? Description { get; set; }
  public string? Image { get; set; }
  public string? Tag { get; set; }
}
