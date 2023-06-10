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

    // [HttpGet, Authorize]
    // [Route("login")]
    // public IActionResult LoginProfiles()
    // {
    //     return Ok("You are authorized - Login Profile.");
    // }

    [HttpGet]
    [Route("SetToken")]
    public string GenerateToken(User userInfo)
    {
        // Retrieve the user information
        string userName = userInfo.UserName;
        int userId = userInfo.userId;
        string email = userInfo.Email;

        string audience = "Audience"; // Set the desired audience value
        string issuer = "Issuer"; // Set the desired issuer value
        string signingKey = Secrets.Secret.SIGNING_KEY; // Set your secret signing key

        // Create claims for the token
        var claims = new List<Claim>
        {
            new Claim(ClaimTypes.NameIdentifier, userId.ToString()), // Add userId as NameIdentifier
            new Claim(ClaimTypes.Name, userName),
            new Claim(ClaimTypes.Email, email),
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

        User? existingUser = _db.User.SingleOrDefault(u => u.UserName == userName);
        if (existingUser != null)
        {
            var token = GenerateToken(existingUser);
            return Ok(new ApiResponse(true, "kullanici-bulundu", new { existingUser, token }));
        }
        else
        { // User does not exist in the database so we need to create a new user
            return Ok(new ApiResponse(true, "kullanici-kayit", jsonResult2));
        }
    }


    // Signup
    [HttpPost]
    [Route("signup")]
    public IActionResult signup([FromBody] UserNameandEmailBody userNameandEmailBody)
    {
        try{
            var userInfo = new User
            {
                UserName = userNameandEmailBody.userName,
                Email = userNameandEmailBody.email,
                firstName = userNameandEmailBody.firstName,
                lastName = userNameandEmailBody.lastName,
                image = userNameandEmailBody.image
            };
            using (var dbContext = _db)
            {
                dbContext.User.Add(userInfo);
                dbContext.SaveChanges();
            }
            int newUserId = userInfo.userId;

            // Generate token or retrieve existing token
            var token = GenerateToken(userInfo);

            return Ok(new ApiResponse(true, "kullanici-kayit", new { userInfo, token }));
        }
        catch(Exception e){
            return BadRequest(new ApiResponse(false, "Error while signing up, please check all required fields.", e.Message));
        }
    }


    public class CodeVerifierBody
    {
        public string? CodeVerifier { get; set; }
        public string? Code { get; set; }
    }

    public class UserNameandEmailBody
    {
        // constructor
        public UserNameandEmailBody(string userName, string email, string firstName, string lastName, string image)
        {
            this.userName = userName;
            this.email = email;
            this.firstName = firstName;
            this.lastName = lastName;
            this.image = image;
        }
        public string userName { get; set; }
        public string email { get; set; }
        public string firstName { get; set; }
        public string lastName { get; set; }
        public string image { get; set; }
    }

}
