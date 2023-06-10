// login controller with token authentication

using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using Newtonsoft.Json;
using server.Constants;
using Server.Data;
using Server.Models;

namespace server.Controllers;

// [Authorize]
[ApiController]
[Route(Consts.DEFAULT_ROUTE)]
public class LoginController : ControllerBase
{
  private readonly ApplicationDbContext _db; // create object of ApplicationDbContext class

  public LoginController(ApplicationDbContext db) // constructor
  {
    _db = db;
  }


  [HttpPost, Route("login")]
  public IActionResult Login(Login loginDTO)
  {
    try
    {
      if (string.IsNullOrEmpty(loginDTO.UserName) ||
      string.IsNullOrEmpty(loginDTO.Password))
        return BadRequest("Username and/or Password not specified");

      // Retrieve the user's credentials from the database
      var user = _db.Users.FirstOrDefault(u => u.Username == loginDTO.UserName && u.Password == loginDTO.Password);

      if (user == null)
        return Unauthorized();

      var secretKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes("your_signing_key"));
      var signinCredentials = new SigningCredentials(secretKey, SecurityAlgorithms.HmacSha256);
      var jwtSecurityToken = new JwtSecurityToken(
          issuer: "Issuer",
          audience: "Audience",
          claims: new[] { new Claim("unique_name", loginDTO.UserName) },
          expires: DateTime.UtcNow.AddHours(96),
          signingCredentials: signinCredentials
      );
      var token = new JwtSecurityTokenHandler().WriteToken(jwtSecurityToken);
      return Ok(new ApiResponse(true, token, user));
    }
    catch
    {
      return BadRequest(new ApiResponse(false, "Username or password is wrong. Please check again", null));
    }
  }

  [HttpGet]
  [Route("SetToken")]
  public string GenerateToken()
  {
    string userName = "sglbl"; // no password in token
    string audience = "Audience"; // Set the desired audience value
    string issuer = "Issuer"; // Set the desired issuer value
    string signingKey = "your_signing_key"; // Set your secret signing key

    // Create claims for the token
    var claims = new[]
    {
            new Claim(ClaimTypes.Name, userName),
            // Add any additional claims as needed
        };

    // Create a symmetric security key based on the signing key
    var securityKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(signingKey));

    // Create signing credentials using the security key
    var signingCredentials = new SigningCredentials(securityKey, SecurityAlgorithms.HmacSha256);

    // Create the token descriptor
    var tokenDescriptor = new SecurityTokenDescriptor
    {
      Subject = new ClaimsIdentity(claims),
      Audience = audience,
      Issuer = issuer,
      Expires = DateTime.UtcNow.AddHours(1296), // Set the token expiration time
      SigningCredentials = signingCredentials
    };

    // Create a token handler
    var tokenHandler = new JwtSecurityTokenHandler();

    // Generate the token
    var token = tokenHandler.CreateToken(tokenDescriptor);

    // Serialize the token to a string
    var tokenString = tokenHandler.WriteToken(token);

    return tokenString;
  }

  [HttpGet, Authorize]
  [Route("login")]
  public IActionResult LoginProfiles()
  {
    return Ok("You are authorized - Login Profile.");
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

    /*{
    "clientId": "88AD669CED46431AB77DAD88309327F5",
    "accessToken": "d8b68ca0-9d1d-4d74-a378-2294717d4383",
    "kapsam": "GENEL"
}
    */
    /* https://kampus.gtu.edu.tr/oauth/sorgulama */

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

    // TODO 
    // userName = "m.oguz2018"
    // TOKAN -> id, username, email
    // Database e bak, bu username varsa, onun bilgileri + token döndür;
    // return Ok(new ApiResponse(true, "kullanici-bulundu", userInfo));



    return Ok(new ApiResponse(true, "kullanici-kayit", jsonResult2));
    // Database e bak, bu username yoksa, 

  }


  // TODO
  // Signup

  public class CodeVerifierBody
  {
    public string? CodeVerifier { get; set; }
    public string? Code { get; set; }
  }

}
