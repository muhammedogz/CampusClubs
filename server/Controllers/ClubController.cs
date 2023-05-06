using Microsoft.Data.SqlClient;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using server.Constants;
using Server.Data;
using Server.Models;

namespace server.Controllers;

[ApiController]
[Route(Consts.DEFAULT_ROUTE)]
public class ClubController : ControllerBase
{
    private readonly ApplicationDbContext _db; // create object of ApplicationDbContext class

    public ClubController(ApplicationDbContext db) // constructor
    {
        _db = db;
    }

    [HttpGet]
    public IActionResult GetAll()
    {   // Return all Club info
        try{
            IEnumerable<Club> ClubList = _db.Clubs;
            return Ok(new ApiResponse(true, "Club request is successful", ClubList));
        }
        catch (Exception e){
            return StatusCode(StatusCodes.Status500InternalServerError, new ApiResponse(false, "Club request is unsuccessful", e.Message));
        }
    }

    [HttpGet("id")]
    public IActionResult GetClubById(int id)
    {   
        /*** only returns Clubname ***/
        // // Get the underlying SqlConnection object
        // SqlConnection sqlConnection = (SqlConnection)_db.Database.GetDbConnection();

        // // get sql connection from appsettings.json
        // var sql = "SELECT * FROM Clubs WHERE ClubId = @Id";
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
        Club? Club = _db.Clubs.SingleOrDefault(u => u.ClubId == id);

        if (Club != null)
        {
            return Ok(new ApiResponse(true, "Club request is successfull", Club));
        }

        return NotFound(new ApiResponse(false, "Club request is unsuccessful since Club couldn't be found", null));
    }

    [HttpGet("Clubname")]
    public IActionResult GetClubByClubname(string Clubname)
    {   
        /*** only returns Clubname ***/
        // // Get the underlying SqlConnection object
        // SqlConnection sqlConnection = (SqlConnection)_db.Database.GetDbConnection();

        // // get sql connection from appsettings.json
        // var sql = "SELECT * FROM Clubs WHERE Clubname = @Clubname";
        // var cmd = new SqlCommand(sql, sqlConnection);
        // cmd.Parameters.AddWithValue("@Clubname", Clubname);

        // sqlConnection.Open();
        // var reader = cmd.ExecuteReader();
        // if (reader.Read())
        // {
        //     Club Club = new Club
        //     {
        //         ClubId = reader.GetInt32(0),
        //         Clubname = reader.GetString(1),
        //         Name = reader.GetString(2),
        //         Email = reader.GetString(3),
        //         Password = reader.GetString(4),
        //         CreatedDate = reader.GetDateTime(5),
        //         DeletedDate = reader.IsDBNull(6) ? null : reader.GetDateTime(6)
        //     };

        //     return Ok(Club);
        // }

        // return NotFound("Club not found");
        
        /*** returns all info ***/
        Club? Club = _db.Clubs.SingleOrDefault(u => u.Clubname == Clubname);

        if (Club != null)
        {
            return Ok(new ApiResponse(true, "Club request is successful", Club));
        }

        return NotFound(new ApiResponse(false, "Club not found", null));
    }

    [HttpPost]
    public IActionResult Create(Club Club)
    {
        try{
            // Get the underlying SqlConnection object
            SqlConnection sqlConnection = (SqlConnection)_db.Database.GetDbConnection();

            var sql = "INSERT INTO Clubs (ClubId, Clubname, name, email, password, createdDate, deletedDate) VALUES (@Id, @Clubname, @Name, @Email, @Password, @CreatedDate, @DeletedDate)";
            var cmd = new SqlCommand(sql, sqlConnection);
            cmd.Parameters.AddWithValue("@Id", Club.ClubId);
            cmd.Parameters.AddWithValue("@Clubname", Club.Clubname);
            cmd.Parameters.AddWithValue("@Name", Club.Name);
            cmd.Parameters.AddWithValue("@Email", Club.Email);
            cmd.Parameters.AddWithValue("@Password", Club.Password);
            cmd.Parameters.AddWithValue("@CreatedDate", Club.CreatedDate ?? (object)DBNull.Value);
            cmd.Parameters.AddWithValue("@DeletedDate", Club.DeletedDate ?? (object)DBNull.Value);
            /* ?? (object)DBNull.Value makes allow nulls by converting DBNull */

            sqlConnection.Open();
            int rowsAffected = cmd.ExecuteNonQuery();
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
        catch (Exception e){
            return StatusCode(StatusCodes.Status500InternalServerError, new ApiResponse(false, "Unable to create the Club. Duplicate Club info are not allowed.", e.Message));
        }
    }

    [HttpDelete("ClubById/{ClubId}")]
    public IActionResult DeleteWithId(int ClubId)
    {
        // Get the underlying SqlConnection object
        SqlConnection sqlConnection = (SqlConnection)_db.Database.GetDbConnection();
        Club? Club = _db.Clubs.FirstOrDefault(u => u.ClubId == ClubId);
        var sql = "DELETE FROM Clubs WHERE ClubId = @Id";
        var cmd = new SqlCommand(sql, sqlConnection);
        cmd.Parameters.AddWithValue("@Id", ClubId);

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

    [HttpDelete("ClubByClubname/{Clubname}")]
    public IActionResult DeleteWithClubname(string Clubname)
    {
        // Get the underlying SqlConnection object
        SqlConnection sqlConnection = (SqlConnection)_db.Database.GetDbConnection();

        var sql = "DELETE FROM Clubs WHERE Clubname = @Clubname";
        var cmd = new SqlCommand(sql, sqlConnection);
        cmd.Parameters.AddWithValue("@Clubname", Clubname);

        sqlConnection.Open();
        int rowsAffected = cmd.ExecuteNonQuery();
        sqlConnection.Close();

        if (rowsAffected > 0)
        {
            return Ok(new ApiResponse(true, "Club deleted successfully.", Clubname));
        }
        else
        {
            return NotFound(new ApiResponse(false, "Club not found.", null));
        }
    }

    [HttpPut("{ClubId}")]
    public IActionResult Update(int ClubId, Club updatedClub)
    {
        // Get the underlying SqlConnection object
        SqlConnection sqlConnection = (SqlConnection)_db.Database.GetDbConnection();

        var sql = "UPDATE Clubs SET Clubname = @Clubname, name = @Name, email = @Email, password = @Password, createdDate = @CreatedDate, deletedDate = @DeletedDate WHERE ClubId = @Id";
        var cmd = new SqlCommand(sql, sqlConnection);
        cmd.Parameters.AddWithValue("@Id", ClubId);
        cmd.Parameters.AddWithValue("@Clubname", updatedClub.Clubname);
        cmd.Parameters.AddWithValue("@Name", updatedClub.Name);
        cmd.Parameters.AddWithValue("@Email", updatedClub.Email);
        cmd.Parameters.AddWithValue("@Password", updatedClub.Password);
        cmd.Parameters.AddWithValue("@CreatedDate", updatedClub.CreatedDate ?? (object)DBNull.Value);
        cmd.Parameters.AddWithValue("@DeletedDate", updatedClub.DeletedDate ?? (object)DBNull.Value);

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
