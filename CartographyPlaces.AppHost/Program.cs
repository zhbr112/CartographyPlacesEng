var builder = DistributedApplication.CreateBuilder(args);

var userDb = builder.AddPostgres("user-db");

var apiService = builder.AddProject<Projects.CartographyPlaces_AuthAPI>("auth-api")
    .WithReference(userDb);

//builder.AddProject<Projects.UserAPI>("userapi");

builder.Build().Run();
