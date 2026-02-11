using ArhiTodo.Application.Services.Interfaces.Authentication;
using ArhiTodo.Domain.Entities.Auth;
using ArhiTodo.Domain.Repositories.Auth;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Authorization.Infrastructure;
using IAuthorizationService = ArhiTodo.Application.Services.Interfaces.Authorization.IAuthorizationService;

namespace ArhiTodo.Infrastructure.Services.Authorization;

public class AuthorizationService(ICurrentUser currentUser, IAccountRepository accountRepository, IAuthorizationPolicyProvider authorizationPolicyProvider) : IAuthorizationService
{
    public async Task<bool> CheckPolicy(string policyName)
    {
        AuthorizationPolicy? policy = await authorizationPolicyProvider.GetPolicyAsync(policyName);
        if (policy is null) return false;
        
        User? user = await accountRepository.GetUserByGuidAsync(currentUser.UserId);
        if (user is null) return false;
        
        if (policy.Requirements.Count == 0) return true;
        
        foreach (IAuthorizationRequirement requirement in policy.Requirements)
        {
            if (requirement is not ClaimsAuthorizationRequirement claimsAuthorizationRequirement) continue;
            if (claimsAuthorizationRequirement.AllowedValues is null) continue;

            bool hasClaim = user.UserClaims.Any(uc => uc.Type.ToString().Equals(claimsAuthorizationRequirement.ClaimType) &&
                                                      claimsAuthorizationRequirement.AllowedValues.Contains(uc.Value));
            if (!hasClaim) return false;
        }

        return true;
    }
}