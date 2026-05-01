using GameStore.Api.Data;
using GameStore.Api.DTOs;
using GameStore.Api.Models;
using Microsoft.EntityFrameworkCore;

namespace GameStore.Api.EndPoints;

public static class GamesEndPoint
{
    const string GetGameEndpointName = "GetGame";

    public static void MapGamesEndPoints(this WebApplication app)
    {
        var group = app.MapGroup("/games");

        //GET end point - /games
        group.MapGet("/", async (GameStoreContext dbContext) =>
            await dbContext.Games
                                .Include(game => game.Genre)
                                .Select(game => new GameSummaryDto(
                                    game.Id,
                                    game.Name,
                                    game.Genre!.Name,
                                    game.Price,
                                    game.ReleaseDate
                               ))
                               .AsNoTracking()
                               .ToListAsync());


        //GET end point - /games/1
        group.MapGet("/{id}", async (int id, GameStoreContext dbContext) =>
        {
            var game = await dbContext.Games.FindAsync(id);

            return game is null ? Results.NotFound() : Results.Ok(new GameDetailsDto(
                game.Id,
                game.Name,
                game.GenreId,
                game.Price,
                game.ReleaseDate));
        })
            .WithName(GetGameEndpointName);

        //POST end point - /games/1
        group.MapPost("/", async (CreateGameDto newGame, GameStoreContext dbContext) =>
        {
            if (!dbContext.Genres.Any(genre => genre.Id == newGame.GenreId))
            {
                return Results.BadRequest();
            }

            Game game = new()
            {
                Name = newGame.Name,
                GenreId = newGame.GenreId,
                Price = newGame.Price,
                ReleaseDate = newGame.ReleaseDate
            };

            dbContext.Games.Add(game);
            await dbContext.SaveChangesAsync();

            GameDetailsDto gameDto = new(
                game.Id,
                game.Name,
                game.GenreId,
                game.Price,
                game.ReleaseDate
            );
            return Results.CreatedAtRoute(GetGameEndpointName, new { id = gameDto.Id }, gameDto);
        });

        //PUT end point - /games/1
        group.MapPut("/{id}", async (int id, UpdateGameDto updatedGame, GameStoreContext dbContext) =>
        {

            var existingGame = await dbContext.Games.FindAsync(id);

            if (existingGame is null)
            {
                return Results.NotFound();
            }

            if (!dbContext.Genres.Any(genre => genre.Id == updatedGame.GenreId))
            {
                return Results.BadRequest();
            }

            existingGame.Name = updatedGame.Name;
            existingGame.GenreId = updatedGame.GenreId;
            existingGame.Price = updatedGame.Price;
            existingGame.ReleaseDate = updatedGame.ReleaseDate;

            await dbContext.SaveChangesAsync();

            return Results.NoContent();
        });

        //DELETE end point - /games/1
        group.MapDelete("/{id}", async (int id, GameStoreContext dbContext) =>
        {
            await dbContext.Games
                                .Where(game => game.Id == id)
                                .ExecuteDeleteAsync();
            return Results.NoContent();
        });

    }


}
