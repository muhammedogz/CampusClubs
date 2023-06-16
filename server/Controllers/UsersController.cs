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
public class UsersController : ControllerBase
{
  private readonly ApplicationDbContext _context;
  private readonly IMapper _mapper;

  public UsersController(ApplicationDbContext context, IMapper mapper)
  {
    _context = context;
    _mapper = mapper;
  }

  private async Task<ActionResult<ApiResponse>> GetUsersByRole(UserRole role, string message)
  {
    try
    {
      var users = await UserHelper.GetUsersFromDbByRole(_context, role);

      if (!users.Any())
      {
        return NotFound(new ApiResponse(false, $"No users found with role {role}", new List<UserSummaryDTO>()));
      }

      return Ok(new ApiResponse(true, message, _mapper.Map<List<UserSummaryDTO>>(users)));
    }
    catch (Exception)
    {
      return StatusCode(StatusCodes.Status500InternalServerError,
          new ApiResponse(false, $"An error occurred while retrieving users with role {role}", null));
    }
  }

  [HttpGet("students")]
  public async Task<ActionResult<ApiResponse>> GetStudentUsers()
  {
    return await GetUsersByRole(UserRole.Student, "Student users retrieved successfully");
  }

  [HttpGet("teachers")]
  public async Task<ActionResult<ApiResponse>> GetTeacherUsers()
  {
    return await GetUsersByRole(UserRole.Teacher, "Teachers users retrieved successfully");
  }

  [HttpGet("{id}")]
  public async Task<ActionResult<ApiResponse>> GetUser(int id)
  {
    var user = await _context.Users
        .Include(u => u.UserClubs)
            .ThenInclude(uc => uc.Club)
        .Include(u => u.UserEvents)
            .ThenInclude(ue => ue.Event)
        .Include(u => u.Department)
        .AsSplitQuery()
        .FirstOrDefaultAsync(u => u.UserId == id);

    if (user == null)
    {
      return NotFound(new ApiResponse(false, "User not found", null));
    }

    var userDto = _mapper.Map<UserDTO>(user);

    userDto.Clubs = user.UserClubs
        .Where(uc => uc.ClubJoinApprovalStatus == ApprovalStatus.Approved)
        .Select(uc => new ClubSummaryDTO
        {
          ClubId = uc.Club!.ClubId,
          Name = uc.Club.Name,
          Description = uc.Club.Description,
          Image = uc.Club.Image,
          Tag = uc.Club.Tag,
          ClubRole = uc.ClubRole,
        })
        .ToList();

    return Ok(new ApiResponse(true, "User found", userDto));
  }


  [HttpPost]
  public async Task<ActionResult<ApiResponse>> CreateUser(UserCreateDTO userDTO)
  {
    var user = _mapper.Map<User>(userDTO);
    user.CreatedAt = DateTime.UtcNow;

    await _context.Users.AddAsync(user);
    await _context.SaveChangesAsync();

    var userResult = _mapper.Map<UserDTO>(user);

    return CreatedAtAction(nameof(GetUser), new { id = userResult.UserId }, new ApiResponse(true, "User created successfully", userResult));
  }

  [HttpPut("{id}")]
  [Authorize]
  public async Task<ActionResult<ApiResponse>> UpdateUser(int id, UserUpdateDTO userUpdateDTO)
  {
    var userIdFromToken = User.FindFirstValue(ClaimTypes.NameIdentifier);
    if (userIdFromToken != id.ToString())
    {
      return Forbid();
    }

    var user = await _context.Users.FindAsync(id);

    if (user == null)
    {
      return NotFound(new ApiResponse(false, "User not found", null));
    }

    _mapper.Map(userUpdateDTO, user);

    try
    {
      await _context.SaveChangesAsync();
    }
    catch (DbUpdateConcurrencyException) when (!UserExists(id))
    {
      return NotFound(new ApiResponse(false, "User not found", null));
    }

    return Ok(new ApiResponse(true, "User updated successfully", _mapper.Map<UserDTO>(user)));
  }

  [HttpDelete("{id}")]
  [Authorize(Policy = "Admin")]
  public async Task<ActionResult<ApiResponse>> DeleteUser(int id)
  {
    var user = await _context.Users.FindAsync(id);
    if (user == null)
    {
      return NotFound(new ApiResponse(false, "User not found", null));
    }

    user.DeletedAt = DateTime.UtcNow;
    _context.Entry(user).State = EntityState.Modified;

    try
    {
      await _context.SaveChangesAsync();
    }
    catch (DbUpdateConcurrencyException)
    {
      if (!UserExists(id))
      {
        return NotFound(new ApiResponse(false, "User not found", null));
      }
      else
      {
        throw;
      }
    }

    return Ok(new ApiResponse(true, "User deleted successfully", null));
  }

  private bool UserExists(int id)
  {
    return _context.Users.Any(e => e.UserId == id);
  }
}
