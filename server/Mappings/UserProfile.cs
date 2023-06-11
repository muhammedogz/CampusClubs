using AutoMapper;
using Server.DTOs;
using Server.Models;

public class UserProfile : Profile
{
  public UserProfile()
  {
    CreateMap<User, UserDTO>()
        .ForMember(dest => dest.Department, opt => opt.MapFrom(src => src.Department))
        .ForMember(dest => dest.Clubs, opt => opt.MapFrom(src => src.UserClubs.Select(uc => uc.Club)))
        .IncludeBase<User, UserSummaryDTO>(); // Add this line

    CreateMap<User, UserSummaryDTO>()
        .ForMember(dest => dest.Department, opt => opt.MapFrom(src => src.Department));

    CreateMap<Department, DepartmentDTO>();
    CreateMap<UserCreateDTO, User>();
    CreateMap<UserUpdateDTO, User>();
    CreateMap<UserClub, UserClubDTO>();
  }
}