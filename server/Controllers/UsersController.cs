using AutoMapper;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Server.Constants;
using Server.Data;
using Server.DTOs;
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

  [HttpGet]
  public async Task<ActionResult<UserDto>> GetUsers()
  {
    var users = await _context.Users.ToListAsync();

    // Here you should map your User objects to UserDtos
    // For simplicity, I'm returning the User objects directly
    return Ok(users);
  }

  [HttpGet("{id}")]
  public async Task<ActionResult<ApiResponse>> GetUser(int id)
  {
    var user = await _context.Users
        .Include(u => u.UserClubs)
            .ThenInclude(uc => uc.Club)
        .Include(u => u.UserEvents)
            .ThenInclude(ue => ue.Event)
        .AsSplitQuery()
        .FirstOrDefaultAsync(u => u.UserId == id);

    if (user == null)
    {
      return NotFound(new ApiResponse(false, "User not found", null));
    }

    return Ok(new ApiResponse(true, "User found", _mapper.Map<UserDto>(user)));
  }

  // [HttpPut("{id}")]
  // public async Task<IActionResult> UpdateUser(int id, UserDto userDto)
  // {
  //   // Here you should map your UserDto back to a User object
  //   // For simplicity, I'm treating the DTO as a User object
  //   var user = userDto as User;

  //   if (id != user.UserId)
  //   {
  //     return BadRequest();
  //   }

  //   _context.Entry(user).State = EntityState.Modified;

  //   try
  //   {
  //     await _context.SaveChangesAsync();
  //   }
  //   catch (DbUpdateConcurrencyException)
  //   {
  //     if (!UserExists(id))
  //     {
  //       return NotFound();
  //     }
  //     else
  //     {
  //       throw;
  //     }
  //   }

  //   return NoContent();
  // }

  private bool UserExists(int id)
  {
    return _context.Users.Any(e => e.UserId == id);
  }
}
