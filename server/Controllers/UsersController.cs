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
        .Include(u => u.Department)
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

  // PUT: api/User/{id}
  [HttpPut("{id}")]
  public async Task<IActionResult> UpdateUser(int id, UserUpdateDTO userUpdateDTO)
  {
    // Fetch the user from the database
    var user = await _context.Users.FindAsync(id);

    if (user == null)
    {
      return NotFound(new ApiResponse(false, "User not found", null));
    }

    // Map the updated fields to the user object
    _mapper.Map(userUpdateDTO, user);

    // Update and save the user in the database
    _context.Users.Update(user);
    await _context.SaveChangesAsync();

    // Map User to UserDTO
    var userResult = _mapper.Map<UserDTO>(user);

    // Return a success response
    return Ok(new ApiResponse(true, "User updated successfully", userResult));
  }
}
