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
public class EventsController : ControllerBase
{
  private readonly ApplicationDbContext _context;
  private readonly IMapper _mapper;

  public EventsController(ApplicationDbContext context, IMapper mapper)
  {
    _context = context;
    _mapper = mapper;
  }

  [HttpGet]
  public async Task<ActionResult<ApiResponse>> GetEvents()
  {
    var events = await _context.Events
        .Include(e => e.Club)
        .Include(e => e.UserEvents)
            .ThenInclude(ue => ue.User)
        .Select(e => _mapper.Map<EventDTO>(e))
        .ToListAsync();

    return Ok(new ApiResponse(true, "Events retrieved successfully", events));
  }

  [HttpPost]
  public async Task<ActionResult<ApiResponse>> CreateEvent(EventCreateDTO eventDTO)
  {
    var eventModel = _mapper.Map<Event>(eventDTO);
    eventModel.CreatedAt = DateTime.UtcNow;

    _context.Events.Add(eventModel);
    await _context.SaveChangesAsync();

    return CreatedAtAction(nameof(GetEvent), new { id = eventModel.EventId }, new ApiResponse(true, "Event created successfully", _mapper.Map<EventDTO>(eventModel)));
  }

  [HttpGet("{id}")]
  public async Task<ActionResult<ApiResponse>> GetEvent(int id)
  {
    var eventModel = await _context.Events
        .Include(e => e.Club)
        .Include(e => e.UserEvents)
            .ThenInclude(ue => ue.User)
        .FirstOrDefaultAsync(e => e.EventId == id);

    if (eventModel == null)
    {
      return NotFound(new ApiResponse(false, "Event not found", null));
    }

    return Ok(new ApiResponse(true, "Event retrieved successfully", _mapper.Map<EventDTO>(eventModel)));
  }
}