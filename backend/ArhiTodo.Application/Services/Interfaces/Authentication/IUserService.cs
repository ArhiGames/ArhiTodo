using ArhiTodo.Application.DTOs.Auth;
using ArhiTodo.Application.DTOs.User;
using ArhiTodo.Domain.Common.Result;

namespace ArhiTodo.Application.Services.Interfaces.Authentication;

public interface IUserService
{
    Task<List<ClaimGetDto>?> UpdateClaims(Guid userId, List<ClaimPostDto> claimPostDtos);
    Task<Result<UserGetDto>> GetUser(Guid guid);
    Task<Result<List<UserGetDto>>> GetUsers(int page, bool includeGlobalPermissions, int? boardPermissionsBoardId);
    Task<Result<int>> GetUserCount();
}