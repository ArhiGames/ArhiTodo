namespace ArhiTodo.Domain.Exceptions;

public class BoardAlreadyExistsException : Exception
{
    public BoardAlreadyExistsException() { }
    public BoardAlreadyExistsException(string msg) : base(msg) {  }
}