using System.Collections.Immutable;
using Amazon.S3;
using Amazon.S3.Model;
using TgAuthTest;
using TgAuthTest.Data;


var builder = WebApplication.CreateBuilder(args);
var config = builder.Configuration;

builder.Services.AddCors();
builder.AddJwtAuth();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddHttpContextAccessor();
builder.Services.AddSingleton<IAmazonS3>(_ =>
{
    var s3config = new AmazonS3Config
    {
        ServiceURL = config["S3:Url"],
        ForcePathStyle = true,
    };

    return new AmazonS3Client(config["S3:AccessKey"], config["S3:SecretKey"], s3config);
});

var app = builder.Build();

app.UseJwtAuth();

app.UseCors(x => x
                    .AllowAnyMethod()
                    .AllowAnyHeader()
                    .SetIsOriginAllowed(origin => true)
                    .AllowCredentials());

app.MapPost("/add", async (Guid placeId, User user, IFormFileCollection files, IAmazonS3 s3) =>
{
    var largeFiles = files.Where(x => x.Length > config.GetValue<long>("Uploads:SizeLimitBytes")).Select(x => x.FileName).ToImmutableArray();
    if (largeFiles.Length > 0) return Results.BadRequest(new { Message = "File too large", Files = largeFiles });

    var uploadFiles = files.Select(x => new UploadPhoto(x, Guid.NewGuid()));  // Assign a unique UUID for each file.

    await Parallel.ForEachAsync(uploadFiles, async (x, ct) =>
    {
        var f = File.Create("./image.jpeg");
        await x.File.CopyToAsync(f);
        f.Close();

        await s3.PutObjectAsync(new PutObjectRequest
        {
            BucketName = config["S3:ImageBucketName"],
            Key = $"{placeId}/{x.AssignedId}{Path.GetExtension(x.File.FileName)}",
            InputStream = x.File.OpenReadStream(),
            ContentType = x.File.ContentType,
            AutoCloseStream = true,
            UseChunkEncoding = false
        }, ct);
    });

    return Results.Ok();
}).DisableAntiforgery();

app.MapGet("/{placeId}", async (Guid placeId, IAmazonS3 s3) =>
{
    return (await s3.ListObjectsV2Async(new ListObjectsV2Request()
    {
        BucketName = config["S3:ImageBucketName"],
        Prefix = placeId.ToString()
    })).S3Objects?.Select(x => $"{config["S3:Url"]}/{config["S3:ImageBucketName"]}/{x.Key}") ?? [];
});

app.Run();

public record class UploadPhoto(IFormFile File, Guid AssignedId);