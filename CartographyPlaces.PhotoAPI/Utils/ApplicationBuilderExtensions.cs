using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using TgAuthTest.Data;


namespace TgAuthTest;

public static class ApplicationBuilderExtensions
{
    public static WebApplicationBuilder AddJwtAuth(this WebApplicationBuilder builder)
    {
        var config = builder.Configuration;

        builder.Services.AddSingleton<User>();

        builder.Services.AddAuthentication(opt =>
        {
            opt.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
            opt.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
            opt.DefaultScheme = JwtBearerDefaults.AuthenticationScheme;
        }).AddJwtBearer(JwtBearerDefaults.AuthenticationScheme, jwt =>
        {
            jwt.TokenValidationParameters = new TokenValidationParameters
            {
                ValidateIssuer = true,
                ValidIssuer = config["Jwt:Issuer"],
                ValidateAudience = true,
                ValidAudience = config["Jwt:Audience"],
                ValidateLifetime = true,
                IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(config["Jwt:Symkey"]!)),
                ValidateIssuerSigningKey = true
            };
        });

        builder.Services.AddAuthorizationBuilder()
            .AddDefaultPolicy("user", policy =>
            {
                policy.AuthenticationSchemes.Add(JwtBearerDefaults.AuthenticationScheme);
                policy.RequireAuthenticatedUser();
            });

        builder.Services.AddSingleton<JwtSecurityTokenHandler>();

        return builder;
    }

    public static WebApplication UseJwtAuth(this WebApplication app)
    {
        app.UseAuthentication();
        app.UseAuthorization();

        app.Use((context, next) =>
        {
            if (context.User.Identity is not ClaimsIdentity identity || !identity.IsAuthenticated) return next(context);

            var user = context.RequestServices.GetRequiredService<User>();

            user.IsAuthenticated = true;
            user.Id = long.Parse(identity.Claims.First(c => c.Type == "id").Value);
            user.Username = identity.Name;
            user.FirstName = identity.Claims.FirstOrDefault(c => c.Type == "firstname")?.Value;
            user.LastName = identity.Claims.FirstOrDefault(c => c.Type == "lastname")?.Value;
            user.PhotoUrl = identity.Claims.FirstOrDefault(c => c.Type == "photourl")?.Value;

            return next(context);
        });

        return app;
    }
}