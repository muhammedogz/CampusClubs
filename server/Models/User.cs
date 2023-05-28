using System.ComponentModel.DataAnnotations;

namespace Server.Models;

public class User
{
    [Key] /* annotation */
    public int userId { get; set; }

    [Required]
    public string Username { get; set; } = string.Empty;

    [Required]
    public string Name { get; set; } = string.Empty;
    [Display(Name = "The Name")]
    // [Range(1, 100, ErrorMessage = "This is a error message for the name")]

    [Required]
    public string Email { get; set; } = string.Empty;

    [Required]
    public string Password { get; set; } = string.Empty;

    // public DateTime? CreatedDate { get; set; } = DateTime.Now;
    // the default value above makes not allow to nulls.
    public DateTime? CreatedDate { get; set; }
    
    // public DateTime? DeletedDate { get; set; } = DateTime.Now;
    public DateTime? DeletedDate { get; set; }

    public List<Club> clubsRegistered { get; set; } = new List<Club>();
}