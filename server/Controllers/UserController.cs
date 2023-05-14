using Microsoft.Data.SqlClient;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using server.Constants;
using Server.Data;
using Server.Models;

namespace server.Controllers;

[ApiController]
[Route(Consts.DEFAULT_ROUTE)]
public class UserController : ControllerBase
{
    private readonly ApplicationDbContext _db; // create object of ApplicationDbContext class

    public UserController(ApplicationDbContext db) // constructor
    {
        _db = db;
    }

    [HttpGet]
    public IActionResult GetAll()
    {   // Return all user info
        try{
            IEnumerable<User> userList = _db.Users;
            return Ok(new ApiResponse(true, "User request is successful", userList));
        }
        catch (Exception e){
            return StatusCode(StatusCodes.Status500InternalServerError, new ApiResponse(false, "User request is unsuccessful", e.Message));
        }
    }

    [HttpGet("UserInfoById/id")]
    public IActionResult GetUserInfoById(int id)
    {   
        /*** returns all info ***/
        User? user = _db.Users.SingleOrDefault(u => u.userId == id);

        List<Club> clubs = new List<Club>();
        using (SqlConnection connection = (SqlConnection)_db.Database.GetDbConnection())
        {
            string query = "SELECT c.* FROM Club c INNER JOIN ClubMembers cm ON c.clubId = cm.clubId INNER JOIN [Users] u ON u.userId = cm.userId WHERE u.userId = @userId";
            SqlCommand command = new SqlCommand(query, connection);
            command.Parameters.AddWithValue("@userId", id);

            connection.Open();
            SqlDataReader reader = command.ExecuteReader();

            while (reader.Read())
            {
                Club club = new Club
                {
                    clubId = reader.GetInt32(0),
                    slug = reader.GetString(1),
                    name = reader.GetString(2),
                    description = reader.GetString(3),
                    image = reader.GetString(4),
                    validFrom = reader.IsDBNull(5) ? null : reader.GetDateTime(5),
                    validUntil = reader.IsDBNull(6) ? null : reader.GetDateTime(6)
                };
                clubs.Add(club);
            }
            reader.Close();
        }


        if (user != null)
        {
            user.clubsRegistered = clubs;
            return Ok(new ApiResponse(true, "User request is successfull", user));
        }

        return NotFound(new ApiResponse(false, "User request is unsuccessful since user couldn't be found", null));
    }

    [HttpGet("UserOnlyClubsById/id")]
    public List<Server.Models.Club> GetUserClubsById(int id)
    {   
        List<Club> clubs = new List<Club>();
        using (SqlConnection connection = (SqlConnection)_db.Database.GetDbConnection())
        {
            string query = "SELECT c.* FROM Club c INNER JOIN ClubMembers cm ON c.clubId = cm.clubId INNER JOIN [Users] u ON u.userId = cm.userId WHERE u.userId = @userId";
            SqlCommand command = new SqlCommand(query, connection);
            command.Parameters.AddWithValue("@userId", id);

            connection.Open();
            SqlDataReader reader = command.ExecuteReader();

            while (reader.Read())
            {
                Club club = new Club
                {
                    clubId = reader.GetInt32(0),
                    slug = reader.GetString(1),
                    name = reader.GetString(2),
                    description = reader.GetString(3),
                    image = reader.GetString(4),
                    validFrom = reader.IsDBNull(5) ? null : reader.GetDateTime(5),
                    validUntil = reader.IsDBNull(6) ? null : reader.GetDateTime(6)
                };
                clubs.Add(club);
            }
            reader.Close();
        }
        return clubs;
    }

    [HttpGet("UserNoClubsById/id")]
    public IActionResult GetUserNoClubsById(int id)
    {   
        /*** only returns username ***/
        // // Get the underlying SqlConnection object
        // SqlConnection sqlConnection = (SqlConnection)_db.Database.GetDbConnection();

        // // get sql connection from appsettings.json
        // var sql = "SELECT * FROM Users WHERE userId = @Id";
        // var cmd = new SqlCommand(sql, sqlConnection);
        // cmd.Parameters.AddWithValue("@Id", id);

        // sqlConnection.Open();
        // var reader = cmd.ExecuteReader();
        // if (reader.Read())
        // {
        //     var name = reader.GetString(1);
        //     return name;
        // }

        /*** returns all info ***/
        User? user = _db.Users.SingleOrDefault(u => u.userId == id);

        if (user != null)
        {
            return Ok(new ApiResponse(true, "User request is successfull", user));
        }

        return NotFound(new ApiResponse(false, "User request is unsuccessful since user couldn't be found", null));
    }

    [HttpGet("UserInfoById/username")]
    public IActionResult GetUserByUsername(string username)
    {   
        /*** only returns username ***/
        // // Get the underlying SqlConnection object
        // SqlConnection sqlConnection = (SqlConnection)_db.Database.GetDbConnection();

        // // get sql connection from appsettings.json
        // var sql = "SELECT * FROM Users WHERE username = @username";
        // var cmd = new SqlCommand(sql, sqlConnection);
        // cmd.Parameters.AddWithValue("@username", username);

        // sqlConnection.Open();
        // var reader = cmd.ExecuteReader();
        // if (reader.Read())
        // {
        //     User user = new User
        //     {
        //         userId = reader.GetInt32(0),
        //         Username = reader.GetString(1),
        //         Name = reader.GetString(2),
        //         Email = reader.GetString(3),
        //         Password = reader.GetString(4),
        //         CreatedDate = reader.GetDateTime(5),
        //         DeletedDate = reader.IsDBNull(6) ? null : reader.GetDateTime(6)
        //     };

        //     return Ok(user);
        // }

        // return NotFound("User not found");
        
        /*** returns all info ***/
        User? user = _db.Users.SingleOrDefault(u => u.Username == username);

        if (user != null)
        {
            return Ok(new ApiResponse(true, "User request is successful", user));
        }

        return NotFound(new ApiResponse(false, "User not found", null));
    }

