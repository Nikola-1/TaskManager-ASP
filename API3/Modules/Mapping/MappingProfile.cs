using Modules.DTO;
using API3.DTO.Comments;
using Modules.DTO.Files;
using Domains.Entities;
using AutoMapper;

namespace Modules.Mapping
{
    public class MappingProfile : Profile
    {
        public MappingProfile() 
        {
            CreateMap<TaskItem, TaskResponseDTO>()
            .ForMember(dest => dest.AssignedUsername,
            opt => opt.MapFrom(src => src.user != null ? src.user.Username : null));

            CreateMap<TaskComment, CommentResponseDTO>()
                .ForMember(dest => dest.UserName,
                            opt => opt.MapFrom(src => src.User.Username));
            CreateMap<Attachment, AttachmentResponseDTO>();
        }
    }
}
