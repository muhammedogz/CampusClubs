using System.ComponentModel.DataAnnotations;

namespace BulkyBookWeb.Models;

public class Category
{
    [Key] /* annotation */
    public int Id { get; set; }

    [Required] /* annotation */
    public string? Name { get; set; }
    [Display(Name = "Display Order")]
    [Range(1, 100, ErrorMessage = "Display order for category must be between 0-100")]

    public int DisplayOrder { get; set; }

    public DateTime CreatedDate { get; set; } = DateTime.Now;

}