using GameStore.Api.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.VisualBasic;

namespace GameStore.Api.Data;

public static class DataExtensions
{


    public static void MigrateDb(this WebApplication app)
    {
        using var scope = app.Services.CreateScope();
        var dbContext = scope.ServiceProvider
                                            .GetRequiredService<GameStoreContext>();
        dbContext.Database.Migrate();

    }

    public static void  AddGameStoreDb(this WebApplicationBuilder builder)
    {
        var connString = builder.Configuration
                                        .GetConnectionString("GameStore");

        builder.Services.AddSqlite<GameStoreContext>(
            connString,
            optionsAction: options => options.UseSeeding(SeedGenres)
        );

    }

    internal static void SeedGenres(DbContext context, bool _)
    {
        if (context.Set<Genre>().Any())
        {
            return;
        }

        context.Set<Genre>().AddRange(
            new Genre { Name = "Fighting" },
            new Genre { Name = "Action" },
            new Genre { Name = "Platformer" },
            new Genre { Name = "Roleplaying" },
            new Genre { Name = "Sports" },
            new Genre { Name = "Racing" }
        );

        context.SaveChanges();
    }

}
