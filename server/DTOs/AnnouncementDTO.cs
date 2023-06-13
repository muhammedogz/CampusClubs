namespace Server.DTOs;

public class AnnouncementDTO
{
  public int AnnouncementId { get; set; }
  public string? Title { get; set; }
  public string? Description { get; set; }
  public DateTime Date { get; set; }
}

public class CreateAnnouncementDTO
{
  public string? Title { get; set; }
  public string? Description { get; set; }
  public DateTime Date { get; set; }
  public int ClubId { get; set; }
}

public class UpdateAnnouncementDTO
{
  public string? Title { get; set; }
  public string? Description { get; set; }
  public DateTime? Date { get; set; }
}