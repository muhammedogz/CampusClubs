using System.Security.Claims;
using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Server.Constants;
using Server.Data;
using Server.DTOs;
using Server.Helpers;
using Server.Models;

namespace Server.Controllers;

[ApiController]
[Route(Consts.DEFAULT_ROUTE)]
public class ClubsController : ControllerBase
{
  private readonly ApplicationDbContext _context;
  private readonly IMapper _mapper;

  public ClubsController(ApplicationDbContext context, IMapper mapper)
  {
    _context = context;
    _mapper = mapper;
  }

  [HttpGet]
  public async Task<ActionResult<ApiResponse>> GetClubs()
  {
    var clubs = await _context.Clubs
        .ToListAsync();

    return Ok(new ApiResponse(true, "Clubs retrieved successfully", _mapper.Map<List<ClubSummaryDTO>>(clubs)));
  }

  [HttpGet("{id}")]
  public async Task<ActionResult<ApiResponse>> GetClub(int id)
  {
    var club = await _context.Clubs
        .Include(c => c.Advisor)
        .Include(c => c.Events)
            .ThenInclude(e => e.UserEvents)
        .Include(c => c.Announcements)
        .Include(c => c.UserClubs)
            .ThenInclude(uc => uc.User)
        .AsSplitQuery()
        .FirstOrDefaultAsync(c => c.ClubId == id);

    if (club == null)
    {
      return NotFound(new ApiResponse(false, "Club not found", null));
    }

    var clubDto = _mapper.Map<ClubDTO>(club);

    // Map UserClubs to Users
    clubDto.Users = club.UserClubs
        .Where(uc => uc.ClubJoinApprovalStatus == ApprovalStatus.Approved)
        .Select(uc => _mapper.Map<UserSummaryDTO>(uc))
        .ToList();

    return Ok(new ApiResponse(true, "Club found", clubDto));
  }

  [HttpPost]
  [Authorize(Policy = "Admin")]
  public async Task<ActionResult<ApiResponse>> CreateClub(CreateClubDTO clubDTO)
  {
    var club = _mapper.Map<Club>(clubDTO);
    club.CreatedAt = DateTime.UtcNow;

    await _context.Clubs.AddAsync(club);
    await _context.SaveChangesAsync();

    return CreatedAtAction(nameof(GetClub), new { id = club.ClubId }, new ApiResponse(true, "Club created successfully", _mapper.Map<ClubDTO>(club)));
  }

  [HttpPost("{clubId}/join")]
  [Authorize]
  public async Task<ActionResult<ApiResponse>> JoinClub(int clubId)
  {
    var club = await _context.Clubs.FindAsync(clubId);
    if (club == null)
    {
      return NotFound(new ApiResponse(false, "Club not found", null));
    }

    var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
    if (userId == null)
    {
      return Unauthorized(new ApiResponse(false, "User not found", null));
    }

    var existingUserClub = await _context.UserClubs
        .FirstOrDefaultAsync(uc => uc.UserId == int.Parse(userId) && uc.ClubId == clubId);
    if (existingUserClub != null)
    {
      return BadRequest(new ApiResponse(false, "User has already requested to join the club", null));
    }

    var userClub = new UserClub
    {
      UserId = int.Parse(userId),
      ClubId = clubId,
      ClubRole = ClubRole.Member,
      ClubJoinApprovalStatus = ApprovalStatus.Pending
    };

    _context.UserClubs.Add(userClub);
    await _context.SaveChangesAsync();

    return Ok(new ApiResponse(true, "Request to join club has been sent", null));
  }

  [HttpGet("{clubId}/pending")]
  [Authorize]
  public async Task<ActionResult<ApiResponse>> GetPendingUsers(int clubId)
  {
    var authResponse = await UserHelper.CheckAuthUserIsClubAdmin(User, _context, clubId);
    if (authResponse != null)
    {
      return BadRequest(authResponse);
    }

    var pendingUsers = await _context.UserClubs
        .Where(uc => uc.ClubId == clubId && uc.ClubJoinApprovalStatus == ApprovalStatus.Pending)
        .Include(uc => uc.User)
        .Select(uc => uc.User)
        .ToListAsync();

    return Ok(new ApiResponse(true, "Pending users retrieved successfully", _mapper.Map<List<UserSummaryDTO>>(pendingUsers)));
  }

  [HttpPatch("{clubId}/approval/{userId}")]
  [Authorize]
  public async Task<ActionResult<ApiResponse>> UpdateUserApprovalStatus(int clubId, int userId, [FromBody] ApprovalStatus status)
  {
    var userClub = await _context.UserClubs.FirstOrDefaultAsync(uc => uc.ClubId == clubId && uc.UserId == userId);
    if (userClub == null)
    {
      return NotFound(new ApiResponse(false, "User or club not found", null));
    }

    var authResponse = await UserHelper.CheckAuthUserIsClubAdmin(User, _context, clubId);
    if (authResponse != null)
    {
      return BadRequest(authResponse);
    }

    userClub.ClubJoinApprovalStatus = status;
    await _context.SaveChangesAsync();

    return Ok(new ApiResponse(true, "User approval status updated successfully", null));
  }
}
