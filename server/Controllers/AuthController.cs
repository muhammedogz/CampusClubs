using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using AutoMapper;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using Newtonsoft.Json;
using Server.Constants;
using Server.Data;
using Server.DTOs;
using Server.Models;
using Server.Secrets;

namespace Server.Controllers;

[ApiController]
[Route(Consts.DEFAULT_ROUTE)]
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

    var token = GenerateToken(user);
    var userDTO = _mapper.Map<UserDTO>(user);

    return Ok(new ApiResponse(true, "Authentication successful", new { Token = token, User = userDTO }));
  }

  [HttpPost]
  [Route("register")]
  public async Task<ActionResult<ApiResponse>> CreateUser(UserCreateDTO userDTO)
  {
    var user = _mapper.Map<User>(userDTO);
    user.CreatedAt = DateTime.UtcNow;

    await _context.Users.AddAsync(user);
    await _context.SaveChangesAsync();

    var userResult = _mapper.Map<UserDTO>(user);
    var token = GenerateToken(user);

    return CreatedAtAction("GetUserById", new { id = userResult.UserId }, new ApiResponse(true, "User created successfully", new { Token = token, User = userResult }));
  }

  [HttpPost]
  [Route("auth")]
  public async Task<IActionResult> Auth([FromBody] CodeVerifierBody codeVerifier)
  {
    var clientId = Secrets.Secret.AUTH_CLIENT_ID;
    var clientSecret = Secrets.Secret.AUTH_CLIENT_SECRET;

    if (clientId == null || clientSecret == null)
    {
      return BadRequest(new ApiResponse(false, "Env variables not loaded correctly", null));
    }

    var client = new HttpClient();

    var requestBody = new
    {
      client_id = clientId,
      client_secret = clientSecret,
      code_verifier = codeVerifier.CodeVerifier,
      code = codeVerifier.Code
    };

    var json = JsonConvert.SerializeObject(requestBody);
    var data = new StringContent(json, Encoding.UTF8, "application/json");

    var url = "https://kampus.gtu.edu.tr/oauth/dogrulama";
    var response = await client.PostAsync(url, data);

    var result = await response.Content.ReadAsStringAsync();
    var jsonResult = JsonConvert.DeserializeObject<Dictionary<string, string>>(result);

    if (jsonResult == null)
    {
      return BadRequest(new ApiResponse(false, "Can't get access_token 1", null));
    }

    var accessToken = jsonResult["access_token"];

    if (accessToken == null)
    {
      return BadRequest(new ApiResponse(false, "Can't get access_token 2", null));
    }

    url = "https://kampus.gtu.edu.tr/oauth/sorgulama";
    var requestBody2 = new
    {
      clientId = clientId,
      accessToken = accessToken,
      kapsam = "GENEL"
    };

    var json2 = JsonConvert.SerializeObject(requestBody2);
    var data2 = new StringContent(json2, Encoding.UTF8, "application/json");

    var response2 = await client.PostAsync(url, data2);

    var result2 = await response2.Content.ReadAsStringAsync();
    var jsonResult2 = JsonConvert.DeserializeObject<Dictionary<string, string>>(result2);

    if (jsonResult2 == null)
    {
      return BadRequest(new ApiResponse(false, "Auth request is not successful", null));
    }

    var userName = jsonResult2["kullanici_adi"];
    var email = jsonResult2["kurumsal_email_adresi"];

    if (userName == null || email == null)
    {
      return BadRequest(new ApiResponse(false, "Kullanici_adi or email are null", null));
    }

    User? existingUser = _context.Users.SingleOrDefault(u => u.UserName == userName);
    if (existingUser != null)
    {
      var userDTO = _mapper.Map<UserDTO>(existingUser);
      var token = GenerateToken(existingUser);
      return Ok(new ApiResponse(true, "kullanici-bulundu", new { Token = token, User = userDTO }));
    }
    else
    { // User does not exist in the database so we need to create a new user
      return Ok(new ApiResponse(true, "kullanici-kayit", jsonResult2));
    }
  }

  private string GenerateToken(User user)
  {
    var tokenHandler = new JwtSecurityTokenHandler();
    var key = Encoding.ASCII.GetBytes(Secret.SIGNING_KEY);
    var tokenDescriptor = new SecurityTokenDescriptor
    {
      Subject = new ClaimsIdentity(new[]
        {
          new Claim(ClaimTypes.Name, user.UserName),
          new Claim(ClaimTypes.NameIdentifier, user.UserId.ToString()),
          new Claim(ClaimTypes.Email, user.Email),
          new Claim(ClaimTypes.Role, user.Role.ToString())
        }),
      Expires = DateTime.UtcNow.AddDays(700),
      SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(key), SecurityAlgorithms.HmacSha256Signature)
    };

    var token = tokenHandler.CreateToken(tokenDescriptor);
    var tokenString = tokenHandler.WriteToken(token);

    return tokenString;
  }
}

public class CodeVerifierBody
{
  public string? CodeVerifier { get; set; }
  public string? Code { get; set; }
}

public class UserLoginDTO
{
  public string? UserName { get; set; }
}

