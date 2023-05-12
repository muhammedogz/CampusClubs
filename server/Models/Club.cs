using System.ComponentModel;
using System.ComponentModel.DataAnnotations;
using System.Data;

namespace Server.Models;

public class Club
{
    [Key] /* annotation */
    public int clubId { get; set; }

    [Required]
    public string name { get; set; } = string.Empty;

    [Required]
    public string slug { get; set; } = string.Empty;

    [Required]
    public string description { get; set; } = string.Empty;

    [Required]
    public string image { get; set; } = string.Empty;

    // public List<ClubMember> members { get; set; } = new List<ClubMember>();

    // public List<ClubEvent> events { get; set; } = new List<ClubEvent>();
    
    public List<ClubAnnouncement> announcements { get; set; } = new List<ClubAnnouncement>();

    [Required]
    public int advisor { get; set; } = 0;

    // the default value above makes not allow to nulls.
    public DateTime? validFrom { get; set; }
    
    // public DateTime? DeletedDate { get; set; } = DateTime.Now;
    public DateTime? validUntil { get; set; }

}


public class ClubMember
{
    [Key]
    // public int ClubMemberId { get; set; }
    public int memberId { get; set; }

    public int clubId { get; set; }

    public int memberRole { get; set; }
}


public class ClubEvent
{
    [Key]
    public int eventId { get; set; }

    public int clubId { get; set; }
}

public class ClubAnnouncement
{
    [Key]
    public int announcementId { get; set; }

    public int clubId { get; set; }
}
