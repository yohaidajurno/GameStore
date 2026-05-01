using System.ComponentModel.DataAnnotations;

namespace GameStore.Api.DTOs;

public record UpdateGameDto(
    [Required][StringLength(50)] string Name,
    [Range(1,50)] int GenreId,
    [Required][Range(1, 100)] decimal Price,
    [Required] DateOnly ReleaseDate
);
