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

    CreateMap<UserEvent, EventSummaryDTO>()
      .ForMember(dest => dest.EventId, opt => opt.MapFrom(src => src.EventId))
      .ForMember(dest => dest.Name, opt => opt.MapFrom(src => src.Event!.Name))
      .ForMember(dest => dest.Description, opt => opt.MapFrom(src => src.Event!.Description))
      .ForMember(dest => dest.Image, opt => opt.MapFrom(src => src.Event!.Image))
      .ForMember(dest => dest.Location, opt => opt.MapFrom(src => src.Event!.Location))
      .ForMember(dest => dest.Type, opt => opt.MapFrom(src => src.Event!.Type))
      .ForMember(dest => dest.ApprovalStatus, opt => opt.MapFrom(src => src.Event!.EventCreateApprovalStatus))
      .ForMember(dest => dest.EventDate, opt => opt.MapFrom(src => src.Event!.EventDate))
      .ForMember(dest => dest.Club, opt => opt.MapFrom(src => src.Event!.Club))
      .ForMember(dest => dest.UserApprovalStatus, opt => opt.MapFrom(src => src.EventJoinApprovalStatus));
  }
}