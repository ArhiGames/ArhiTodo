namespace ArhiTodo.Domain.Repositories;

public interface IUserRepository
{
    Task<bool> ChangePasswordAsync(AppUser appUser, ChangePasswordDto changePasswordDto);
    Task<List<UserUserManagementGetDto>> GetAllUsersAsync();
    Task<int> UpdateUserClaims(AppUser appUser, List<ClaimPostDto> updatedClaims);
    Task<UserUserManagementGetDto> GetUserWithClaimsAsync(AppUser appUser);
    Task<bool> DeleteAppUser(AppUser appUser);
}