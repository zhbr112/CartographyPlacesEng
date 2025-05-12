//using JwtUserAuth.Attributes;
//using JwtUserAuth.Types;
//using System.Security.Claims;

//namespace CartographyPlaces.AuthAPI.Models;

//public class User : JwtUser
//{
//    [JwtClaim("firstname")]
//    public string? FirstName { get; set; }
//    [JwtClaim("lastname")]
//    public string? LastName { get; set; }
//    [JwtClaim(ClaimTypes.Name)]
//    public string? Username { get; set; }
//    [JwtClaim("id")]
//    public long Id { get; set; }
//    [JwtClaim("photourl")]
//    public string? PhotoUrl { get; set; }
//}
namespace TgAuthTest.Data;

public class User
{
    public string? FirstName { get; set; }

    public string? LastName { get; set; }

    public string? Username { get; set; }

    public long Id { get; set; }

    public string? PhotoUrl { get; set; }

    public bool IsAuthenticated { get; set; } = false;
}