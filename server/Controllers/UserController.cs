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
            IEnumerable<User> objCategoryList = _db.Users;
            return Ok(objCategoryList);
        }
        catch (Exception e){
            return StatusCode(StatusCodes.Status500InternalServerError, e.Message);
        }
    }

    [HttpGet("id")]
    public string GetUserName(int id)
    {   
        // Get the underlying SqlConnection object
        SqlConnection sqlConnection = (SqlConnection)_db.Database.GetDbConnection();

        // get sql connection from appsettings.json
        var sql = "SELECT * FROM Users WHERE userId = @Id";
        var cmd = new SqlCommand(sql, sqlConnection);
        cmd.Parameters.AddWithValue("@Id", id);

        sqlConnection.Open();
        var reader = cmd.ExecuteReader();
        if (reader.Read())
        {
            var name = reader.GetString(1);
            return name;
        }

        return "User not found";
    }

    [HttpPost]
    public IActionResult Create(User objCategory)
    {
        // Get the underlying SqlConnection object
        SqlConnection sqlConnection = (SqlConnection)_db.Database.GetDbConnection();

        var sql = "INSERT INTO Users (userId, username, name, email, password, createdDate, deletedDate) VALUES (@Id, @Username, @Name, @Email, @Password, @CreatedDate, @DeletedDate)";
        var cmd = new SqlCommand(sql, sqlConnection);
        cmd.Parameters.AddWithValue("@Id", objCategory.UserId);
        cmd.Parameters.AddWithValue("@Username", objCategory.Username);
        cmd.Parameters.AddWithValue("@Name", objCategory.Name);
        cmd.Parameters.AddWithValue("@Email", objCategory.Email);
        cmd.Parameters.AddWithValue("@Password", objCategory.Password);
        cmd.Parameters.AddWithValue("@CreatedDate", objCategory.CreatedDate ?? (object)DBNull.Value);
        cmd.Parameters.AddWithValue("@DeletedDate", objCategory.DeletedDate ?? (object)DBNull.Value);
        /* ?? (object)DBNull.Value makes allow nulls by converting DBNull */

        sqlConnection.Open();
        int rowsAffected = cmd.ExecuteNonQuery();
        sqlConnection.Close();

        if (rowsAffected > 0)
        {
            return Ok("User created successfully.");
        }
        else
        {
            return BadRequest("BadRequest: Unable to create the user.");
        }
    }

    [HttpDelete("{userId}")]
    public IActionResult Delete(int userId)
    {
        // Get the underlying SqlConnection object
        SqlConnection sqlConnection = (SqlConnection)_db.Database.GetDbConnection();

        var sql = "DELETE FROM Users WHERE userId = @Id";
        var cmd = new SqlCommand(sql, sqlConnection);
        cmd.Parameters.AddWithValue("@Id", userId);

        sqlConnection.Open();
        int rowsAffected = cmd.ExecuteNonQuery();
        sqlConnection.Close();

        if (rowsAffected > 0)
        {
            return Ok("User deleted successfully.");
        }
        else
        {
            return NotFound("User not found.");
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
            return Ok("User updated successfully.");
        }
        else
        {
            return NotFound("User not found.");
        }
    }


}
