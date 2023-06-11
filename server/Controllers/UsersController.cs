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
  public async Task<ActionResult<UserDTO>> GetUsers()
  {
    var users = await _context.Users.ToListAsync();

    // Here you should map your User objects to UserDTOs
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

    return Ok(new ApiResponse(true, "User found", _mapper.Map<UserDTO>(user)));
  }

  [HttpPost]
  public async Task<ActionResult<ApiResponse>> CreateUser(UserCreateDTO userDTO)
  {
    // Map UserCreateDTO to User using AutoMapper
    var user = _mapper.Map<User>(userDTO);
    // Set creation date
    user.CreatedAt = DateTime.UtcNow;

    // Save the new user to the database
    await _context.Users.AddAsync(user);
    await _context.SaveChangesAsync();

    // Map User to UserDTO
    var userResult = _mapper.Map<UserDTO>(user);

    // Return a 201 Created response
    return CreatedAtAction(nameof(GetUser), new { id = userResult.UserId }, new ApiResponse(true, "User created successfully", userResult));
  }

  // [HttpPut("{id}")]
  // public async Task<IActionResult> UpdateUser(int id, UserDTO userDTO)
  // {
  //   // Here you should map your UserDTO back to a User object
  //   // For simplicity, I'm treating the DTO as a User object
  //   var user = userDTO as User;

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
