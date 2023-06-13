using AutoMapper;
using Server.DTOs;
using Server.Models;

namespace Server.Mappings;

public class ClubProfile : Profile
{
  public ClubProfile()
  {
    CreateMap<Club, ClubDTO>()
        .ForMember(dest => dest.Advisor, opt => opt.MapFrom(src => src.Advisor))
        .ForMember(dest => dest.Events, opt => opt.MapFrom(src => src.Events))
        .ForMember(dest => dest.Announcements, opt => opt.MapFrom(src => src.Announcements))
        .ForMember(dest => dest.Users, opt => opt.MapFrom(src => src.UserClubs.Select(uc => uc.User)))
        .IncludeBase<Club, ClubSummaryDTO>();

    CreateMap<Club, ClubSummaryDTO>();

    CreateMap<ClubDTO, Club>();
    CreateMap<CreateClubDTO, Club>();
  }
}
