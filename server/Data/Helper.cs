using Microsoft.Data.SqlClient;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using server.Constants;
using Server.Data;
using Server.Models;
namespace Server.Data;

class Helper
{
    public bool checkIsUserSuperAdminFromToken(HttpRequest req, ApplicationDbContext db){
        // Check if the authorization header is present
        if (req.Headers.TryGetValue("Authorization", out var authHeader))
        {
            // Extract the token from the authorization header
            var token = authHeader.ToString().Replace("Bearer ", "");
            Console.WriteLine(token);

            // Token decode      
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
            User? userInfo = db.User.SingleOrDefault(u => u.userId.ToString() == userIdClaim);
            return userInfo != null;
        }   
        return false;
    }

    public List<Announcement> GetAnnouncementsByClubId(SqlConnection connection, int clubId)
    {   
        List<Announcement> announcements = new List<Announcement>();
        
        var sqlQuery = 
            @"SELECT a.* 
            FROM Announcement a 
            INNER JOIN ClubAnnouncements ca ON a.announcementId = ca.announcementId
            INNER JOIN [Club] c ON c.clubId = ca.clubId
            WHERE ca.clubId = @clubId";
        SqlCommand command = new SqlCommand(sqlQuery, connection);
        command.Parameters.AddWithValue("@clubId", clubId);

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
    
        return announcements;        
    }

    public List<Event> GetEventsByClubId(SqlConnection connection, int clubId)
    {   
        List<Event> events = new List<Event>();

        var sqlQuery = 
            @"SELECT a.* 
            FROM Event a 
            INNER JOIN ClubEvents ca ON a.eventId = ca.eventId
            INNER JOIN [Club] c ON c.clubId = ca.clubId
            WHERE ca.clubId = @clubId";
        SqlCommand command = new SqlCommand(sqlQuery, connection);
        command.Parameters.AddWithValue("@clubId", clubId);

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
        return events;        
    }
    
}