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
}