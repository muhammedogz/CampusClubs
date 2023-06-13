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
public class EventsController : ControllerBase
{
  private readonly ApplicationDbContext _context;
  private readonly IMapper _mapper;

  public EventsController(ApplicationDbContext context, IMapper mapper)
  {
    _context = context;
    _mapper = mapper;
  }

  [HttpGet]
  public async Task<ActionResult<ApiResponse>> GetEvents()
  {
    var events = await _context.Events
        .Where(e => e.EventCreateApprovalStatus == ApprovalStatus.Approved)
        .Include(e => e.Club)
        .Include(e => e.UserEvents)
            .ThenInclude(ue => ue.User)
        .Select(e => _mapper.Map<EventDTO>(e))
        .ToListAsync();

    return Ok(new ApiResponse(true, "Events retrieved successfully", events));
  }

  [HttpPost]
  [Authorize]
  public async Task<ActionResult<ApiResponse>> CreateEvent(EventCreateDTO eventDTO)
  {
    var authResponse = await CheckUserAuthorization(eventDTO.ClubId);
    if (authResponse != null)
    {
      return authResponse;
    }

    var eventModel = _mapper.Map<Event>(eventDTO);
    eventModel.CreatedAt = DateTime.UtcNow;

    _context.Events.Add(eventModel);

    // Retrieve the current user.
    var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
    if (userId == null)
    {
      return Unauthorized(new ApiResponse(false, "User not found", null));
    }

    var currentUser = await UserHelper.GetUserFromDb(_context, int.Parse(userId.ToString()));
    if (currentUser == null)
    {
      return NotFound(new ApiResponse(false, "User not found", null));
    }

    // Create a new UserEvent for the event creator.
    var userEvent = new UserEvent
    {
      User = currentUser,
      Event = eventModel,
      EventJoinApprovalStatus = ApprovalStatus.Approved
    };

    _context.UserEvents.Add(userEvent);

    await _context.SaveChangesAsync();

    return CreatedAtAction(nameof(GetEvent), new { id = eventModel.EventId }, new ApiResponse(true, "Event created successfully", _mapper.Map<EventDTO>(eventModel)));
  }

  [HttpPut("{id}")]
  [Authorize]
  public async Task<ActionResult<ApiResponse>> UpdateEvent(int id, EventUpdateDTO eventDTO)
  {
    var eventModel = await GetEventFromDb(id);
    if (eventModel == null)
    {
      return NotFound(new ApiResponse(false, "Event not found", null));
    }

    var authResponse = await CheckUserAuthorization(eventModel.ClubId);
    if (authResponse != null)
    {
      return authResponse;
    }

    _mapper.Map(eventDTO, eventModel); // Apply changes to the eventModel
    await _context.SaveChangesAsync();

    return Ok(new ApiResponse(true, "Event updated successfully", _mapper.Map<EventDTO>(eventModel)));
  }

  [HttpDelete("{id}")]
  [Authorize]
  public async Task<ActionResult<ApiResponse>> DeleteEvent(int id)
  {
    var eventModel = await GetEventFromDb(id);
    if (eventModel == null)
    {
      return NotFound(new ApiResponse(false, "Event not found", null));
    }

    var authResponse = await CheckUserAuthorization(eventModel.ClubId);
    if (authResponse != null)
    {
      return authResponse;
    }

    _context.Events.Remove(eventModel);
    await _context.SaveChangesAsync();

    return Ok(new ApiResponse(true, "Event deleted successfully", null));
  }

  [HttpPost("{eventId}/join")]
  [Authorize]
  public async Task<ActionResult<ApiResponse>> JoinEvent(int eventId)
  {
    var eventModel = await _context.Events.FindAsync(eventId);
    if (eventModel == null)
    {
      return NotFound(new ApiResponse(false, "Event not found", null));
    }

    // Retrieve the current user.
    var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
    if (userId == null)
    {
      return Unauthorized(new ApiResponse(false, "User not found", null));
    }

    var currentUser = await UserHelper.GetUserFromDb(_context, int.Parse(userId.ToString()));
    if (currentUser == null)
    {
      return NotFound(new ApiResponse(false, "User not found", null));
    }

    var existingUserEvent = await _context.UserEvents
        .FirstOrDefaultAsync(ue => ue.UserId == currentUser.UserId && ue.EventId == eventId);
    if (existingUserEvent != null)
    {
      return BadRequest(new ApiResponse(false, "User has already joined the event", null));
    }

    var userEvent = new UserEvent
    {
      User = currentUser,
      Event = eventModel,
      EventJoinApprovalStatus = ApprovalStatus.Pending,
    };
    _context.UserEvents.Add(userEvent);

    await _context.SaveChangesAsync();

    return Ok(new ApiResponse(true, "Joined event successfully", _mapper.Map<EventDTO>(eventModel)));
  }

