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
public class ClubAnnouncementController : ControllerBase
{
    private readonly ApplicationDbContext _db; // create object of ApplicationDbContext class

    public ClubAnnouncementController(ApplicationDbContext db) // constructor
    {
        _db = db;
    }

    [HttpGet]
    public IActionResult GetAll()
    {   // Return all Club info
        try{
            IEnumerable<ClubAnnouncement> ClubAnnouncementList = _db.ClubAnnouncements;
            return Ok(new ApiResponse(true, "Club announcement request is successful", ClubAnnouncementList));
        }
        catch (Exception e){
            return StatusCode(StatusCodes.Status500InternalServerError, new ApiResponse(false, "Club request is unsuccessful", e.Message));
        }
    }

    [HttpGet("announcementId")]
    public List<Club> GetClubByAnnouncementId(int announcementId)
    {   
        List<Club> clubs = new List<Club>();
        using (SqlConnection connection = (SqlConnection)_db.Database.GetDbConnection())
        {
            var sqlQuery = 
                @"SELECT c.* 
                FROM Club c 
                INNER JOIN ClubAnnouncements ca ON c.clubId = ca.clubId
                INNER JOIN [Announcement] a ON a.announcementId = ca.announcementId 
                WHERE a.announcementId = @announcementId";
            SqlCommand command = new SqlCommand(sqlQuery, connection);
            command.Parameters.AddWithValue("@announcementId", announcementId);

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
    public List<Announcement> GetAnnouncementsByClubId(int clubId)
    {   
        List<Announcement> announcements = new List<Announcement>();
        using (SqlConnection connection = (SqlConnection)_db.Database.GetDbConnection())
        {
            var sqlQuery = 
                @"SELECT a.* 
                FROM Announcement a 
                INNER JOIN ClubAnnouncements ca ON a.announcementId = ca.announcementId
                INNER JOIN [Club] c ON c.clubId = ca.clubId
                WHERE ca.clubId = @clubId";
            SqlCommand command = new SqlCommand(sqlQuery, connection);
            command.Parameters.AddWithValue("@clubId", clubId);

            connection.Open();
            SqlDataReader reader = command.ExecuteReader();

            while (reader.Read())
            {
                Announcement announcement = new Announcement
                {
                    announcementId = reader.GetInt32(0),
                    title = reader.GetString(1),
                    description = reader.GetString(2),
                    date = reader.GetDateTime(3),
                    validFrom = reader.IsDBNull(4) ? null : reader.GetDateTime(4),
                    validUntil = reader.IsDBNull(5) ? null : reader.GetDateTime(5)
                };
                announcements.Add(announcement);
            }
            reader.Close();
        }
        return announcements;        
    }

    [HttpPost] 
    public IActionResult AddAnnouncementToClub(ClubAnnouncement ClubAnnouncement)
    {
        try{
            // Get the underlying SqlConnection object
            SqlConnection sqlConnection = (SqlConnection)_db.Database.GetDbConnection();
            
            // Convert the list of IDs to a comma-separated string
            var sql = "INSERT INTO ClubAnnouncements (announcementId, clubId) VALUES (@announcementId, @clubId)";
            var cmd = new SqlCommand(sql, sqlConnection);

            cmd.Parameters.AddWithValue("@announcementId", ClubAnnouncement.announcementId);
            cmd.Parameters.AddWithValue("@clubId", ClubAnnouncement.clubId);

            sqlConnection.Open();
            int rowsAffected = cmd.ExecuteNonQuery();
            sqlConnection.Close();

            if (rowsAffected > 0)
            {
                return Ok(new ApiResponse(true, "Club created successfully.", ClubAnnouncement));
            }
            else
            {
                return BadRequest(new ApiResponse(false, "BadRequest: Unable to add to the ClubAnnouncement.", null));
            }
        }
        catch (Exception e){
            return StatusCode(StatusCodes.Status500InternalServerError, new ApiResponse(false, "Unable to create the Club. Internal server error occured.", e.Message));
        }
    }
}
