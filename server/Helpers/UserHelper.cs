using System.Security.Claims;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Server.Data;
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
}