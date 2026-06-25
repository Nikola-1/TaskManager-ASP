namespace Modules.Interfaces
{
    public interface IAuditService
    {
        Task LogAsync(
            int? userId,
            string action,
            string entityName,
            int entityId
            );
    }
}
