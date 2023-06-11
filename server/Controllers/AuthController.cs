using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using AutoMapper;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using Server.Data;
using Server.DTOs;
using Server.Models;
using Server.Secrets;

namespace Server.Controllers;

[ApiController]
[Route("[controller]")]
public class AuthController : ControllerBase
{
  private readonly ApplicationDbContext _context;
  private readonly IConfiguration _configuration;
  private readonly IMapper _mapper;

  public AuthController(ApplicationDbContext context, IConfiguration configuration, IMapper mapper) // And this
  {
    _context = context;
    _configuration = configuration;
    _mapper = mapper;
  }

  [HttpPost("token")]
  public IActionResult GetToken([FromBody] UserLoginDTO userLoginDto)
  {
    var user = _context.Users.SingleOrDefault(u => u.UserName == userLoginDto.UserName);

    if (user == null)
    {
      return BadRequest(new ApiResponse(false, "Username is incorrect", null));
    }

    var tokenHandler = new JwtSecurityTokenHandler();
    var key = Encoding.ASCII.GetBytes(Secret.SIGNING_KEY);
    var tokenDescriptor = new SecurityTokenDescriptor
    {
      Subject = new ClaimsIdentity(new[]
        {
                    new Claim(ClaimTypes.Name, user.UserName),
                    new Claim(ClaimTypes.NameIdentifier, user.UserId.ToString()),
                    new Claim(ClaimTypes.Email, user.Email)
                }),
      Expires = DateTime.UtcNow.AddDays(700), // Token expiration, you can set it as per your needs
      SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(key), SecurityAlgorithms.HmacSha256Signature)
    };

    var token = tokenHandler.CreateToken(tokenDescriptor);
    var tokenString = tokenHandler.WriteToken(token);

    // Mapping the user to UserDTO
    var userDTO = _mapper.Map<UserDTO>(user);

    return Ok(new ApiResponse(true, "Authentication successful", new { Token = tokenString, User = userDTO }));
  }
}

public class UserLoginDTO
{
  public string? UserName { get; set; }
}

