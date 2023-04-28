using System.ComponentModel.DataAnnotations;

namespace Server.Models;

public class User
{
    [Key] /* annotation */
    public int UserId { get; set; }

    public string Username { get; set; } = string.Empty;

    [Required] /* annotation */
    public string Name { get; set; } = string.Empty;
    [Display(Name = "The Name")]
    [Range(1, 100, ErrorMessage = "This is a error message for the name")]

    [Required]
    public string Email { get; set; } = string.Empty;

    [Required]
    public string Password { get; set; } = string.Empty;

    public DateTime CreatedDate { get; set; } = DateTime.Now;

    public DateTime DeletedDate { get; set; } = DateTime.Now;

}