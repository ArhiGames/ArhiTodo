using ArhiTodo.Models;
using Microsoft.EntityFrameworkCore;

namespace ArhiTodo.DataBase;

public class ProjectDataBase : DbContext
{
    public DbSet<Project> Projects { get; set; }
    public DbSet<Board> Boards { get; set; }

    public ProjectDataBase(DbContextOptions<ProjectDataBase> options)
        : base(options)
    {
    }
}