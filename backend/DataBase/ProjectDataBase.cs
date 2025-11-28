using ArhiTodo.Models;
using Microsoft.EntityFrameworkCore;

namespace ArhiTodo.DataBase;

public class ProjectDataBase : DbContext
{
    public DbSet<Project> Projects { get; set; }
    public DbSet<Board> Boards { get; set; }
    public DbSet<CardList> CardLists { get; set; }
    public DbSet<Card> Cards { get; set; }

    public ProjectDataBase(DbContextOptions<ProjectDataBase> options)
        : base(options)
    {
    }
}