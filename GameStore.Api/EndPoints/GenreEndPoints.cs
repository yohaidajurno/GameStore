using GameStore.Api.Data;
using GameStore.Api.DTOs;
using Microsoft.EntityFrameworkCore;

namespace GameStore.Api.EndPoints;

public static class GenreEndPoints
{
    public static void MapGenresEndPoints(this WebApplication app)
    {
        var group = app.MapGroup("/genres");

        // GET /genres
        group.MapGet("/", async (GameStoreContext dbContext) =>
            await dbContext.Genres
                .Select(genre => new GenreDto(genre.Id, genre.Name))
                .AsNoTracking()
                .ToListAsync());
    }
}
