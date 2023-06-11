namespace Server.DTOs;

public class AnnouncementDTO
{
  public int AnnouncementId { get; set; }
  public string? Title { get; set; }
  public string? Description { get; set; }
  public DateTime Date { get; set; }
}