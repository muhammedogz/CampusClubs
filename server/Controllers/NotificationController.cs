using System.Security.Claims;
using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Server.Constants;
using Server.Data;
using Server.Helpers;
using Server.Models;

namespace Server.Controllers;

[ApiController]
[Route(Consts.DEFAULT_ROUTE)]
public class NotificationController : ControllerBase
{
  private readonly ApplicationDbContext _context;
  private readonly IMapper _mapper;

  public NotificationController(ApplicationDbContext context, IMapper mapper)
  {
    _context = context;
    _mapper = mapper;
  }

  [HttpPost]
  [Authorize]
  public async Task<ActionResult<ApiResponse>> GetNotifications()
  {
    var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

    if (string.IsNullOrEmpty(userId))
    {
      return Unauthorized(new ApiResponse(false, "User not authenticated", null));
    }

    var eventJoinRequests = await UserHelper.GetPendingUsersInAdminEvents(int.Parse(userId), _context, _mapper);
    var clubJoinRequests = await UserHelper.GetClubUsersInPendingStatus(int.Parse(userId), _context, _mapper);
    var eventCreateRequests = await UserHelper.GetAllPendingEventsUserAdvisor(int.Parse(userId), _context, _mapper);
    var response = new NotificationDTO
    {
      EventCreateRequest = eventCreateRequests,
      EventJoinRequest = eventJoinRequests,
      ClubJoinRequest = clubJoinRequests
    };

    return Ok(new ApiResponse(true, "Fetched pending users in admin events successfully", response));
  }

}

public class NotificationDTO
{
  public List<UserEventDTO> EventJoinRequest { get; set; } = new List<UserEventDTO>();
  public List<UserClubDTO> ClubJoinRequest { get; set; } = new List<UserClubDTO>();
  public List<EventClubDTO> EventCreateRequest { get; set; } = new List<EventClubDTO>();
}