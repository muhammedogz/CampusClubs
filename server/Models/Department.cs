using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Server.Models;

public class Department
{
  [Key]
  [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
  public int DepartmentId { get; set; }

  [Required]
  public string? Name { get; set; }
}