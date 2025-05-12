using CartographyPlaces.AuthAPI.Data;
using CartographyPlaces.AuthAPI.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System.ComponentModel.DataAnnotations;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;

namespace CartographyPlaces.AuthAPI.Services;

public class UserService(UserDbContext db, IHttpContextAccessor httpContextAccessor, IConfiguration config) : IUserService
{
    private bool ValidateUser(User user, string Hash, int Auth_date)
    {
        if ((DateTime.UtcNow - DateTimeOffset.FromUnixTimeSeconds(Auth_date)
            .DateTime).TotalHours > 24) throw new TimeoutException("Данные устарели");

        var dataCheckString = string.Join('\n',
            httpContextAccessor.HttpContext!.Request.Query
            .Where(x => !x.Key.Equals("hash"))
            .OrderBy(x => x.Key)
            .Select(x => $"{x.Key}={x.Value}"));

        var secretKey = SHA256.HashData(Encoding.UTF8.GetBytes(config["botToken"] ??
            throw new ArgumentException("Нет botToken")));

        if (!Convert.ToHexStringLower(HMACSHA256.HashData(secretKey,
            Encoding.UTF8.GetBytes(dataCheckString))).Equals(Hash))
            throw new ValidationException("Данные не соответствуют хэшу");

        return true;
    }

    public async Task<JwtSecurityToken> LoginUserAsync(User user, string Hash, int Auth_date)
    {
        ValidateUser(user, Hash, Auth_date);
        if (await db.Users.FirstOrDefaultAsync(x => x.Id == user.Id) is null)
        {
            await db.Users.AddAsync(user);
            await db.SaveChangesAsync();
        }

        var claims = new List<Claim> {
            new ("id", user.Id.ToString()) ,
            new ("firstname", user.FirstName),
            new ("secondname", user.SecondName ?? ""),
            new (ClaimTypes.Name, user.Username),
            new ("photourl", user.PhotoUrl)
        };

        var jwt = new JwtSecurityToken(
                issuer: config["Jwt:Issuer"] ?? throw new ArgumentException("Нет issuer"),
                audience: config["Jwt:Audience"] ?? throw new ArgumentException("Нет audience"),
                claims: claims,
                expires: DateTime.UtcNow.Add(TimeSpan.FromDays(1)),
                signingCredentials: new SigningCredentials(
                    new SymmetricSecurityKey(Encoding.UTF8.GetBytes(config["Jwt:Symkey"]
                    ?? throw new ArgumentException("Нет Symkey"))),
                    SecurityAlgorithms.HmacSha256));
        return jwt;
    }

    public async Task<User> GetUserAsync(long id)
    {
        var user = await db.Users.FirstOrDefaultAsync(x => x.Id.Equals(id))
            ?? throw new ArgumentException("Такого пользователя не существует");
        return user;
    }
}
