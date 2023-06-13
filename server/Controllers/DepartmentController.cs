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
public class DepartmentController : ControllerBase
{
  private readonly ApplicationDbContext _context;
  private readonly IMapper _mapper;

  public DepartmentController(ApplicationDbContext context, IMapper mapper)
  {
    _context = context;
    _mapper = mapper;
  }

  [HttpGet]
  public async Task<ActionResult<ApiResponse>> GetAllDepartments()
  {
    var departments = await _context.Departments.ToListAsync();

    if (departments == null || !departments.Any())
    {
      return NotFound(new ApiResponse(false, "No departments found", null));
    }

    var departmentDtos = _mapper.Map<List<DepartmentDTO>>(departments);
    return Ok(new ApiResponse(true, "Departments found", departmentDtos));
  }
}