    [HttpPost]
    public IActionResult Create(User user)
    {
        try{
            // Get the underlying SqlConnection object
            SqlConnection sqlConnection = (SqlConnection)_db.Database.GetDbConnection();

            var sql = "INSERT INTO Users (userId, username, name, email, password, createdDate, deletedDate) VALUES (@Id, @Username, @Name, @Email, @Password, @CreatedDate, @DeletedDate)";
            var cmd = new SqlCommand(sql, sqlConnection);
            cmd.Parameters.AddWithValue("@Id", user.userId);
            cmd.Parameters.AddWithValue("@Username", user.Username);
            cmd.Parameters.AddWithValue("@Name", user.Name);
            cmd.Parameters.AddWithValue("@Email", user.Email);
            cmd.Parameters.AddWithValue("@Password", user.Password);
            cmd.Parameters.AddWithValue("@CreatedDate", user.CreatedDate ?? (object)DBNull.Value);
            cmd.Parameters.AddWithValue("@DeletedDate", user.DeletedDate ?? (object)DBNull.Value);
            /* ?? (object)DBNull.Value makes allow nulls by converting DBNull */

            sqlConnection.Open();
            int rowsAffected = cmd.ExecuteNonQuery();
            sqlConnection.Close();

            if (rowsAffected > 0)
            {
                return Ok(new ApiResponse(true, "User created successfully.", user));
            }
            else
            {
                return BadRequest(new ApiResponse(false, "BadRequest: Unable to create the user.", null));
            }
        }
        catch (Exception e){
            return StatusCode(StatusCodes.Status500InternalServerError, new ApiResponse(false, "Unable to create the user. Duplicate user info are not allowed.", e.Message));
        }
    }

    [HttpDelete("userById/{userId}")]
    public IActionResult DeleteWithId(int userId)
    {
        // Get the underlying SqlConnection object
        SqlConnection sqlConnection = (SqlConnection)_db.Database.GetDbConnection();
        User? user = _db.Users.FirstOrDefault(u => u.userId == userId);
        var sql = "DELETE FROM Users WHERE userId = @Id";
        var cmd = new SqlCommand(sql, sqlConnection);
        cmd.Parameters.AddWithValue("@Id", userId);

        sqlConnection.Open();
        int rowsAffected = cmd.ExecuteNonQuery();
        sqlConnection.Close();

        if (rowsAffected > 0)
        {
            return Ok(new ApiResponse(true, "User deleted successfully.", user));
        }
        else
        {
            return NotFound(new ApiResponse(false, "User not found.", null));
        }
    }

    [HttpDelete("userByUsername/{username}")]
    public IActionResult DeleteWithUsername(string username)
    {
        // Get the underlying SqlConnection object
        SqlConnection sqlConnection = (SqlConnection)_db.Database.GetDbConnection();

        var sql = "DELETE FROM Users WHERE username = @username";
        var cmd = new SqlCommand(sql, sqlConnection);
        cmd.Parameters.AddWithValue("@username", username);

        sqlConnection.Open();
        int rowsAffected = cmd.ExecuteNonQuery();
        sqlConnection.Close();

        if (rowsAffected > 0)
        {
            return Ok(new ApiResponse(true, "User deleted successfully.", username));
        }
        else
        {
            return NotFound(new ApiResponse(false, "User not found.", null));
        }
    }

    [HttpPut("{userId}")]
    public IActionResult Update(int userId, User updatedUser)
    {
        // Get the underlying SqlConnection object
        SqlConnection sqlConnection = (SqlConnection)_db.Database.GetDbConnection();

        var sql = "UPDATE Users SET username = @Username, name = @Name, email = @Email, password = @Password, createdDate = @CreatedDate, deletedDate = @DeletedDate WHERE userId = @Id";
        var cmd = new SqlCommand(sql, sqlConnection);
        cmd.Parameters.AddWithValue("@Id", userId);
        cmd.Parameters.AddWithValue("@Username", updatedUser.Username);
        cmd.Parameters.AddWithValue("@Name", updatedUser.Name);
        cmd.Parameters.AddWithValue("@Email", updatedUser.Email);
        cmd.Parameters.AddWithValue("@Password", updatedUser.Password);
        cmd.Parameters.AddWithValue("@CreatedDate", updatedUser.CreatedDate ?? (object)DBNull.Value);
        cmd.Parameters.AddWithValue("@DeletedDate", updatedUser.DeletedDate ?? (object)DBNull.Value);

        sqlConnection.Open();
        int rowsAffected = cmd.ExecuteNonQuery();
        sqlConnection.Close();

        if (rowsAffected > 0)
        {
            return Ok(new ApiResponse(true, "User request is successful", updatedUser));
        }
        else
        {
            return NotFound(new ApiResponse(false, "User not found.", null));
        }
    }


}
