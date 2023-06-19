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
        .Include(c => c.Events.Where(e => e.EventCreateApprovalStatus == ApprovalStatus.Approved))
            .ThenInclude(e => e.UserEvents)
        .Include(c => c.Announcements)
        .Include(c => c.UserClubs)
            .ThenInclude(uc => uc.User)
            .ThenInclude(u => u!.Department)
        .AsSplitQuery()
        .FirstOrDefaultAsync(c => c.ClubId == id);

    if (club == null)
    {
      return NotFound(new ApiResponse(false, "Club not found", null));
    }

    club.Announcements = club.Announcements.OrderByDescending(a => a.Date).ToList();

    var clubDto = _mapper.Map<ClubDTO>(club);

    // Get the current user ID from the token
    var userId = User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier)?.Value;
    if (!string.IsNullOrEmpty(userId))
    {
      // Check the user role from the UserClubs table
      var userClub = club.UserClubs.FirstOrDefault(uc => uc.UserId == int.Parse(userId));
      if (userClub != null)
      {
        clubDto.User = new UserClubGetDTO(
            userClub.ClubRole,
            userClub.ClubJoinApprovalStatus
        );
      }
    }


    // Map UserClubs to Users
    clubDto.Users = club.UserClubs
        .Where(uc => uc.ClubJoinApprovalStatus == ApprovalStatus.Approved && uc.ClubRole != ClubRole.Advisor)
        .OrderByDescending(uc => uc.ClubRole == ClubRole.Admin)
        .ThenBy(uc => uc.ClubRole)
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

    var advisor = await _context.Users.FindAsync(clubDTO.AdvisorId);
    if (advisor != null)
    {
      var userClub = new UserClub
      {
        UserId = advisor.UserId,
        ClubId = club.ClubId,
        ClubRole = ClubRole.Advisor,
        ClubJoinApprovalStatus = ApprovalStatus.Approved
      };

      await _context.UserClubs.AddAsync(userClub);
      await _context.SaveChangesAsync();
    }

    return CreatedAtAction(nameof(GetClub), new { id = club.ClubId }, new ApiResponse(true, "Club created successfully", _mapper.Map<ClubDTO>(club)));
  }

  [HttpPut("{id}")]
  [Authorize]
  public async Task<ActionResult<ApiResponse>> EditClub(int id, UpdateClubDTO updateClubDTO)
  {
    var club = await _context.Clubs.FindAsync(id);
    if (club == null)
    {
      return NotFound(new ApiResponse(false, "Club not found", null));
    }

    var authResponse = await UserHelper.CheckAuthUserIsClubAdmin(User, _context, id);
    if (authResponse != null)
    {
      return BadRequest(authResponse);
    }

    club.Name = updateClubDTO.Name ?? club.Name;
    club.Description = updateClubDTO.Description ?? club.Description;
    club.Image = updateClubDTO.Image ?? club.Image;
    club.Tag = updateClubDTO.Tag ?? club.Tag;

    await _context.SaveChangesAsync();

    return Ok(new ApiResponse(true, "Club updated successfully", _mapper.Map<ClubDTO>(club)));
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

  [HttpPost("{clubId}/leave")]
  [Authorize]
  public async Task<ActionResult<ApiResponse>> LeaveClub(int clubId)
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

    var userClub = await _context.UserClubs
        .FirstOrDefaultAsync(uc => uc.UserId == int.Parse(userId) && uc.ClubId == clubId);
    if (userClub == null)
    {
      return BadRequest(new ApiResponse(false, "User is not a member of the club", null));
    }

    _context.UserClubs.Remove(userClub);
    await _context.SaveChangesAsync();

    return Ok(new ApiResponse(true, "User has left the club", null));
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
  public async Task<ActionResult<ApiResponse>> UpdateUserApprovalStatus(int clubId, int userId, [FromBody] ApproveDTOClub approveDTOClub)
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

    userClub.ClubJoinApprovalStatus = approveDTOClub.Status;
    await _context.SaveChangesAsync();

    return Ok(new ApiResponse(true, "User approval status updated successfully", null));
  }

  [HttpPost("{clubId}/users")]
  [Authorize]
  public async Task<ActionResult<ApiResponse>> AddUser(int clubId, [FromBody] UserToAddDTO userToAddDTO)
  {
    var club = await _context.Clubs.FindAsync(clubId);
    if (club == null)
    {
      return NotFound(new ApiResponse(false, "Club not found", null));
    }

    var authResponse = await UserHelper.CheckAuthUserIsClubAdmin(User, _context, clubId);
    if (authResponse != null)
    {
      return BadRequest(authResponse);
    }

    var existingUserClub = await _context.UserClubs
        .FirstOrDefaultAsync(uc => uc.UserId == userToAddDTO.UserId && uc.ClubId == clubId);
    if (existingUserClub != null)
    {
      _context.UserClubs.Remove(existingUserClub);
    }

    var userClub = new UserClub
    {
      UserId = userToAddDTO.UserId,
      ClubId = clubId,
      ClubRole = userToAddDTO.Role,
      ClubJoinApprovalStatus = ApprovalStatus.Approved
    };

    if (userToAddDTO.Role == ClubRole.Advisor && userToAddDTO.UserId != club.AdvisorId)
    {
      //Remove the current advisor from the club
      var currentAdvisor = await _context.UserClubs
          .FirstOrDefaultAsync(uc => uc.UserId == club.AdvisorId && uc.ClubId == clubId);
      if (currentAdvisor != null)
      {
        _context.UserClubs.Remove(currentAdvisor);
      }

      //Update the advisor Id in club model
      club.AdvisorId = userToAddDTO.UserId;
    }
    _context.UserClubs.Add(userClub);

    await _context.SaveChangesAsync();

    return Ok(new ApiResponse(true, "User added to club successfully", null));
  }

  [HttpDelete("{clubId}/users/{userId}")]
  [Authorize]
  public async Task<ActionResult<ApiResponse>> RemoveUser(int clubId, int userId)
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

    _context.UserClubs.Remove(userClub);
    await _context.SaveChangesAsync();

    return Ok(new ApiResponse(true, "User removed from club successfully", null));
  }

  [HttpDelete("{id}")]
  [Authorize(Policy = "Admin")]
  public async Task<ActionResult<ApiResponse>> DeleteClub(int id)
  {
    var club = await _context.Clubs.FindAsync(id);
    if (club == null)
    {
      return NotFound(new ApiResponse(false, "Club not found", null));
    }

    var userClubs = await _context.UserClubs.Where(uc => uc.ClubId == id).ToListAsync();
    foreach (var userClub in userClubs)
    {
      userClub.DeletedAt = DateTime.UtcNow;
    }

    club.DeletedAt = DateTime.UtcNow;
    _context.Entry(club).State = EntityState.Modified;

    try
    {
      await _context.SaveChangesAsync();
    }
    catch (DbUpdateConcurrencyException)
    {
      if (!ClubExists(id))
      {
        return NotFound(new ApiResponse(false, "Club not found", null));
      }
      else
      {
        throw;
      }
    }
    return Ok(new ApiResponse(true, "Club deleted successfully", null));
  }

  private bool ClubExists(int id)
  {
    return _context.Clubs.Any(e => e.ClubId == id);
  }

  public class ApproveDTOClub
  {
    public ApprovalStatus Status { get; set; }
  }

  public class UserToAddDTO
  {
    public int UserId { get; set; }
    public ClubRole Role { get; set; }
  }

}
