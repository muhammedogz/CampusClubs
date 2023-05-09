using Microsoft.Data.SqlClient;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using server.Constants;
using Server.Data;
using Server.Models;
using System.Data;
namespace server.Controllers;

[ApiController]
[Route(Consts.DEFAULT_ROUTE)]
public class ClubMemberController : ControllerBase
{
    private readonly ApplicationDbContext _db; // create object of ApplicationDbContext class

    public ClubMemberController(ApplicationDbContext db) // constructor
    {
        _db = db;
    }

    [HttpGet]
    public IActionResult GetAll()
    {   // Return all Club info
        try{
            IEnumerable<ClubMember> clubMemberList = _db.ClubMembers;
            return Ok(new ApiResponse(true, "Club members request is successful", clubMemberList));
        }
        catch (Exception e){
            return StatusCode(StatusCodes.Status500InternalServerError, new ApiResponse(false, "Club request is unsuccessful", e.Message));
        }
    }

    [HttpGet("id")]
    public List<string> GetClubNameByMemberId(int id)
    {   
        // Get the underlying SqlConnection object
        SqlConnection sqlConnection = (SqlConnection)_db.Database.GetDbConnection();

        // get sql connection from appsettings.json
        var sql = "SELECT c.*, m.memberId, m.memberRole FROM Club c JOIN ClubMembers m ON m.clubId =c.clubId AND m.memberId = @Id";
        var cmd = new SqlCommand(sql, sqlConnection);
        cmd.Parameters.AddWithValue("@Id", id);

        sqlConnection.Open();
        var reader = cmd.ExecuteReader();
        List<string> strs = new List<string>();
        while (reader.Read())
        {
            // var clubName = reader["name"].ToString();
            var name = reader.GetString(2);
            // add club name to string
            strs.Add(name);
        }
        
        reader.Close();
        sqlConnection.Close();
        return strs;
    }

    [HttpPost] 
    public IActionResult AddMemberToClub(ClubMember clubMember)
    {
        try{
            // Get the underlying SqlConnection object
            SqlConnection sqlConnection = (SqlConnection)_db.Database.GetDbConnection();
            
            // Convert the list of IDs to a comma-separated string
            var sql = "INSERT INTO ClubMembers (memberId, clubId, memberRole) VALUES (@memberId, @clubId, @memberRole)";
            var cmd = new SqlCommand(sql, sqlConnection);

            // var sql2 = "SELECT c.*, m.memberId, m.memberRole FROM Club c JOIN ClubMembers m ON c.clubId = m.clubId";
            cmd.Parameters.AddWithValue("@memberId", clubMember.memberId);
            cmd.Parameters.AddWithValue("@clubId", clubMember.clubId);
            cmd.Parameters.AddWithValue("@memberRole", clubMember.memberRole);

            sqlConnection.Open();
            int rowsAffected = cmd.ExecuteNonQuery();
            sqlConnection.Close();

            if (rowsAffected > 0)
            {
                return Ok(new ApiResponse(true, "Club created successfully.", clubMember));
            }
            else
            {
                return BadRequest(new ApiResponse(false, "BadRequest: Unable to add to the ClubMember.", null));
            }
        }
        catch (Exception e){
            return StatusCode(StatusCodes.Status500InternalServerError, new ApiResponse(false, "Unable to create the Club. Internal server error occured.", e.Message));
        }
    }
}
