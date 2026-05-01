using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Design;

namespace GameStore.Api.Data;

public class GameStoreContextFactory : IDesignTimeDbContextFactory<GameStoreContext>
{
    public GameStoreContext CreateDbContext(string[] args)
    {
        var optionsBuilder = new DbContextOptionsBuilder<GameStoreContext>();
        optionsBuilder
            .UseSqlite("Data Source=GameStore.db")
            .UseSeeding(DataExtensions.SeedGenres);

        return new GameStoreContext(optionsBuilder.Options);
    }
}
