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
        .ForMember(dest => dest.Events, opt => opt.MapFrom(src => src.UserEvents.Select(ue => ue.Event)))
        .IncludeBase<User, UserSummaryDTO>();

    CreateMap<User, UserSummaryDTO>()
        .ForMember(dest => dest.Department, opt => opt.MapFrom(src => src.Department));

    CreateMap<Department, DepartmentDTO>();
    CreateMap<UserCreateDTO, User>();
    CreateMap<UserUpdateDTO, User>();

    CreateMap<UserClub, UserClubDTO>();

    CreateMap<UserClub, UserSummaryDTO>()
        .ForMember(dest => dest.ClubRole, opt => opt.MapFrom(src => src.ClubRole))
        .ForMember(dest => dest.UserId, opt => opt.MapFrom(src => src.User!.UserId))
        .ForMember(dest => dest.UserName, opt => opt.MapFrom(src => src.User!.UserName))
        .ForMember(dest => dest.FirstName, opt => opt.MapFrom(src => src.User!.FirstName))
        .ForMember(dest => dest.LastName, opt => opt.MapFrom(src => src.User!.LastName))
        .ForMember(dest => dest.Email, opt => opt.MapFrom(src => src.User!.Email))
        .ForMember(dest => dest.Department, opt => opt.MapFrom(src => src.User!.Department))
        .ForMember(dest => dest.Image, opt => opt.MapFrom(src => src.User!.Image))
        .ForMember(dest => dest.UserRole, opt => opt.MapFrom(src => src.User!.UserRole));

    CreateMap<UserEvent, UserSummaryDTO>()
        .ForMember(dest => dest.UserApprovalStatus, opt => opt.MapFrom(src => src.ApprovalStatus))
        .ForMember(dest => dest.UserId, opt => opt.MapFrom(src => src.User!.UserId))
        .ForMember(dest => dest.UserName, opt => opt.MapFrom(src => src.User!.UserName))
        .ForMember(dest => dest.FirstName, opt => opt.MapFrom(src => src.User!.FirstName))
        .ForMember(dest => dest.LastName, opt => opt.MapFrom(src => src.User!.LastName))
        .ForMember(dest => dest.Email, opt => opt.MapFrom(src => src.User!.Email))
        .ForMember(dest => dest.Department, opt => opt.MapFrom(src => src.User!.Department))
        .ForMember(dest => dest.Image, opt => opt.MapFrom(src => src.User!.Image))
        .ForMember(dest => dest.UserRole, opt => opt.MapFrom(src => src.User!.UserRole));
  }
}