using Server.Models;

namespace Server.DTOs;

public class UserSummaryDTO
{
  public int UserId { get; set; }

  public string UserName { get; set; } = null!;

  public string? FirstName { get; set; }

  public string? LastName { get; set; }

  public string Email { get; set; } = null!;

  public DepartmentDTO? Department { get; set; }

  public string? Image { get; set; }

  public UserRole UserRole { get; set; }
  public ClubRole? ClubRole { get; set; }

  public UserApprovalStatus? UserApprovalStatus { get; set; }
}

public class UserDTO : UserSummaryDTO
{
  public List<ClubSummaryDTO> Clubs { get; set; } = new List<ClubSummaryDTO>();
  public List<EventSummaryDTO> Events { get; set; } = new List<EventSummaryDTO>();
}

public class DepartmentDTO
{
  public int DepartmentId { get; set; }
  public string? Name { get; set; }
}

public class UserUpdateDTO
{
  public string? UserName { get; set; }
  public string? FirstName { get; set; }
  public string? LastName { get; set; }
  public string? Email { get; set; }
  public int? DepartmentId { get; set; }
  public string? Image { get; set; }
}

public class UserCreateDTO
{
  public string? UserName { get; set; }
  public string? FirstName { get; set; }
  public string? LastName { get; set; }
  public string? Email { get; set; }
  public string? Image { get; set; }
  public int? DepartmentId { get; set; }
}

public class UserClubDTO
{
  public int UserId { get; set; }
  public int ClubId { get; set; }
  public int RoleId { get; set; }
}