using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Server.Models;

public class User
{
    [Key] /* annotation */
    [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
    public int userId { get; set; }

    [Required]
    public string UserName { get; set; } = string.Empty;

    [Required]
    public string firstName { get; set; } = string.Empty;
    [Display(Name = "The Name")]
    // [Range(1, 100, ErrorMessage = "This is a error message for the name")]

    [Required]
    public string lastName { get; set; } = string.Empty;

    [Required]
    public string Email { get; set; } = string.Empty;

    public string? image { get; set; } = string.Empty;
    
    public DateTime? CreatedDate { get; set; }
    
    public DateTime? DeletedDate { get; set; }

    // public DateTime? DeletedDate { get; set; } = DateTime.Now; // the default value above makes not allow to nulls.

    public List<Club> clubsRegistered { get; set; } = new List<Club>();
}