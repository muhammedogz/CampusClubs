// login controller with token authentication

using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Microsoft.AspNetCore.Authorization;
using server.Constants;
using Microsoft.Data.SqlClient;
using Microsoft.EntityFrameworkCore;
using Server.Data;
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
        try
        {
            if (string.IsNullOrEmpty(loginDTO.UserName) ||
            string.IsNullOrEmpty(loginDTO.Password))
                return BadRequest("Username and/or Password not specified");
            if (loginDTO.UserName.Equals("sglbl") &&
                loginDTO.Password.Equals("sglbl123"))
            {
                var secretKey = new SymmetricSecurityKey
                // (Encoding.UTF8.GetBytes("eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwidXNlck5hbWUiOiJzZ2xibCIsInBhc3N3b3JkIjoic2dsYmwxMjMifQ.T53csRt1UbgNks_Oi3EML-y0_l45fCpUUjGQEpShzMc"));
                (Encoding.UTF8.GetBytes("YWxpY2VudGVyX2FkZHI="));
                var signinCredentials = new SigningCredentials
            (secretKey, SecurityAlgorithms.HmacSha256);
                var jwtSecurityToken = new JwtSecurityToken(
                    issuer: "ABCXYZ",
                    audience: "http://localhost:5130",
                    claims: new List<Claim>(),
                    expires: DateTime.Now.AddMinutes(10),
                    signingCredentials: signinCredentials
                );
                Ok(new JwtSecurityTokenHandler().
                WriteToken(jwtSecurityToken));
            }
        }
        catch
        {
            return BadRequest("An error occurred in generating the token");
        }
        return Unauthorized();
    }

    [HttpGet, Authorize]
    public IEnumerable<WeatherForecast> Get()
    {
        return Enumerable.Range(1, 5).Select(index => new WeatherForecast
        {
            Date = DateTime.Now.AddDays(index),
            TemperatureC = Random.Shared.Next(-20, 55)
        })
        .ToArray();
    }

    // public IActionResult Index()
    // {
    //     return Ok("You are authorized");
    // }

    [HttpGet, Authorize]
    [Route("token/Get3")]
    public IActionResult LoginProfiles()
    {
        return Ok("You are authorized - Login Profile.");
    }

    // [HttpGet]
    // public IEnumerable<int> Get()
    // {
    //     return new int[] { 1, 2, 3, 4, 5 };
    // }

    [HttpGet]
    [Route("token/Get2")]
    public string GenerateToken(){
        string userName = "sglbl";
        string password = "sglbl123";
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


}
