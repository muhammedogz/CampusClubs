using Microsoft.AspNetCore.Mvc;
using Microsoft.Data.SqlClient;
using Microsoft.EntityFrameworkCore;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using server.Constants;
using Server.Data;
using Server.Models;

namespace server.Controllers;

[ApiController]
[Route(Consts.DEFAULT_ROUTE)]
public class ClubController : ControllerBase
{
  private readonly ApplicationDbContext _db; // create object of ApplicationDbContext class
  private Helper helper = new Helper();

  public ClubController(ApplicationDbContext db) // constructor
  {
    _db = db;
  }

  [HttpGet]
  public IActionResult GetAll()
  {
    try
    {
      using (SqlConnection connection = (SqlConnection)_db.Database.GetDbConnection())
      {
        string query = "SELECT c.* FROM Club c";
        SqlCommand command = new SqlCommand(query, connection);

        connection.Open();
        SqlDataReader reader = command.ExecuteReader();

        List<Club> clubs = new List<Club>();
        while (reader.Read())
        {
          Club club = new Club
          {
            clubId = reader.GetInt32(0),
            slug = reader.GetString(1),
            name = reader.GetString(2),
            description = reader.GetString(3),
            image = reader.GetString(4),
            announcements = helper.GetAnnouncementsByClubId(connection, reader.GetInt32(0)),
            events = helper.GetEventsByClubId(connection, reader.GetInt32(0)),
            validFrom = reader.IsDBNull(5) ? null : reader.GetDateTime(5),
            validUntil = reader.IsDBNull(6) ? null : reader.GetDateTime(6)
          };
          clubs.Add(club);
        }
        return Ok(new ApiResponse(true, "Club request is successful.", clubs));
      }
    }
    catch
    {
      return NotFound(new ApiResponse(false, "Club request is unsuccessful since Club couldn't be found", null));
    }

  }

  [HttpGet("id")]
  public IActionResult GetClubById(int id)
  {
    using (SqlConnection connection = (SqlConnection)_db.Database.GetDbConnection())
    {
      string query = "SELECT * FROM Club WHERE clubId = @clubId";
      SqlCommand command = new SqlCommand(query, connection);
      command.Parameters.AddWithValue("@clubId", id);

      connection.Open();
      SqlDataReader reader = command.ExecuteReader();

      if (reader.Read())
      {
        Club club = new Club
        {
          clubId = reader.GetInt32(0),
          slug = reader.GetString(1),
          name = reader.GetString(2),
          description = reader.GetString(3),
          image = reader.GetString(4),
          announcements = helper.GetAnnouncementsByClubId(connection, id),
          events = helper.GetEventsByClubId(connection, id),
          validFrom = reader.IsDBNull(5) ? null : reader.GetDateTime(5),
          validUntil = reader.IsDBNull(6) ? null : reader.GetDateTime(6)
        };
        reader.Close();
        return Ok(new ApiResponse(true, "Club request is successful.", club));
      }
    }
    return NotFound(new ApiResponse(false, "Club request is unsuccessful since Club couldn't be found", null));
  }



  // TODO
  // Create authorize ye bağlanacak
  // Tokendan bi şey almak ile authorize olmasının alakası yok
  [HttpPost]
  [Route("test-deneme")]
  public IActionResult TestDeneme(string token)
  {
    // var token = biŞekilde;
    // var userInfoFromToken = decodeToken(token);
    // var userId = userInfoFromToken.id;
    // var unserName = userInfoFromToken.userName;
    // var email = userInfoFromToken.email;

    // var userInfo = db.Users.SingleOrDefault(u => u.UserName == userName);
    // if (!userInfo.isSuperAdmin) {
    //   return BadReponse // unauthorized
    // } 
    // else {
    // sen authsun blader
    // }

    var tokenHandler = new JwtSecurityTokenHandler();

    // Read the token and parse it into a JwtSecurityToken object
    var jwtToken = tokenHandler.ReadJwtToken(token);

    // Access the claims from the decoded token
    var userIdClaim = jwtToken.Claims.FirstOrDefault(c => c.Type == "nameid")?.Value;
    var uniqueNameClaim = jwtToken.Claims.FirstOrDefault(c => c.Type == "unique_name")?.Value;
    var emailClaim = jwtToken.Claims.FirstOrDefault(c => c.Type == "email")?.Value;

    // Example: Retrieve and print the username
    Console.WriteLine("Name ID: " + userIdClaim);
    Console.WriteLine("Unique Name: " + uniqueNameClaim);
    Console.WriteLine("Email: " + emailClaim);

    // Perform additional operations with the claims as needed
    User? userInfo = _db.User.SingleOrDefault(u => u.UserName == userIdClaim);
    if(userInfo == null){
      return Unauthorized(new ApiResponse(false, "User is not authorized.", null));
    }
    else if (!userInfo.isSuperAdmin)
    {
      return Unauthorized(new ApiResponse(false, "User is not authorized.", null));
    }
    else
    {
      return Ok(new ApiResponse(true, "User is authorized.", null));
    }
  }

