using AutoMapper;
using Server.DTOs;
using Server.Models;

public class UserProfile : Profile
{
  public UserProfile()
  {
    CreateMap<User, UserDto>();
  }
}