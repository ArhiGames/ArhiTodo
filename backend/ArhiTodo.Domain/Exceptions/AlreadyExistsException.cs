namespace ArhiTodo.Domain.Exceptions;

public class AlreadyExistsException(string msg) : Exception(msg);