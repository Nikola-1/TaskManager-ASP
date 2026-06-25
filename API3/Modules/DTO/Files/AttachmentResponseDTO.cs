namespace Modules.DTO.Files
{
    public class AttachmentResponseDTO
    {
        public int Id { get; set; }
        public string FileName { get; set; } = null!;
        public string FilePath { get; set; } = null!;
        public int TaskItemId { get; set; }
        public DateTime CreatedAt  { get; set; }


    }
}
