FROM mcr.microsoft.com/dotnet/aspnet:9.0-preview AS base
USER app
WORKDIR /app
EXPOSE 8080


FROM mcr.microsoft.com/dotnet/sdk:9.0-preview AS build
ARG BUILD_CONFIGURATION=Release
WORKDIR /src
COPY ["CartographyPlaces.AuthAPI/CartographyPlaces.AuthAPI.csproj", "CartographyPlaces.AuthAPI/"]
RUN dotnet restore "./CartographyPlaces.AuthAPI/CartographyPlaces.AuthAPI.csproj"
COPY . .
WORKDIR "/src/CartographyPlaces.AuthAPI"
RUN dotnet build "./CartographyPlaces.AuthAPI.csproj" -c $BUILD_CONFIGURATION -o /app/build

FROM build AS publish
ARG BUILD_CONFIGURATION=Release
RUN dotnet publish "./CartographyPlaces.AuthAPI.csproj" -c $BUILD_CONFIGURATION -o /app/publish /p:UseAppHost=false

FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "CartographyPlaces.AuthAPI.dll"]