// using Server.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Design;
using Server.Models;

namespace Server.Data;

public class ApplicationDbContext : DbContext
{
  public ApplicationDbContext()
  {

  }

  public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) : base(options) { }

  public DbSet<User> Users { get; set; }
  public DbSet<Club> Clubs { get; set; }
  public DbSet<Event> Events { get; set; }
  public DbSet<Announcement> Announcements { get; set; }
  public DbSet<UserClub> UserClubs { get; set; }
  public DbSet<UserEvent> UserEvents { get; set; }
  public DbSet<Department> Departments { get; set; }

  protected override void OnModelCreating(ModelBuilder modelBuilder)
  {
    base.OnModelCreating(modelBuilder);

    modelBuilder.Entity<UserClub>()
        .HasKey(uc => new { uc.UserId, uc.ClubId });

    modelBuilder.Entity<UserEvent>()
        .HasKey(ue => new { ue.UserId, ue.EventId });

    modelBuilder.Entity<UserClub>()
      .HasOne(uc => uc.User)
      .WithMany(u => u.UserClubs)
      .HasForeignKey(uc => uc.UserId)
      .OnDelete(DeleteBehavior.Restrict);

    modelBuilder.Entity<UserClub>()
      .HasOne(uc => uc.Club)
      .WithMany(c => c.UserClubs)
      .HasForeignKey(uc => uc.ClubId)
      .OnDelete(DeleteBehavior.Restrict);

    modelBuilder.Entity<UserEvent>()
      .HasOne(ue => ue.User)
      .WithMany(u => u.UserEvents)
      .HasForeignKey(ue => ue.UserId)
      .OnDelete(DeleteBehavior.Restrict);

    modelBuilder.Entity<UserEvent>()
      .HasOne(ue => ue.Event)
      .WithMany(e => e.UserEvents)
      .HasForeignKey(ue => ue.EventId)
      .OnDelete(DeleteBehavior.Restrict);

    modelBuilder.Entity<User>()
       .HasOne(u => u.Department)
       .WithMany()
       .OnDelete(DeleteBehavior.Restrict);

    modelBuilder.Entity<User>()
      .Property(u => u.Role)
      .HasConversion<string>();

    modelBuilder.Entity<User>()
          .HasIndex(u => u.UserName)
          .IsUnique();

    modelBuilder.Entity<User>()
        .HasIndex(u => u.Email)
        .IsUnique();
  }

  public DbContext CreateDbContext(string[] args)
  {
    throw new NotImplementedException();
  }
}