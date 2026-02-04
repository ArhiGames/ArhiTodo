using ArhiTodo.Domain.Events;

namespace ArhiTodo.Domain.Common;

public abstract class AggregateRoot<TId>
{
    public TId Id { get; } = default!;
    
    private readonly List<IDomainEvent> _domainEvents = [];

    public IReadOnlyCollection<IDomainEvent> DomainEvents => _domainEvents.AsReadOnly();

    protected void AddDomainEvent(IDomainEvent domainEvent)
    {
        _domainEvents.Add(domainEvent);
    }

    public void ClearDomainEvents() => _domainEvents.Clear();

    public override bool Equals(object? obj)
    {
        if (obj is not AggregateRoot<TId> entity || GetType() != entity.GetType())
        {
            return false;
        }

        return EqualityComparer<TId>.Default.Equals(Id, entity.Id);
    }

    public override int GetHashCode()
    {
        return EqualityComparer<TId>.Default.GetHashCode(Id!);
    }
}