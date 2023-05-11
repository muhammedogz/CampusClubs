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
        /*** only returns Eventname ***/
        // // Get the underlying SqlConnection object
        // SqlConnection sqlConnection = (SqlConnection)_db.Database.GetDbConnection();

        // // get sql connection from appsettings.json
        // var sql = "SELECT * FROM Event WHERE eventId = @Id";
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
        Event? Event = _db.Event.SingleOrDefault(u => u.eventId == id);

        if (Event != null)
        {
            return Ok(new ApiResponse(true, "Event request is successfull", Event));
        }

        return NotFound(new ApiResponse(false, "Event request is unsuccessful since Event couldn't be found", null));
    }

    [HttpGet("name")]
    public IActionResult GetEventByEventname(string name)
    {   
        /*** returns all info ***/
        Event? Event = _db.Event.SingleOrDefault(u => u.name == name);

        if (Event != null)
        {
            return Ok(new ApiResponse(true, "Event request is successful", Event));
        }

        return NotFound(new ApiResponse(false, "Event not found", null));
    }

    // [HttpPost]
    // public IActionResult Create(Event Event)
    // {
    //     try{
    //         // Get the underlying SqlConnection object
    //         SqlConnection sqlConnection = (SqlConnection)_db.Database.GetDbConnection();
    //         List<int> eventIds = new List<int>();
    //         List<int> memberIds = new List<int>();

    //         // Add the IDs of the events and members to the respective lists
    //         // foreach (var ev in Event.Events)
    //         // {
    //         //     eventIds.Add(ev.id);
    //         // }

    //         // foreach (var mem in Event.Members)
    //         // {
    //         //     memberIds.Add(mem.UserId);
    //         // }
            
    //         // Convert the list of IDs to a comma-separated string
    //         // string eventIdsString = string.Join(",", eventIds);
    //         // string memberIdsString = string.Join(",", memberIds);

    //         var sql = "INSERT INTO Event (eventId, slug, name, description, image, members, events, advisor, validFrom, validUntil) VALUES (@Id, @Slug, @Name, @Description, @Image, @Member, @Event, @Advisor, @ValidFrom, @ValidUntil)";
    //         var cmd = new SqlCommand(sql, sqlConnection);
    //         cmd.Parameters.AddWithValue("@Id", Event.eventId);
    //         cmd.Parameters.AddWithValue("@Slug", Event.slug);
    //         cmd.Parameters.AddWithValue("@Name", Event.name);
    //         cmd.Parameters.AddWithValue("@Description", Event.description);
    //         cmd.Parameters.AddWithValue("@Image", Event.image);
    //         cmd.Parameters.AddWithValue("@Member",Event.members.ToArray());
    //         // cmd.Parameters.AddWithValue("@Event", Event.events.ToArray());
    //         cmd.Parameters.AddWithValue("@Event", (object)DBNull.Value);
    //         cmd.Parameters.AddWithValue("@Advisor", Event.advisor);
    //         cmd.Parameters.AddWithValue("@ValidFrom", Event.validFrom ?? (object)DBNull.Value);
    //         cmd.Parameters.AddWithValue("@ValidUntil", Event.validUntil ?? (object)DBNull.Value);
    //         /* ?? (object)DBNull.Value makes allow nulls by converting DBNull */

    //         sqlConnection.Open();
    //         int rowsAffected = cmd.ExecuteNonQuery();
    //         sqlConnection.Close();

    //         if (rowsAffected > 0)
    //         {
    //             return Ok(new ApiResponse(true, "Event created successfully.", Event));
    //         }
    //         else
    //         {
    //             return BadRequest(new ApiResponse(false, "BadRequest: Unable to create the Event.", null));
    //         }
    //     }
    //     catch (Exception e){
    //         return StatusCode(StatusCodes.Status500InternalServerError, new ApiResponse(false, "Unable to create the Event. Internal server error occured.", e.Message));
    //     }
    // }

    
    // [HttpPost] ///////// 2  ///////////////
    // public IActionResult Create(Event Event)
    // {
    //     try{
    //         List<EventMember> members = new List<EventMember>();

    //         // populate the members list...

    //         DataTable table = new DataTable();
    //         table.Columns.Add("memberId", typeof(int));
    //         table.Columns.Add("eventId", typeof(int));
    //         table.Columns.Add("memberRole", typeof(int));

    //         foreach (var member in members)
    //         {
    //             table.Rows.Add(member.memberId, member.eventId, member.memberRole);
    //         }

    //         using (var connection = (SqlConnection)_db.Database.GetDbConnection())
    //         using (var command = new SqlCommand("dbo.InsertEventMembers", connection))
    //         {
    //             SqlParameter parameter = new SqlParameter("@Members", SqlDbType.Structured);
    //             parameter.Value = members.ToDataTable();
    //             parameter.TypeName = "EventMemberType";
    //             command.CommandType = CommandType.StoredProcedure;
    //             command.Parameters.Add(parameter);
                
    //             var sql = "INSERT INTO Event (eventId, slug, name, description, image, members, events, advisor, validFrom, validUntil) VALUES (@Id, @Slug, @Name, @Description, @Image, @Members, @Event, @Advisor, @ValidFrom, @ValidUntil)";
    //             var cmd = new SqlCommand(sql, connection);
    //             cmd.Parameters.AddWithValue("@Id", Event.eventId);
    //             cmd.Parameters.AddWithValue("@Slug", Event.slug);
    //             cmd.Parameters.AddWithValue("@Name", Event.name);
    //             cmd.Parameters.AddWithValue("@Description", Event.description);
    //             cmd.Parameters.AddWithValue("@Image", Event.image);
    //             cmd.Parameters.AddWithValue("@Members", table);

    //             cmd.Parameters.AddWithValue("@Event", (object)DBNull.Value);
    //             cmd.Parameters.AddWithValue("@Advisor", Event.advisor);
    //             cmd.Parameters.AddWithValue("@ValidFrom", Event.validFrom ?? (object)DBNull.Value);
    //             cmd.Parameters.AddWithValue("@ValidUntil", Event.validUntil ?? (object)DBNull.Value);
    //             /* ?? (object)DBNull.Value makes allow nulls by converting DBNull */

    //             connection.Open();
    //             command.ExecuteNonQuery();
    //             int rowsAffected = cmd.ExecuteNonQuery();
    //             connection.Close();

    //             if (rowsAffected > 0)
    //             {
    //                 return Ok(new ApiResponse(true, "Event created successfully.", Event));
    //             }
    //             else
    //             {
    //                 return BadRequest(new ApiResponse(false, "BadRequest: Unable to create the Event.", null));
    //             }
    //         }
    //     }
    //     catch (Exception e){
    //         return StatusCode(StatusCodes.Status500InternalServerError, new ApiResponse(false, "Unable to create the Event. Internal server error occured.", e.Message));
    //     }
    // }

    [HttpPost] ///////// 3 ///////////////
    public IActionResult Create(Event Event) // çç NOT WORKING 
    {
        try{
            // Get the underlying SqlConnection object
            SqlConnection sqlConnection = (SqlConnection)_db.Database.GetDbConnection();
            
            // Convert the list of IDs to a comma-separated string
            var sql = "INSERT INTO Event (eventId, slug, name, description, image, location, type, date validFrom, validUntil) VALUES (@Id, @Slug, @Name, @Description, @Image, @Location, @Type, @Date, @ValidFrom, @ValidUntil)";
            var cmd = new SqlCommand(sql, sqlConnection);

            // var sql2 = "SELECT c.*, m.memberId, m.memberRole FROM Event c JOIN EventMembers m ON c.eventId = m.eventId";
            // var cmd2 = new SqlCommand(sql2, sqlConnection);
            // cmd2.Parameters.AddWithValue("@Members", Event.members);

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
            // int rowsAffected2 = cmd2.ExecuteNonQuery();
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
    public IActionResult DeleteWithId(int id)
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

    [HttpDelete("name")]
    public IActionResult DeleteWithEventname(string Eventname)
    {
        // Get the underlying SqlConnection object
        SqlConnection sqlConnection = (SqlConnection)_db.Database.GetDbConnection();

        var sql = "DELETE FROM Event WHERE name = @Eventname";
        var cmd = new SqlCommand(sql, sqlConnection);
        cmd.Parameters.AddWithValue("@Eventname", Eventname);

        sqlConnection.Open();
        int rowsAffected = cmd.ExecuteNonQuery();
        sqlConnection.Close();

        if (rowsAffected > 0)
        {
            return Ok(new ApiResponse(true, "Event deleted successfully.", Eventname));
        }
        else
        {
            return NotFound(new ApiResponse(false, "Event not found.", null));
        }
    }

    // [HttpPut("{event_id}")]
    // public IActionResult Update(int event_id, Event updatedEvent)
    // {
    //     // Get the underlying SqlConnection object
    //     SqlConnection sqlConnection = (SqlConnection)_db.Database.GetDbConnection();

    //     var sql = "UPDATE Event SET Eventname = @Eventname, name = @Name, email = @Email, password = @Password, createdDate = @CreatedDate, deletedDate = @DeletedDate WHERE event_id = @Id";
    //     var cmd = new SqlCommand(sql, sqlConnection);
    //     cmd.Parameters.AddWithValue("@Id", event_id);
    //     cmd.Parameters.AddWithValue("@Slug", updatedEvent.slug);
    //     cmd.Parameters.AddWithValue("@Eventname", updatedEvent.name);
    //     cmd.Parameters.AddWithValue("@Description", updatedEvent.description);
    //     cmd.Parameters.AddWithValue("@Image", updatedEvent.image);
    //     cmd.Parameters.AddWithValue("@Member", updatedEvent.members);
    //     // cmd.Parameters.AddWithValue("@Event", updatedEvent.events);
    //     cmd.Parameters.AddWithValue("@ValidFrom", updatedEvent.validFrom ?? (object)DBNull.Value);
    //     cmd.Parameters.AddWithValue("@ValidUntil", updatedEvent.validUntil ?? (object)DBNull.Value);
    

    //     sqlConnection.Open();
    //     int rowsAffected = cmd.ExecuteNonQuery();
    //     sqlConnection.Close();

    //     if (rowsAffected > 0)
    //     {
    //         return Ok(new ApiResponse(true, "Event request is successful", updatedEvent));
    //     }
    //     else
    //     {
    //         return NotFound(new ApiResponse(false, "Event not found.", null));
    //     }
    // }


}