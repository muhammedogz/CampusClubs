using AutoMapper;
using Microsoft.AspNetCore.Mvc;
using Server.Constants;
using Server.Data;
using Server.DTOs;
using Server.Models;


namespace Server.Controllers;
[ApiController]
[Route(Consts.DEFAULT_ROUTE)]
public class MembershipsController : ControllerBase
{
  private readonly ApplicationDbContext _context;
  private readonly IMapper _mapper;

  public MembershipsController(ApplicationDbContext context, IMapper mapper)
  {
    _context = context;
    _mapper = mapper;
  }

  [HttpPost]
  public async Task<ActionResult<ApiResponse>> AddUserToClub(UserClubDTO userClubDto)
  {
    var user = await _context.Users.FindAsync(userClubDto.UserId);
    if (user == null)
    {
      return NotFound(new ApiResponse(false, $"User with id {userClubDto.UserId} not found.", null));
    }

    var club = await _context.Clubs.FindAsync(userClubDto.ClubId);
    if (club == null)
    {
      return NotFound(new ApiResponse(false, $"Club with id {userClubDto.ClubId} not found.", null));
    }

    var userClub = new UserClub
    {
      UserId = userClubDto.UserId,
      ClubId = userClubDto.ClubId,
      ClubRole = (ClubRole)userClubDto.RoleId,
    };

    try
    {
      _context.UserClubs.Add(userClub);
      await _context.SaveChangesAsync();
    }
    catch (Exception ex)
    {
      return BadRequest(new ApiResponse(false, $"Failed to add user to club. Exception: {ex.Message}", null));
    }

    return Ok(new ApiResponse(true, "User successfully added to the club.", _mapper.Map<UserClubDTO>(userClub)));
  }


}
