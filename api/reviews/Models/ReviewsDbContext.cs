using Microsoft.EntityFrameworkCore;

namespace reviews.Models;

public class ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) : DbContext(options)
{
    public virtual DbSet<Review> Reviews { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        modelBuilder.Entity<Review>(entity =>
        {
            entity.ToTable("reviews");
            entity.HasKey(e => e.Id);
            
            entity.Property(e => e.Id).HasColumnName("id");
            entity.Property(e => e.TaskId).HasColumnName("task_id");
            entity.Property(e => e.ReviewerUserId).HasColumnName("reviewer_user_id");
            entity.Property(e => e.RevieweeUserId).HasColumnName("reviewee_user_id");
            entity.Property(e => e.RatingScore).HasColumnName("rating_score");
            entity.Property(e => e.CommentText).HasColumnName("comment_text");
            entity.Property(e => e.CreatedAt).HasColumnName("created_at");
        });

    }
    
}