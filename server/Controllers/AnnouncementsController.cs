using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Server.Constants;
using Server.Data;
using Server.DTOs;
using Server.Helpers;
using Server.Models;

namespace Server.Controllers;

[ApiController]
[Route(Consts.DEFAULT_ROUTE)]
public class AnnouncementController : ControllerBase
{
  private readonly ApplicationDbContext _context;
  private readonly IMapper _mapper;

  public AnnouncementController(ApplicationDbContext context, IMapper mapper)
  {
    _context = context;
    _mapper = mapper;
  }

  [HttpPost]
  [Authorize]
  public async Task<ActionResult<ApiResponse>> CreateAnnouncement(CreateAnnouncementDTO announcementDto)
  {
    var authResponse = await UserHelper.CheckAuthUserIsClubAdmin(User, _context, announcementDto.ClubId);
    if (authResponse != null)
    {
      return BadRequest(authResponse);
    }

    var announcement = _mapper.Map<Announcement>(announcementDto);
    await _context.Announcements.AddAsync(announcement);
    await _context.SaveChangesAsync();

    return CreatedAtAction(nameof(GetAnnouncement), new { id = announcement.AnnouncementId }, new ApiResponse(true, "Announcement created successfully", _mapper.Map<AnnouncementDTO>(announcement)));
  }

  [HttpGet("{id}")]
  public async Task<ActionResult<ApiResponse>> GetAnnouncement(int id)
  {
    var announcement = await _context.Announcements.FindAsync(id);

    if (announcement == null)
    {
      return NotFound(new ApiResponse(false, "Announcement not found", null));
    }

    return Ok(new ApiResponse(true, "Announcement found", _mapper.Map<AnnouncementDTO>(announcement)));
  }

  [HttpPut("{id}")]
  [Authorize]
  public async Task<ActionResult<ApiResponse>> UpdateAnnouncement(int id, UpdateAnnouncementDTO announcementDto)
  {
    var announcement = await _context.Announcements.FindAsync(id);
    if (announcement == null)
    {
      return NotFound(new ApiResponse(false, "Announcement not found", null));
    }

    var authResponse = await UserHelper.CheckAuthUserIsClubAdmin(User, _context, announcement.ClubId);
    if (authResponse != null)
    {
      return BadRequest(authResponse);
    }

    _mapper.Map(announcementDto, announcement);
    await _context.SaveChangesAsync();

    return Ok(new ApiResponse(true, "Announcement updated successfully", _mapper.Map<AnnouncementDTO>(announcement)));
  }

  [HttpDelete("{id}")]
  [Authorize]
  public async Task<ActionResult<ApiResponse>> DeleteAnnouncement(int id)
  {
    var announcement = await _context.Announcements.FindAsync(id);
    if (announcement == null)
    {
      return NotFound(new ApiResponse(false, "Announcement not found", null));
    }

    var authResponse = await UserHelper.CheckAuthUserIsClubAdmin(User, _context, announcement.ClubId);
    if (authResponse != null)
    {
      return BadRequest(authResponse);
    }

    announcement.DeletedAt = DateTime.UtcNow;
    await _context.SaveChangesAsync();

    return Ok(new ApiResponse(true, "Announcement deleted successfully", null));
  }


}
