namespace ArhiTodo.Domain.Exceptions;

public class CardAlreadyExistsException : Exception
{
    public CardAlreadyExistsException() { }
    public CardAlreadyExistsException(string msg) : base(msg) {  }
}