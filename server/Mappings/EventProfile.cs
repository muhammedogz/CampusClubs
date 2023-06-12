using AutoMapper;
using Server.DTOs;
using Server.Models;

namespace Server.Mappings;

public class EventProfile : Profile
{
  public EventProfile()
  {
    CreateMap<Event, EventDTO>()
        .ForMember(dest => dest.Club,
                    opt => opt.MapFrom(src => src.Club))
        .ForMember(dest => dest.Users,
                    opt => opt.MapFrom(src => src.UserEvents.Select(ue => ue.User)));

    CreateMap<Event, EventSummaryDTO>()
        .ForMember(dest => dest.Club,
                    opt => opt.MapFrom(src => src.Club));

    CreateMap<EventCreateDTO, Event>();
    CreateMap<EventUpdateDTO, Event>();
  }
}