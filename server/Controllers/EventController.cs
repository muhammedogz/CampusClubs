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
public class EventController : ControllerBase
{
    private readonly ApplicationDbContext _db; // create object of ApplicationDbContext class

    public EventController(ApplicationDbContext db) // constructor
    {
        _db = db;
    }

    [HttpGet]
    public IActionResult GetAll()
    {   // Return all Event info
        try{
            IEnumerable<Event> eventList = _db.Event;
            return Ok(new ApiResponse(true, "Event request is successful", eventList));
        }
        catch (Exception e){
            return StatusCode(StatusCodes.Status500InternalServerError, new ApiResponse(false, "Event request is unsuccessful", e.Message));
        }
    }

    [HttpGet("id")]
    public IActionResult GetEventById(int id)
    {   
        /*** returns all info ***/
        Event? Event = _db.Event.SingleOrDefault(u => u.eventId == id);

        if (Event != null)
        {
            return Ok(new ApiResponse(true, "Event request is successfull", Event));
        }

        return NotFound(new ApiResponse(false, "Event request is unsuccessful since Event couldn't be found", null));
    }

    [HttpPost]
    public IActionResult Create(Event Event) 
    {
        try{
            // Get the underlying SqlConnection object
            SqlConnection sqlConnection = (SqlConnection)_db.Database.GetDbConnection();
            
            // Convert the list of IDs to a comma-separated string
            var sql = "INSERT INTO Event (eventId, slug, name, description, image, location, type, date, validFrom, validUntil) VALUES (@Id, @Slug, @Name, @Description, @Image, @Location, @Type, @Date, @ValidFrom, @ValidUntil)";
            var cmd = new SqlCommand(sql, sqlConnection);

            cmd.Parameters.AddWithValue("@Id", Event.eventId);
            cmd.Parameters.AddWithValue("@Name", Event.name);
            cmd.Parameters.AddWithValue("@Slug", Event.slug);
            cmd.Parameters.AddWithValue("@Description", Event.description);
            cmd.Parameters.AddWithValue("@Image", Event.image);
            cmd.Parameters.AddWithValue("@Location", Event.location);
            cmd.Parameters.AddWithValue("@Type", Event.type);
            cmd.Parameters.AddWithValue("@Date", Event.date);
            cmd.Parameters.AddWithValue("@ValidFrom", Event.validFrom ?? (object)DBNull.Value);
            cmd.Parameters.AddWithValue("@ValidUntil", Event.validUntil ?? (object)DBNull.Value);
            /* ?? (object)DBNull.Value makes allow nulls by converting DBNull */

            sqlConnection.Open();
            int rowsAffected = cmd.ExecuteNonQuery();
            sqlConnection.Close();

            if (rowsAffected > 0)
            {
                return Ok(new ApiResponse(true, "Event created successfully.", Event));
            }
            else
            {
                return BadRequest(new ApiResponse(false, "BadRequest: Unable to create the Event.", null));
            }
        }
        catch (Exception e){
            return StatusCode(StatusCodes.Status500InternalServerError, new ApiResponse(false, "Unable to create the Event. Internal server error occured.", e.Message));
        }
    }

    [HttpDelete("id")]
    public IActionResult DeleteWithId(int id) // çç NOT WORKING 
    {
        // Get the underlying SqlConnection object
        SqlConnection sqlConnection = (SqlConnection)_db.Database.GetDbConnection();
        Event? Event = _db.Event.FirstOrDefault(u => u.eventId == id);
        var sql = "DELETE FROM Event WHERE eventId = @Id";
        var cmd = new SqlCommand(sql, sqlConnection);
        cmd.Parameters.AddWithValue("@Id", id);

        sqlConnection.Open();
        int rowsAffected = cmd.ExecuteNonQuery();
        sqlConnection.Close();

        if (rowsAffected > 0)
        {
            return Ok(new ApiResponse(true, "Event deleted successfully.", Event));
        }
        else
        {
            return NotFound(new ApiResponse(false, "Event not found.", null));
        }
    }

    [HttpPut("id")]
    public IActionResult Update(int event_id, Event Event)
    {
        // Get the underlying SqlConnection object
        SqlConnection sqlConnection = (SqlConnection)_db.Database.GetDbConnection();

        var sql = "UPDATE Event SET eventId = @Id, slug = @Slug, name = @Name, description = @Description, image = @Image, location = @Location, type = @Type, date = @Date, validFrom = @ValidFrom, validUntil = @ValidUntil WHERE eventId = @Id";
        var cmd = new SqlCommand(sql, sqlConnection);
        
        cmd.Parameters.AddWithValue("@Id", Event.eventId);
        cmd.Parameters.AddWithValue("@Name", Event.name);
        cmd.Parameters.AddWithValue("@Slug", Event.slug);
        cmd.Parameters.AddWithValue("@Description", Event.description);
        cmd.Parameters.AddWithValue("@Image", Event.image);
        cmd.Parameters.AddWithValue("@Location", Event.location);
        cmd.Parameters.AddWithValue("@Type", Event.type);
        cmd.Parameters.AddWithValue("@Date", Event.date);
        cmd.Parameters.AddWithValue("@ValidFrom", Event.validFrom ?? (object)DBNull.Value);
        cmd.Parameters.AddWithValue("@ValidUntil", Event.validUntil ?? (object)DBNull.Value);

        sqlConnection.Open();
        int rowsAffected = cmd.ExecuteNonQuery();
        sqlConnection.Close();

        if (rowsAffected > 0)
        {
            return Ok(new ApiResponse(true, "Event update request is successful", Event));
        }
        else
        {
            return NotFound(new ApiResponse(false, "Event not found.", null));
        }
    }


}