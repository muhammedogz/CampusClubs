using System.Security.Claims;
using AutoMapper;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Server.Data;
using Server.DTOs;
using Server.Models;

namespace Server.Helpers;

public class UserHelper
{
  public static async Task<User> GetUserFromDb(ApplicationDbContext context, int id)
  {
    var userEntity = await context.Users.FindAsync(id);
    if (userEntity == null)
    {
      throw new ArgumentException($"User with id {id} not found.");
    }
    return userEntity;
  }

  public static Task<List<User>> GetUsersFromDbByRole(ApplicationDbContext context, UserRole role)
  {
    var users = context.Users
              .Where(u => u.UserRole == role)
              .Include(u => u.Department)
              .ToListAsync();

    return users;
  }

  public static async Task<ActionResult<ApiResponse>?> CheckAuthUserIsClubAdmin(ClaimsPrincipal User, ApplicationDbContext context, int clubId)
  {
    var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
    if (userId == null)
    {
      return new ApiResponse(false, "User not found", null);
    }

    var userClub = await context.UserClubs
        .FirstOrDefaultAsync(uc => uc.UserId.ToString() == userId && uc.ClubId == clubId);

    if (userClub?.ClubRole != ClubRole.Admin)
    {
      return new ApiResponse(false, "You are not authorized to edit/delete events in this club", null);
    }

    return null;
  }

  public static async Task<List<Club>> GetAdminClubs(int userId, ApplicationDbContext context)
  {
    return await context.UserClubs
        .Where(uc => uc.UserId == userId && uc.ClubRole == ClubRole.Admin)
        .Include(uc => uc.Club)
        .Select(uc => uc.Club!)
        .ToListAsync();
  }

  public static async Task<List<int>> GetAdminClubIds(int userId, ApplicationDbContext context)
  {
    return await context.UserClubs
        .Where(uc => uc.UserId == userId && uc.ClubRole == ClubRole.Admin)
        .Select(uc => uc.ClubId)
        .ToListAsync();
  }

  public static async Task<List<Event>> GetAdminEvents(int userId, ApplicationDbContext context)
  {
    var clubIds = await GetAdminClubIds(userId, context);
    return await context.Events
        .Where(e => clubIds.Contains(e.ClubId))
        .Include(e => e.Club)
        .ToListAsync();
  }

  public static async Task<List<int>> GetAdminEventIds(int userId, ApplicationDbContext context)
  {
    var clubIds = await GetAdminClubIds(userId, context);
    return await context.Events
        .Where(e => clubIds.Contains(e.ClubId))
        .Select(e => e.EventId)
        .ToListAsync();
  }

  public static async Task<List<UserEventDTO>> GetPendingUsersInAdminEvents(int userId, ApplicationDbContext context, IMapper mapper)
  {
    var userEvents = await context.UserClubs
        .Where(uc => uc.UserId == userId && uc.ClubRole == ClubRole.Admin)
        .SelectMany(uc => uc.Club!.Events)
        .Join(context.UserEvents.Where(ue => ue.EventJoinApprovalStatus == ApprovalStatus.Pending),
            e => e.EventId,
            ue => ue.EventId,
            (e, ue) => new { User = ue.User, Event = e })
        .ToListAsync();

    var userEventDTOs = userEvents.Select(ue => new UserEventDTO { User = mapper.Map<UserSummaryDTO>(ue.User), Event = mapper.Map<EventSummaryDTO>(ue.Event) }).ToList();

    return userEventDTOs;
  }

  public static async Task<List<UserClubDTO>> GetClubUsersInPendingStatus(int userId, ApplicationDbContext context, IMapper mapper)
  {
    var userClubs = await context.UserClubs
        .Where(uc => context.UserClubs.Any(uc2 => uc2.ClubId == uc.ClubId && uc2.UserId == userId && uc2.ClubRole == ClubRole.Admin)
                     && uc.ClubJoinApprovalStatus == ApprovalStatus.Pending)
        .Include(uc => uc.User)
        .Include(uc => uc.Club)
        .ToListAsync();

    var userClubDTOs = userClubs.Select(uc => new UserClubDTO { User = mapper.Map<UserSummaryDTO>(uc.User), Club = mapper.Map<ClubSummaryDTO>(uc.Club) }).ToList();

    return userClubDTOs;
  }

  public static async Task<List<EventClubDTO>> GetAllPendingEventsUserAdvisor(int userId, ApplicationDbContext context, IMapper mapper)
  {
    var pendingEvents = await context.Events
        .Where(e => context.UserClubs.Any(uc => uc.ClubId == e.ClubId && uc.UserId == userId && uc.ClubRole == ClubRole.Advisor)
                     && e.EventCreateApprovalStatus == ApprovalStatus.Pending)
        .Include(e => e.Club)
        .ToListAsync();

    var eventClubDTOs = pendingEvents.Select(e => new EventClubDTO
    {
      Event = mapper.Map<EventSummaryDTO>(e),
      Club = mapper.Map<ClubSummaryDTO>(e.Club)
    }).ToList();

    return eventClubDTOs;
  }

}

public class UserEventDTO
{
  public UserSummaryDTO? User { get; set; }
  public EventSummaryDTO? Event { get; set; }
}

public class UserClubDTO
{
  public UserSummaryDTO? User { get; set; }
  public ClubSummaryDTO? Club { get; set; }
}

public class EventClubDTO
{
  public EventSummaryDTO? Event { get; set; }
  public ClubSummaryDTO? Club { get; set; }
}