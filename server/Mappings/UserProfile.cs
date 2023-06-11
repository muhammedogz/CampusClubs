using AutoMapper;
using Server.DTOs;
using Server.Models;

public class UserProfile : Profile
{
  public UserProfile()
  {
    CreateMap<User, UserDTO>()
       .ForMember(dest => dest.Department,
                  opt => opt.MapFrom(src => src.Department)); // This will map the Department object.

    CreateMap<Department, DepartmentDTO>(); // Add this line to map Department to DepartmentDTO
    CreateMap<UserCreateDTO, User>();
    CreateMap<UserUpdateDTO, User>();
  }
}