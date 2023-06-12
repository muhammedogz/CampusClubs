using Server.Models;

namespace Server.DTOs;

public class EventSummaryDTO
{
  public int EventId { get; set; }
  public string? Name { get; set; }
  public string? Description { get; set; }
  public string? Image { get; set; }
  public string? Location { get; set; }
  public string? Type { get; set; }
  public EventApprovalStatus ApprovalStatus { get; set; }
  public DateTime EventDate { get; set; }
  public ClubSummaryDTO? Club { get; set; }

  public UserApprovalStatus? UserApprovalStatus { get; set; }
}

public class EventDTO : EventSummaryDTO
{
  public List<UserSummaryDTO>? Users { get; set; }
}

public class EventCreateDTO
{
  public string? Name { get; set; }
  public string? Description { get; set; }
  public string? Image { get; set; }
  public string? Location { get; set; }
  public string? Type { get; set; }
  public DateTime EventDate { get; set; }
  public int ClubId { get; set; }
}

public class EventUpdateDTO
{
  public string? Name { get; set; }
  public string? Description { get; set; }
  public string? Image { get; set; }
  public string? Location { get; set; }
  public string? Type { get; set; }
  public DateTime? EventDate { get; set; }
  public int? ClubId { get; set; }
}