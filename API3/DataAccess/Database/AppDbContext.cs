using Domains.Entities;
using Microsoft.EntityFrameworkCore;

namespace DataAccess.Database
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> dbContextOptions) : base(dbContextOptions)
        {

        }
        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);


            modelBuilder.Entity<Category>().Property(x => x.group_id).HasDefaultValue(null);
            modelBuilder.Entity<Category>().Property(x=>x.sticker_id).HasDefaultValue(null);

            #region Tag

            modelBuilder.Entity<Tag>().HasOne(x=>x.Group).WithMany().HasForeignKey(x=>x.group_id).OnDelete(DeleteBehavior.NoAction);
            modelBuilder.Entity<Tag>().HasOne(x => x.User).WithMany().HasForeignKey(x => x.User_id).OnDelete(DeleteBehavior.NoAction);
            

            modelBuilder.Entity<TagTasks>().HasOne(x => x.Task).WithMany().HasForeignKey(x => x.id_task).OnDelete(DeleteBehavior.Cascade);
            modelBuilder.Entity<TagTasks>().HasOne(x => x.Tag).WithMany().HasForeignKey(x => x.id_tag).OnDelete(DeleteBehavior.Cascade);
            #endregion
            #region Group
            modelBuilder.Entity<Group>()
    .HasOne(x => x.Owner)
    .WithMany()
    .HasForeignKey(x => x.OwnerId)
    .OnDelete(DeleteBehavior.NoAction);
            #endregion

            #region TaskItem

            modelBuilder.Entity<TaskItem>().HasOne(x=>x.category).WithMany().HasForeignKey(x=>x.category_id).OnDelete(DeleteBehavior.NoAction);
            modelBuilder.Entity<TaskItem>().HasOne(x => x.user).WithMany(x=>x.Tasks).HasForeignKey(x => x.user_id).OnDelete(DeleteBehavior.NoAction);
            modelBuilder.Entity<TaskItem>().HasOne(x => x.group).WithMany(x=>x.Tasks).HasForeignKey(x => x.group_id).OnDelete(DeleteBehavior.Cascade);


            #endregion
            #region UsersGroups
            modelBuilder.Entity<UsersGroups>().HasOne(x => x.Group).WithMany().HasForeignKey(x => x.id_group).OnDelete(DeleteBehavior.Cascade);
            modelBuilder.Entity<UsersGroups>().HasOne(x => x.Role).WithMany().HasForeignKey(x => x.id_role).OnDelete(DeleteBehavior.NoAction);
            modelBuilder.Entity<UsersGroups>().HasOne(x=>x.User).WithMany().HasForeignKey(x=>x.id_user).OnDelete(DeleteBehavior.Cascade);
            #endregion
        }

        public DbSet<User> Users { get; set; }
        public DbSet<Role> Roles { get; set; }
        public DbSet<Category> Categories { get; set; }
        public DbSet<Sticker> Stickers { get; set; }
        public DbSet<TaskItem> Tasks { get; set; }
        public DbSet<TaskComment> TaskComments { get; set; }
        public DbSet<Attachment> Attachments { get; set; }
        public DbSet<AuditLog> AuditLogs { get; set; }
        
        public DbSet<Tag> Tags { get; set; }

        public DbSet<TagTasks> TagTasks { get; set; }
        public DbSet<Group> Groups { get; set; }
        public DbSet<UsersGroups> UsersGroups { get; set; }
    }
}
