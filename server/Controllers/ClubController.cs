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
    private Helper helper = new Helper();

    public ClubController(ApplicationDbContext db) // constructor
    {
        _db = db;
    }

    [HttpGet]
    public IActionResult GetAll()
    {   
        try{
            using (SqlConnection connection = (SqlConnection)_db.Database.GetDbConnection())
            {
                string query = "SELECT c.* FROM Club c";
                SqlCommand command = new SqlCommand(query, connection);

                connection.Open();
                SqlDataReader reader = command.ExecuteReader();
                
                List<Club> clubs = new List<Club>();
                while (reader.Read())
                {
                    Club club = new Club
                    {
                        clubId = reader.GetInt32(0),
                        slug = reader.GetString(1),
                        name = reader.GetString(2),
                        description = reader.GetString(3),
                        image = reader.GetString(4),
                        announcements = helper.GetAnnouncementsByClubId(connection, reader.GetInt32(0)),
                        validFrom = reader.IsDBNull(5) ? null : reader.GetDateTime(5),
                        validUntil = reader.IsDBNull(6) ? null : reader.GetDateTime(6)
                    };
                    clubs.Add(club);
                }
                return Ok(new ApiResponse(true, "Club request is successful.", clubs));
            }
        }
        catch{
            return NotFound(new ApiResponse(false, "Club request is unsuccessful since Club couldn't be found", null));
        }
        // Return all Club info - THIS THROWS ERROR
        // try{
        //     IEnumerable<Club> clubList = _db.Club;
        //     return Ok(new ApiResponse(true, "Club request is successful", clubList));
        // }
        // catch (Exception e){
        //     return StatusCode(StatusCodes.Status500InternalServerError, new ApiResponse(false, "Club request is unsuccessful", e.Message));
        // }
    }

    [HttpGet("id")]
    public IActionResult GetClubById(int id)
    {   
        using (SqlConnection connection = (SqlConnection)_db.Database.GetDbConnection())
        {
            string query = "SELECT * FROM Club WHERE clubId = @clubId";
            SqlCommand command = new SqlCommand(query, connection);
            command.Parameters.AddWithValue("@clubId", id);

            connection.Open();
            SqlDataReader reader = command.ExecuteReader();

            if (reader.Read())
            {
                Club club = new Club
                {
                    clubId = reader.GetInt32(0),
                    slug = reader.GetString(1),
                    name = reader.GetString(2),
                    description = reader.GetString(3),
                    image = reader.GetString(4),
                    announcements = helper.GetAnnouncementsByClubId(connection, id),
                    validFrom = reader.IsDBNull(5) ? null : reader.GetDateTime(5),
                    validUntil = reader.IsDBNull(6) ? null : reader.GetDateTime(6)
                };
                reader.Close();
                return Ok(new ApiResponse(true, "Club request is successful.", club));
            }
        }
        return NotFound(new ApiResponse(false, "Club request is unsuccessful since Club couldn't be found", null));

        /*** it gives error of "userId", but I couldn't solve the problem ***/
        // Club? Club = _db.Club.SingleOrDefault(u => u.clubId == id);

        // if (Club != null)
        // {
        //     return Ok(new ApiResponse(true, "Club request is successfull", Club));
        // }

        // return NotFound(new ApiResponse(false, "Club request is unsuccessful since Club couldn't be found", null));
    }

    [HttpGet("name")]
    public IActionResult GetClubByClubname(string name)
    {   
        using (SqlConnection connection = (SqlConnection)_db.Database.GetDbConnection())
        {
            string query = "SELECT * FROM Club WHERE name = @Name";
            SqlCommand command = new SqlCommand(query, connection);
            command.Parameters.AddWithValue("@Name", name);

            connection.Open();
            SqlDataReader reader = command.ExecuteReader();

            if (reader.Read())
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
                reader.Close();
                return Ok(new ApiResponse(true, "Club request is successful.", club));
            }
        }
        return NotFound(new ApiResponse(false, "Club request is unsuccessful since Club couldn't be found", null));

    }

    // [HttpPost]
    // public IActionResult Create(Club Club)
    // {
    //     try{
    //         // Get the underlying SqlConnection object
    //         SqlConnection sqlConnection = (SqlConnection)_db.Database.GetDbConnection();
    //         List<int> eventIds = new List<int>();
    //         List<int> memberIds = new List<int>();

    //         // Add the IDs of the events and members to the respective lists
    //         // foreach (var ev in Club.Events)
    //         // {
    //         //     eventIds.Add(ev.id);
    //         // }

    //         // foreach (var mem in Club.Members)
    //         // {
    //         //     memberIds.Add(mem.UserId);
    //         // }
            
    //         // Convert the list of IDs to a comma-separated string
    //         // string eventIdsString = string.Join(",", eventIds);
    //         // string memberIdsString = string.Join(",", memberIds);

    //         var sql = "INSERT INTO Club (clubId, slug, name, description, image, members, events, advisor, validFrom, validUntil) VALUES (@Id, @Slug, @Name, @Description, @Image, @Member, @Event, @Advisor, @ValidFrom, @ValidUntil)";
    //         var cmd = new SqlCommand(sql, sqlConnection);
    //         cmd.Parameters.AddWithValue("@Id", Club.clubId);
    //         cmd.Parameters.AddWithValue("@Slug", Club.slug);
    //         cmd.Parameters.AddWithValue("@Name", Club.name);
    //         cmd.Parameters.AddWithValue("@Description", Club.description);
    //         cmd.Parameters.AddWithValue("@Image", Club.image);
    //         cmd.Parameters.AddWithValue("@Member",Club.members.ToArray());
    //         // cmd.Parameters.AddWithValue("@Event", Club.events.ToArray());
    //         cmd.Parameters.AddWithValue("@Event", (object)DBNull.Value);
    //         cmd.Parameters.AddWithValue("@Advisor", Club.advisor);
    //         cmd.Parameters.AddWithValue("@ValidFrom", Club.validFrom ?? (object)DBNull.Value);
    //         cmd.Parameters.AddWithValue("@ValidUntil", Club.validUntil ?? (object)DBNull.Value);
    //         /* ?? (object)DBNull.Value makes allow nulls by converting DBNull */

    //         sqlConnection.Open();
    //         int rowsAffected = cmd.ExecuteNonQuery();
    //         sqlConnection.Close();

    //         if (rowsAffected > 0)
    //         {
    //             return Ok(new ApiResponse(true, "Club created successfully.", Club));
    //         }
    //         else
    //         {
    //             return BadRequest(new ApiResponse(false, "BadRequest: Unable to create the Club.", null));
    //         }
    //     }
    //     catch (Exception e){
    //         return StatusCode(StatusCodes.Status500InternalServerError, new ApiResponse(false, "Unable to create the Club. Internal server error occured.", e.Message));
    //     }
    // }

    
    // [HttpPost] ///////// 2  ///////////////
    // public IActionResult Create(Club Club)
    // {
    //     try{
    //         List<ClubMember> members = new List<ClubMember>();

    //         // populate the members list...

    //         DataTable table = new DataTable();
    //         table.Columns.Add("memberId", typeof(int));
    //         table.Columns.Add("clubId", typeof(int));
    //         table.Columns.Add("memberRole", typeof(int));

    //         foreach (var member in members)
    //         {
    //             table.Rows.Add(member.memberId, member.clubId, member.memberRole);
    //         }

    //         using (var connection = (SqlConnection)_db.Database.GetDbConnection())
    //         using (var command = new SqlCommand("dbo.InsertClubMembers", connection))
    //         {
    //             SqlParameter parameter = new SqlParameter("@Members", SqlDbType.Structured);
    //             parameter.Value = members.ToDataTable();
    //             parameter.TypeName = "ClubMemberType";
    //             command.CommandType = CommandType.StoredProcedure;
    //             command.Parameters.Add(parameter);
                
    //             var sql = "INSERT INTO Club (clubId, slug, name, description, image, members, events, advisor, validFrom, validUntil) VALUES (@Id, @Slug, @Name, @Description, @Image, @Members, @Event, @Advisor, @ValidFrom, @ValidUntil)";
    //             var cmd = new SqlCommand(sql, connection);
    //             cmd.Parameters.AddWithValue("@Id", Club.clubId);
    //             cmd.Parameters.AddWithValue("@Slug", Club.slug);
    //             cmd.Parameters.AddWithValue("@Name", Club.name);
    //             cmd.Parameters.AddWithValue("@Description", Club.description);
    //             cmd.Parameters.AddWithValue("@Image", Club.image);
    //             cmd.Parameters.AddWithValue("@Members", table);

    //             cmd.Parameters.AddWithValue("@Event", (object)DBNull.Value);
    //             cmd.Parameters.AddWithValue("@Advisor", Club.advisor);
    //             cmd.Parameters.AddWithValue("@ValidFrom", Club.validFrom ?? (object)DBNull.Value);
    //             cmd.Parameters.AddWithValue("@ValidUntil", Club.validUntil ?? (object)DBNull.Value);
    //             /* ?? (object)DBNull.Value makes allow nulls by converting DBNull */

    //             connection.Open();
    //             command.ExecuteNonQuery();
    //             int rowsAffected = cmd.ExecuteNonQuery();
    //             connection.Close();

    //             if (rowsAffected > 0)
    //             {
    //                 return Ok(new ApiResponse(true, "Club created successfully.", Club));
    //             }
    //             else
    //             {
    //                 return BadRequest(new ApiResponse(false, "BadRequest: Unable to create the Club.", null));
    //             }
    //         }
    //     }
    //     catch (Exception e){
    //         return StatusCode(StatusCodes.Status500InternalServerError, new ApiResponse(false, "Unable to create the Club. Internal server error occured.", e.Message));
    //     }
    // }

    [HttpPost] ///////// 3 ///////////////
    public IActionResult Create(Club Club)
    {
        try{
            // Get the underlying SqlConnection object
            SqlConnection sqlConnection = (SqlConnection)_db.Database.GetDbConnection();
            
            // Convert the list of IDs to a comma-separated string
            var sql = "INSERT INTO Club (clubId, slug, name, description, image, members, advisor, validFrom, validUntil) VALUES (@Id, @Slug, @Name, @Description, @Image, @Members, @Advisor, @ValidFrom, @ValidUntil)";
            var cmd = new SqlCommand(sql, sqlConnection);
            cmd.Parameters.AddWithValue("@Id", Club.clubId);
            cmd.Parameters.AddWithValue("@Slug", Club.slug);
            cmd.Parameters.AddWithValue("@Name", Club.name);
            cmd.Parameters.AddWithValue("@Description", Club.description);
            cmd.Parameters.AddWithValue("@Image", Club.image);
            
            cmd.Parameters.AddWithValue("@Members", (object)DBNull.Value);
            // cmd.Parameters.AddWithValue("@Advisor", Club.advisor);
            cmd.Parameters.AddWithValue("@Advisor", (object)DBNull.Value);

            cmd.Parameters.AddWithValue("@ValidFrom", Club.validFrom ?? (object)DBNull.Value);
            cmd.Parameters.AddWithValue("@ValidUntil", Club.validUntil ?? (object)DBNull.Value);
            /* ?? (object)DBNull.Value makes allow nulls by converting DBNull */

            sqlConnection.Open();
            int rowsAffected = cmd.ExecuteNonQuery();
            // var sql2 = "SELECT c.*, m.memberId, m.memberRole FROM Club c JOIN ClubMembers m ON c.clubId = m.clubId";
            // var cmd2 = new SqlCommand(sql2, sqlConnection);
            // cmd2.Parameters.AddWithValue("@Members", Club.members);
            // int rowsAffected2 = cmd2.ExecuteNonQuery();
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
            return StatusCode(StatusCodes.Status500InternalServerError, new ApiResponse(false, "Unable to create the Club. Internal server error occured.", e.Message));
        }
    }

    [HttpDelete("id")]
    public IActionResult DeleteWithId(int id)
    {
        // Get the underlying SqlConnection object
        SqlConnection sqlConnection = (SqlConnection)_db.Database.GetDbConnection();
        Club? Club = _db.Club.FirstOrDefault(u => u.clubId == id);
        var sql = "DELETE FROM Club WHERE clubId = @Id";
        var cmd = new SqlCommand(sql, sqlConnection);
        cmd.Parameters.AddWithValue("@Id", id);

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

    [HttpDelete("name")]
    public IActionResult DeleteWithClubname(string Clubname)
    {
        // Get the underlying SqlConnection object
        SqlConnection sqlConnection = (SqlConnection)_db.Database.GetDbConnection();

        var sql = "DELETE FROM Club WHERE name = @Clubname";
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

    [HttpPut("{club_id}")]
    public IActionResult Update(int club_id, Club updatedClub)
    {
        // Get the underlying SqlConnection object
        SqlConnection sqlConnection = (SqlConnection)_db.Database.GetDbConnection();

        var sql = "UPDATE Club SET Clubname = @Clubname, name = @Name, email = @Email, password = @Password, createdDate = @CreatedDate, deletedDate = @DeletedDate WHERE club_id = @Id";
        var cmd = new SqlCommand(sql, sqlConnection);
        cmd.Parameters.AddWithValue("@Id", club_id);
        cmd.Parameters.AddWithValue("@Slug", updatedClub.slug);
        cmd.Parameters.AddWithValue("@Clubname", updatedClub.name);
        cmd.Parameters.AddWithValue("@Description", updatedClub.description);
        cmd.Parameters.AddWithValue("@Image", updatedClub.image);
        // cmd.Parameters.AddWithValue("@Member", updatedClub.members);
        // cmd.Parameters.AddWithValue("@Event", updatedClub.events);
        cmd.Parameters.AddWithValue("@ValidFrom", updatedClub.validFrom ?? (object)DBNull.Value);
        cmd.Parameters.AddWithValue("@ValidUntil", updatedClub.validUntil ?? (object)DBNull.Value);
    
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

/** SQL COMMAND
    CREATE TYPE dbo.ClubMemberType AS TABLE
    (
        memberId INT NOT NULL,
        clubId INT NOT NULL,
        memberRole INT NOT NULL
    );

    CREATE PROCEDURE dbo.InsertClubMembers
    (
        @members dbo.ClubMemberType READONLY
    )
    AS
    BEGIN
        INSERT INTO dbo.ClubMembers (memberId, clubId, memberRole)
        SELECT memberId, clubId, memberRole
        FROM @members
    END
*/
