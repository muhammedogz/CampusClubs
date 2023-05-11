using Microsoft.Data.SqlClient;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using server.Constants;
using Server.Data;
using Server.Models;
using System.Data;
using System.ComponentModel;

namespace server.Controllers;

[ApiController]
[Route(Consts.DEFAULT_ROUTE)]
public class AnnouncementController : ControllerBase
{
    private readonly ApplicationDbContext _db; // create object of ApplicationDbContext class

    public AnnouncementController(ApplicationDbContext db) // constructor
    {
        _db = db;
    }

    [HttpGet]
    public IActionResult GetAll()
    {   // Return all Announcement info
        try{
            IEnumerable<Announcement> announcementList = _db.Announcement;
            return Ok(new ApiResponse(true, "Announcement request is successful", announcementList));
        }
        catch (Exception e){
            return StatusCode(StatusCodes.Status500InternalServerError, new ApiResponse(false, "Announcement request is unsuccessful", e.Message));
        }
    }

    [HttpGet("id")]
    public IActionResult GetAnnouncementById(int id)
    {   
        /*** returns all info ***/
        Announcement? Announcement = _db.Announcement.SingleOrDefault(u => u.announcementId == id);

        if (Announcement != null)
        {
            return Ok(new ApiResponse(true, "Announcement request is successfull", Announcement));
        }

        return NotFound(new ApiResponse(false, "Announcement request is unsuccessful since Announcement couldn't be found", null));
    }

    [HttpGet("name")]
    public IActionResult GetAnnouncementByAnnouncementname(string name)
    {   
        /*** returns all info ***/
        Announcement? Announcement = _db.Announcement.SingleOrDefault(u => u.title == name);

        if (Announcement != null)
        {
            return Ok(new ApiResponse(true, "Announcement request is successful", Announcement));
        }

        return NotFound(new ApiResponse(false, "Announcement not found", null));
    }


    [HttpPost]
    public IActionResult Create(Announcement Announcement) 
    {
        try{
            // Get the underlying SqlConnection object
            SqlConnection sqlConnection = (SqlConnection)_db.Database.GetDbConnection();
            
            // Convert the list of IDs to a comma-separated string
            var sql = "INSERT INTO Announcement (announcementId, title, description, date, validFrom, validUntil) VALUES (@Id, @Title, @Description, @Date, @ValidFrom, @ValidUntil)";
            var cmd = new SqlCommand(sql, sqlConnection);

            cmd.Parameters.AddWithValue("@Id", Announcement.announcementId);
            cmd.Parameters.AddWithValue("@Title", Announcement.title);
            cmd.Parameters.AddWithValue("@Description", Announcement.description);
            cmd.Parameters.AddWithValue("@Date", Announcement.date);
            cmd.Parameters.AddWithValue("@ValidFrom", Announcement.validFrom ?? (object)DBNull.Value);
            cmd.Parameters.AddWithValue("@ValidUntil", Announcement.validUntil ?? (object)DBNull.Value);

            /* ?? (object)DBNull.Value makes allow nulls by converting DBNull */

            sqlConnection.Open();
            int rowsAffected = cmd.ExecuteNonQuery();
            sqlConnection.Close();

            if (rowsAffected > 0)
            {
                return Ok(new ApiResponse(true, "Announcement created successfully.", Announcement));
            }
            else
            {
                return BadRequest(new ApiResponse(false, "BadRequest: Unable to create the Announcement.", null));
            }
        }
        catch (Exception e){
            return StatusCode(StatusCodes.Status500InternalServerError, new ApiResponse(false, "Unable to create the Announcement. Internal server error occured.", e.Message));
        }
    }

    [HttpDelete("id")]
    public IActionResult DeleteWithId(int id) // çç NOT WORKING 
    {
        // Get the underlying SqlConnection object
        SqlConnection sqlConnection = (SqlConnection)_db.Database.GetDbConnection();
        Announcement? Announcement = _db.Announcement.FirstOrDefault(u => u.announcementId == id);
        var sql = "DELETE FROM Announcement WHERE announcementId = @Id";
        var cmd = new SqlCommand(sql, sqlConnection);
        cmd.Parameters.AddWithValue("@Id", id);

        sqlConnection.Open();
        int rowsAffected = cmd.ExecuteNonQuery();
        sqlConnection.Close();

        if (rowsAffected > 0)
        {
            return Ok(new ApiResponse(true, "Announcement deleted successfully.", Announcement));
        }
        else
        {
            return NotFound(new ApiResponse(false, "Announcement not found.", null));
        }
    }

    [HttpDelete("name")]
    public IActionResult DeleteWithAnnouncementname(string Announcementname)
    {
        // Get the underlying SqlConnection object
        SqlConnection sqlConnection = (SqlConnection)_db.Database.GetDbConnection();

        var sql = "DELETE FROM Announcement WHERE title = @Announcementname";
        var cmd = new SqlCommand(sql, sqlConnection);
        cmd.Parameters.AddWithValue("@Announcementname", Announcementname);

        sqlConnection.Open();
        int rowsAffected = cmd.ExecuteNonQuery();
        sqlConnection.Close();

        if (rowsAffected > 0)
        {
            return Ok(new ApiResponse(true, "Announcement deleted successfully.", Announcementname));
        }
        else
        {
            return NotFound(new ApiResponse(false, "Announcement not found.", null));
        }
    }

    [HttpPut("id")]
    public IActionResult Update(int announcement_id, Announcement Announcement)
    {
        // Get the underlying SqlConnection object
        SqlConnection sqlConnection = (SqlConnection)_db.Database.GetDbConnection();

        var sql = "UPDATE Announcement SET announcementId = @Id, title = @Title, description = @Description, date = @Date, validFrom = @ValidFrom, validUntil = @ValidUntil WHERE announcementId = @Id";
        var cmd = new SqlCommand(sql, sqlConnection);
        
        cmd.Parameters.AddWithValue("@Id", Announcement.announcementId);
        cmd.Parameters.AddWithValue("@Title", Announcement.title);
        cmd.Parameters.AddWithValue("@Description", Announcement.description);
        cmd.Parameters.AddWithValue("@Date", Announcement.date);
        cmd.Parameters.AddWithValue("@ValidFrom", Announcement.validFrom ?? (object)DBNull.Value);
        cmd.Parameters.AddWithValue("@ValidUntil", Announcement.validUntil ?? (object)DBNull.Value);

        sqlConnection.Open();
        int rowsAffected = cmd.ExecuteNonQuery();
        sqlConnection.Close();

        if (rowsAffected > 0)
        {
            return Ok(new ApiResponse(true, "Announcement update request is successful", Announcement));
        }
        else
        {
            return NotFound(new ApiResponse(false, "Announcement not found.", null));
        }
    }


}