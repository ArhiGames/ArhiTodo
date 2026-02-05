namespace ArhiTodo.Domain.Exceptions;

public class NothingToDeleteException(string msg) : Exception(msg);