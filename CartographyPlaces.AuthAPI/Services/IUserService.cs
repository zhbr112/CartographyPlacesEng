using CartographyPlaces.AuthAPI.Models;
using System.IdentityModel.Tokens.Jwt;

namespace CartographyPlaces.AuthAPI.Services;

public interface IUserService
{
    public Task<JwtSecurityToken> LoginUserAsync(User user, string Hash, int Auth_date);

    public Task<User> GetUserAsync(long id);
}
