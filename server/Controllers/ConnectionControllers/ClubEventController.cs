using Microsoft.Data.SqlClient;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using server.Constants;
using Server.Data;
using Server.Models;
using static System.Console;
namespace server.Controllers.ConnectionControllers;

[ApiController]
[Route(Consts.DEFAULT_ROUTE)]
public class ClubEventController : ControllerBase
{
    private readonly ApplicationDbContext _db; // create object of ApplicationDbContext class

    public ClubEventController(ApplicationDbContext db) // constructor
    {
        _db = db;
    }

    [HttpGet]
    public IActionResult GetAll()
    {   // Return all Club info
        try{
            IEnumerable<ClubEvent> ClubEventList = _db.ClubEvents;
            return Ok(new ApiResponse(true, "Club event request is successful", ClubEventList));
        }
        catch (Exception e){
            return StatusCode(StatusCodes.Status500InternalServerError, new ApiResponse(false, "Club request is unsuccessful", e.Message));
        }
    }

    [HttpGet("eventId")]
    public List<Club> GetClubByEventId(int eventId)
    {   
        List<Club> clubs = new List<Club>();
        using (SqlConnection connection = (SqlConnection)_db.Database.GetDbConnection())
        {
            var sqlQuery = 
                @"SELECT c.* 
                FROM Club c 
                INNER JOIN ClubEvents ca ON c.clubId = ca.clubId
                INNER JOIN [Event] a ON a.eventId = ca.eventId 
                WHERE a.eventId = @eventId";
            SqlCommand command = new SqlCommand(sqlQuery, connection);
            command.Parameters.AddWithValue("@eventId", eventId);

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
                    validFrom  = reader.IsDBNull(5) ? null : reader.GetDateTime(5),
                    validUntil = reader.IsDBNull(6) ? null : reader.GetDateTime(6)
                };
                clubs.Add(club);
            }
            reader.Close();
        }
        return clubs;        
    }

    [HttpGet("clubId")]
    public List<Event> GetEventsByClubId(int clubId)
    {   
        List<Event> events = new List<Event>();
        using (SqlConnection connection = (SqlConnection)_db.Database.GetDbConnection())
        {
            var sqlQuery = 
                @"SELECT a.* 
                FROM Event a 
                INNER JOIN ClubEvents ca ON a.eventId = ca.eventId
                INNER JOIN [Club] c ON c.clubId = ca.clubId
                WHERE ca.clubId = @clubId";
            SqlCommand command = new SqlCommand(sqlQuery, connection);
            command.Parameters.AddWithValue("@clubId", clubId);

            connection.Open();
            SqlDataReader reader = command.ExecuteReader();

            while (reader.Read())
            {
                Event Event = new Event
                {
                    eventId = reader.GetInt32(0),
                    slug = reader.GetString(1),
                    name = reader.GetString(2),
                    description = reader.GetString(3),
                    image = reader.GetString(4),
                    location = reader.GetString(5),
                    type = reader.GetString(6),
                    date = reader.GetDateTime(7),
                    validFrom = reader.IsDBNull(8) ? null : reader.GetDateTime(8),
                    validUntil = reader.IsDBNull(9) ? null : reader.GetDateTime(9)
                };
                events.Add(Event);
            }
            reader.Close();
        }
        return events;        
    }

    [HttpPost] 
    public IActionResult AddEventToClub(ClubEvent ClubEvent)
    {
        try{
            // Get the underlying SqlConnection object
            SqlConnection sqlConnection = (SqlConnection)_db.Database.GetDbConnection();
            
            // Convert the list of IDs to a comma-separated string
            var sql = "INSERT INTO ClubEvents (eventId, clubId) VALUES (@eventId, @clubId)";
            var cmd = new SqlCommand(sql, sqlConnection);

            cmd.Parameters.AddWithValue("@eventId", ClubEvent.eventId);
            cmd.Parameters.AddWithValue("@clubId", ClubEvent.clubId);

            sqlConnection.Open();
            int rowsAffected = cmd.ExecuteNonQuery();
            sqlConnection.Close();

            if (rowsAffected > 0)
            {
                return Ok(new ApiResponse(true, "Club created successfully.", ClubEvent));
            }
            else
            {
                return BadRequest(new ApiResponse(false, "BadRequest: Unable to add to the ClubEvent.", null));
            }
        }
        catch (Exception e){
            return StatusCode(StatusCodes.Status500InternalServerError, new ApiResponse(false, "Unable to create the Club. Internal server error occured.", e.Message));
        }
    }
}
