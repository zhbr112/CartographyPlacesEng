namespace CartographyPlaces.AuthAPI.Models;

public class User(long id, string username, string photoUrl, string firstName, string? secondName)
{
    public long Id { get; set; } = id;
    public string Username { get; set; } = username;
    public string PhotoUrl { get; set; } = photoUrl;
    public string FirstName { get; set; } = firstName;
    public string? SecondName { get; set; } = secondName;
}