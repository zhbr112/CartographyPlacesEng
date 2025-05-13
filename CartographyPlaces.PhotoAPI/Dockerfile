FROM mcr.microsoft.com/dotnet/aspnet:9.0-preview AS base
USER app
WORKDIR /app
EXPOSE 8080


FROM mcr.microsoft.com/dotnet/sdk:9.0-preview AS build
ARG BUILD_CONFIGURATION=Release
WORKDIR /src
COPY ["CartographyPlaces.PhotoAPI/CartographyPlaces.PhotoAPI.csproj", "CartographyPlaces.PhotoAPI/"]
RUN dotnet restore "./CartographyPlaces.PhotoAPI/CartographyPlaces.PhotoAPI.csproj"
COPY . .
WORKDIR "/src/CartographyPlaces.PhotoAPI"
RUN dotnet build "./CartographyPlaces.PhotoAPI.csproj" -c $BUILD_CONFIGURATION -o /app/build

FROM build AS publish
ARG BUILD_CONFIGURATION=Release
RUN dotnet publish "./CartographyPlaces.PhotoAPI.csproj" -c $BUILD_CONFIGURATION -o /app/publish /p:UseAppHost=false

FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "CartographyPlaces.PhotoAPI.dll"]