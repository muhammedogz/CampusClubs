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
public class ClubsController : ControllerBase
{
  private readonly ApplicationDbContext _context;
  private readonly IMapper _mapper;

  public ClubsController(ApplicationDbContext context, IMapper mapper)
  {
    _context = context;
    _mapper = mapper;
  }

  [HttpGet]
  public async Task<ActionResult<ApiResponse>> GetClubs()
  {
    var clubs = await _context.Clubs
        .ToListAsync();

    return Ok(new ApiResponse(true, "Clubs retrieved successfully", _mapper.Map<List<ClubSummaryDTO>>(clubs)));
  }

  [HttpGet("{id}")]
  public async Task<ActionResult<ApiResponse>> GetClub(int id)
  {
    var club = await _context.Clubs
        .Include(c => c.Advisor)
        .Include(c => c.Events)
            .ThenInclude(e => e.UserEvents)
        .Include(c => c.Announcements)
        .Include(c => c.UserClubs)
            .ThenInclude(uc => uc.User)
        .AsSplitQuery()
        .FirstOrDefaultAsync(c => c.ClubId == id);

    if (club == null)
    {
      return NotFound(new ApiResponse(false, "Club not found", null));
    }

    return Ok(new ApiResponse(true, "Club found", _mapper.Map<ClubDTO>(club)));
  }

  [HttpPost]
  public async Task<ActionResult<ApiResponse>> CreateClub(CreateClubDTO clubDTO)
  {
    var club = _mapper.Map<Club>(clubDTO);
    club.CreatedAt = DateTime.UtcNow;

    await _context.Clubs.AddAsync(club);
    await _context.SaveChangesAsync();

    return CreatedAtAction(nameof(GetClub), new { id = club.ClubId }, new ApiResponse(true, "Club created successfully", _mapper.Map<ClubDTO>(club)));
  }
}
