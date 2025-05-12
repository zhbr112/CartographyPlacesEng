using CartographyPlaces.AuthAPI.Data;
using CartographyPlaces.PhotoAPI.Models;
using Microsoft.EntityFrameworkCore;
using TgAuthTest.Data;
using TgAuthTest;


var builder = WebApplication.CreateBuilder(args);

var config = builder.Configuration;

builder.Services.AddCors();

builder.AddJwtAuth();

builder.Services.AddEndpointsApiExplorer();

builder.Services.AddDbContext<PlacePhotoDbContext>(options => options.UseNpgsql(config.GetConnectionString("Postgres")));

builder.Services.AddHttpContextAccessor();

//builder.Services.AddScoped<IUserService, UserService>();

var app = builder.Build();

app.UseJwtAuth();

app.UseCors(x => x
                    .AllowAnyMethod()
                    .AllowAnyHeader()
                    .SetIsOriginAllowed(origin => true) // allow any origin
                                                        //.WithOrigins("https://localhost:44351")); // Allow only this origin can also have multiple origins separated with comma
                    .AllowCredentials());

app.MapPost("/add", async (Guid placeId, User user, HttpContext context, PlacePhotoDbContext db) =>
{
    try
    {
        // ������� �������� ����������� ������
        IFormFileCollection files = context.Request.Form.Files;
        // ���� � �����, ��� ����� ��������� �����
        var uploadPath = $"{Directory.GetCurrentDirectory()}/uploads";
        // ������� ����� ��� �������� ������
        Directory.CreateDirectory(uploadPath);

        // ����������� �� ���� ������
        var file = files[0];

        // ��������� ���� � ����� � ����� uploads


        var placePhoto = new PlacePhoto
        {
            AddedBy = user.Id,
            PlaceId = placeId,
            FileName = file.FileName
        };

        string fullPath = $"{uploadPath}/{placePhoto.Id}_{file.FileName}";

        // ��������� ���� � ����� uploads
        using (var fileStream = new FileStream(fullPath, FileMode.Create))
        {
            await file.CopyToAsync(fileStream);
        }
        await db.PlacePhoto.AddAsync(placePhoto);
        await db.SaveChangesAsync();
        return Results.Ok("�������� ���������");
    }
    catch (Exception ex)
    {
        return Results.NotFound(ex.Message);
    }

}).RequireAuthorization();

app.MapGet("/{placeId}", async (Guid placeId, PlacePhotoDbContext db) =>
{
    var photos = await db.PlacePhoto.Where(x => x.PlaceId == placeId).ToListAsync()
    ?? throw new ArgumentException("� ����� ����� ��� ��������");
    var uploadPath = $"{Directory.GetCurrentDirectory()}/uploads";
    string fullPath = $"{uploadPath}/{photos[0].Id}_{photos[0].FileName}";
    return Results.File(fullPath);

});

app.MapGet("/test", async (PlacePhotoDbContext db) =>
{
    var photos = await db.PlacePhoto.ToListAsync();
    return Results.Ok(config["Jwt:Audience"] + " hello");
    //return Results.Ok(photos);
});

app.MapGet("/testt", async (PlacePhotoDbContext db) =>
{
    return Results.Ok(config["Jwt:Audience"]);
});

app.Run();

public record class Photo(Guid Id, string FileName);