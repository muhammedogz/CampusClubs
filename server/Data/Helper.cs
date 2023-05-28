using Microsoft.Data.SqlClient;
using Microsoft.EntityFrameworkCore;
using Server.Models;
namespace Server.Data;

class Helper
{
    
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