  [HttpGet("{id}")]
  public async Task<ActionResult<ApiResponse>> GetEvent(int id)
  {
    var eventModel = await _context.Events
        .Include(e => e.Club)
        .Include(e => e.UserEvents)
            .ThenInclude(ue => ue.User)
        .FirstOrDefaultAsync(e => e.EventId == id);

    if (eventModel == null)
    {
      return NotFound(new ApiResponse(false, "Event not found", null));
    }

    var eventDTO = _mapper.Map<EventDTO>(eventModel);

    eventDTO.Users = await GetEventUsers(id, ApprovalStatus.Approved);

    return Ok(new ApiResponse(true, "Event retrieved successfully", eventDTO));
  }

  [HttpGet("user/{id}/pending")]
  [Authorize]
  public async Task<ActionResult<ApiResponse>> GetPendingUsers(int id)
  {
    var eventModel = await _context.Events.FindAsync(id);
    if (eventModel == null)
    {
      return NotFound(new ApiResponse(false, "Event not found", null));
    }

    var authResponse = await CheckUserAuthorization(eventModel.ClubId);
    if (authResponse != null)
    {
      return authResponse;
    }

    var users = await GetEventUsers(id, ApprovalStatus.Pending);

    return Ok(new ApiResponse(true, "Pending users retrieved successfully", users));
  }

  [HttpPost("/approval/{eventId}/user/{userId}")]
  [Authorize]
  public async Task<ActionResult<ApiResponse>> UpdateUserApprovalStatus(int eventId, int userId, [FromBody] ApprovalStatus status)
  {
    var userEvent = await _context.UserEvents.FirstOrDefaultAsync(ue => ue.EventId == eventId && ue.UserId == userId);
    if (userEvent == null)
    {
      return NotFound(new ApiResponse(false, "User or event not found", null));
    }

    var eventModel = await _context.Events.FindAsync(eventId);
    if (eventModel == null)
    {
      return NotFound(new ApiResponse(false, "Event not found", null));
    }

    var authResponse = await CheckUserAuthorization(eventModel.ClubId);
    if (authResponse != null)
    {
      return authResponse;
    }

    userEvent.EventJoinApprovalStatus = status;
    await _context.SaveChangesAsync();

    return Ok(new ApiResponse(true, "User approval status updated successfully", null));
  }

  [HttpGet("pending")]
  [Authorize]
  public async Task<ActionResult<ApiResponse>> GetPendingEventsForAdvisor()
  {
    var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
    if (userId == null)
    {
      return Unauthorized(new ApiResponse(false, "User not found", null));
    }

    var advisorClubs = await _context.Clubs
        .Where(c => c.AdvisorId == int.Parse(userId))
        .Select(c => c.ClubId)
        .ToListAsync();

    var pendingEvents = await _context.Events
        .Where(e => advisorClubs.Contains(e.ClubId) && e.EventCreateApprovalStatus == ApprovalStatus.Pending)
        .ToListAsync();

    return Ok(new ApiResponse(true, "Pending events retrieved successfully", _mapper.Map<List<EventDTO>>(pendingEvents)));
  }

  [HttpPatch("approval/{eventId}")]
  [Authorize]
  public async Task<ActionResult<ApiResponse>> UpdateEventApprovalStatus(int eventId, [FromBody] ApprovalStatus status)
  {
    var eventModel = await _context.Events.
              Include(e => e.Club).
              FirstOrDefaultAsync(e => e.EventId == eventId);
    if (eventModel == null)
    {
      return NotFound(new ApiResponse(false, "Event not found", null));
    }

    var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
    if (userId == null)
    {
      return Unauthorized(new ApiResponse(false, "User not found", null));
    }

    if (eventModel?.Club?.AdvisorId != int.Parse(userId))
    {
      return BadRequest(new ApiResponse(false, "You are not authorized to edit this event", null));
    }

    eventModel.EventCreateApprovalStatus = status;
    await _context.SaveChangesAsync();

    return Ok(new ApiResponse(true, "Event approval status updated successfully", null));
  }

  private async Task<Event> GetEventFromDb(int id)
  {
    var eventEntity = await _context.Events.FindAsync(id);
    if (eventEntity == null)
    {
      throw new ArgumentException($"Event with id {id} not found.");
    }
    return eventEntity;
  }

  private async Task<List<UserSummaryDTO>> GetEventUsers(int eventId, ApprovalStatus approvalStatus)
  {
    var userEvents = await _context.UserEvents
        .Where(ue => ue.EventId == eventId && ue.EventJoinApprovalStatus == approvalStatus)
        .Include(ue => ue.User)
        .ToListAsync();

    return _mapper.Map<List<UserSummaryDTO>>(userEvents.Select(ue => ue.User));
  }

  private async Task<ActionResult<ApiResponse>?> CheckUserAuthorization(int clubId)
  {
    var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

    var userClub = await _context.UserClubs
        .FirstOrDefaultAsync(uc => uc.UserId.ToString() == userId && uc.ClubId == clubId);

    if (userClub?.ClubRole != ClubRole.Admin)
    {
      return Unauthorized(new ApiResponse(false, "You are not authorized to edit/delete events in this club", null));
    }

    return null;
  }
}