namespace CartographyPlaces.PhotoAPI.Models
{
    public class PlacePhoto
    {

        public Guid Id { get; set; } = Guid.NewGuid();
        public DateTime AddedAt { get; set; } = DateTime.Now.ToUniversalTime();
        public long AddedBy { get; set; }
        public Guid PlaceId { get; set; }
        public string? FileName { get; set; }
    }
}