  [HttpPost]
  [Route("create2")]
  public IActionResult Create2(Club club)
  {
    try{
      var req = Request;
      // get token from request; get user from token, get admin info from user.
      if(helper.checkIsUserSuperAdminFromToken(req, _db)){
        Console.WriteLine("User is super admin");
        _db.Club.Add(club);
        _db.SaveChanges();
        return Ok(new ApiResponse(true, "User is authorized.", club));
      }
      else{
        return Unauthorized(new ApiResponse(false, "User is not authorized.", null));
      }
    }
    catch(Exception e){
      return StatusCode(StatusCodes.Status500InternalServerError, new ApiResponse(false, "Unable to create the Club. Internal server error occurred.", e.Message));
    }
  }


  [HttpPost]
  public IActionResult Create(Club Club)
  {
    try
    {
      // Get the underlying SqlConnection object
      SqlConnection sqlConnection = (SqlConnection)_db.Database.GetDbConnection();

      // Convert the list of IDs to a comma-separated string
      var sql = "INSERT INTO Club (clubId, slug, name, description, image, validFrom, validUntil) VALUES (@Id, @Slug, @Name, @Description, @Image, @ValidFrom, @ValidUntil)";
      var cmd = new SqlCommand(sql, sqlConnection);
      cmd.Parameters.AddWithValue("@Id", Club.clubId);
      cmd.Parameters.AddWithValue("@Slug", Club.slug);
      cmd.Parameters.AddWithValue("@Name", Club.name);
      cmd.Parameters.AddWithValue("@Description", Club.description);
      cmd.Parameters.AddWithValue("@Image", Club.image);

      // cmd.Parameters.AddWithValue("@Advisor", Club.advisor);
      // cmd.Parameters.AddWithValue("@Advisor", (object)DBNull.Value);
      cmd.Parameters.AddWithValue("@ValidFrom", Club.validFrom ?? (object)DBNull.Value);
      cmd.Parameters.AddWithValue("@ValidUntil", Club.validUntil ?? (object)DBNull.Value);
      /* ?? (object)DBNull.Value makes allow nulls by converting DBNull */

      sqlConnection.Open();
      int rowsAffected = cmd.ExecuteNonQuery();
      // var sql2 = "SELECT c.*, m.memberId, m.memberRole FROM Club c JOIN ClubMembers m ON c.clubId = m.clubId";
      // var cmd2 = new SqlCommand(sql2, sqlConnection);
      // cmd2.Parameters.AddWithValue("@Members", Club.members);
      // int rowsAffected2 = cmd2.ExecuteNonQuery();
      sqlConnection.Close();

      if (rowsAffected > 0)
      {
        return Ok(new ApiResponse(true, "Club created successfully.", Club));
      }
      else
      {
        return BadRequest(new ApiResponse(false, "BadRequest: Unable to create the Club.", null));
      }
    }
    catch (Exception e)
    {
      return StatusCode(StatusCodes.Status500InternalServerError, new ApiResponse(false, "Unable to create the Club. Internal server error occured.", e.Message));
    }
  }

  [HttpDelete("id")]
  public IActionResult DeleteWithId(int id)
  {
    // Get the underlying SqlConnection object
    SqlConnection sqlConnection = (SqlConnection)_db.Database.GetDbConnection();
    Club? Club = _db.Club.FirstOrDefault(u => u.clubId == id);
    var sql = "DELETE FROM Club WHERE clubId = @Id";
    var cmd = new SqlCommand(sql, sqlConnection);
    cmd.Parameters.AddWithValue("@Id", id);

    sqlConnection.Open();
    int rowsAffected = cmd.ExecuteNonQuery();
    sqlConnection.Close();

    if (rowsAffected > 0)
    {
      return Ok(new ApiResponse(true, "Club deleted successfully.", Club));
    }
    else
    {
      return NotFound(new ApiResponse(false, "Club not found.", null));
    }
  }

  [HttpPut("id")]
  public IActionResult Update(int id, Club updatedClub) // çç no event/anno update
  {
    // Get the underlying SqlConnection object
    SqlConnection sqlConnection = (SqlConnection)_db.Database.GetDbConnection();

    // var sql = "UPDATE Club SET cludId = @id, slug = @slug, name = @name, description = @description, image = @image, announcements = @announcements, events = @events WHERE clubId = @id";
    var sql = "UPDATE Club SET clubId = @id, slug = @slug, name = @name, description = @description, image = @image WHERE clubId = @id";
    var cmd = new SqlCommand(sql, sqlConnection);
    cmd.Parameters.AddWithValue("@id", id);
    cmd.Parameters.AddWithValue("@slug", updatedClub.slug);
    cmd.Parameters.AddWithValue("@name", updatedClub.name);
    cmd.Parameters.AddWithValue("@description", updatedClub.description);
    cmd.Parameters.AddWithValue("@image", updatedClub.image);
    // cmd.Parameters.AddWithValue("@announcements", updatedClub.announcements);
    // cmd.Parameters.AddWithValue("@events", updatedClub.events);
    cmd.Parameters.AddWithValue("@ValidFrom", updatedClub.validFrom ?? (object)DBNull.Value);
    cmd.Parameters.AddWithValue("@ValidUntil", updatedClub.validUntil ?? (object)DBNull.Value);

    sqlConnection.Open();
    int rowsAffected = cmd.ExecuteNonQuery();
    sqlConnection.Close();

    if (rowsAffected > 0)
    {
      return Ok(new ApiResponse(true, "Club request is successful", updatedClub));
    }
    else
    {
      return NotFound(new ApiResponse(false, "Club not found.", null));
    }
  }


}
