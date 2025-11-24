using ArhiTodo.Models;
using Microsoft.EntityFrameworkCore;

namespace ArhiTodo.DataBase;

public class BoardDataBase : DbContext
{
    public DbSet<Board> Boards { get; set; }

    public BoardDataBase(DbContextOptions<BoardDataBase> options)
        : base(options)
    {
    }
}