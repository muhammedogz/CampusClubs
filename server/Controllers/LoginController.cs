// login controller with token authentication

using System;
using System.Linq;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using server.Constants;
using Server.Models;
using System.Security.Claims;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using System.IdentityModel.Tokens.Jwt;

namespace server.Controllers;

// [Authorize]
[ApiController]
[Route(Consts.DEFAULT_ROUTE)]
public class LoginController : ControllerBase
{
    [HttpPost, Route("login")]
    public IActionResult Login(Login loginDTO)
    {
        try{
            if (string.IsNullOrEmpty(loginDTO.UserName) ||
            string.IsNullOrEmpty(loginDTO.Password))
                return BadRequest("Username and/or Password not specified");
            if (loginDTO.UserName.Equals("sglbl") &&
                loginDTO.Password.Equals("sglbl123"))
            {
                var secretKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes("your_signing_key"));
                var signinCredentials = new SigningCredentials(secretKey, SecurityAlgorithms.HmacSha256);
                var jwtSecurityToken = new JwtSecurityToken(
                    issuer: "Issuer",
                    audience: "Audience",
                    claims: new[]{new Claim("unique_name", loginDTO.UserName)},
                    expires: DateTime.UtcNow.AddHours(96),
                    signingCredentials: signinCredentials
                );
                return Ok(new JwtSecurityTokenHandler().WriteToken(jwtSecurityToken));
            }
        }
        catch{
            return BadRequest("An error occurred in generating the token");
        }
        return Unauthorized();
    }

    [HttpGet]
    [Route("SetToken")]
    public string GenerateToken(){
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

}
