namespace Server.DTOs;

public class UserCreateDTO
{
  public string? UserName { get; set; }
  public string? FirstName { get; set; }
  public string? LastName { get; set; }
  public string? Email { get; set; }
  public string? Image { get; set; }
  public int? DepartmentId { get; set; }
  public bool IsAdvisor { get; set; }
  public bool IsSuperAdmin { get; set; }
}