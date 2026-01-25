namespace ArhiTodo.Application.DTOs.Auth;

public enum ExpireType
{
    Never = 0,
    Minutes = 1,
    Hours = 2,
    Days = 3
}

public class GenerateInvitationDto
{
    public required string InvitationLinkName { get; set; }
    
    public required ExpireType ExpireType { get; set; }
    
    public int ExpireNum { get; set; }

    public int MaxUses { get; set; } = 0;
}