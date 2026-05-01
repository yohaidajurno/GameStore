using GameStore.Api.Data;
using GameStore.Api.DTOs;
using GameStore.Api.EndPoints;


var builder = WebApplication.CreateBuilder(args);

builder.Services.AddValidation();
builder.AddGameStoreDb();

builder.Services.AddCors(options =>
{
    options.AddPolicy("Frontend", policy =>
    {
        policy
            .WithOrigins(
                "http://localhost:5173",
                "http://127.0.0.1:5173"
            )
            .AllowAnyHeader()
            .AllowAnyMethod();
    });
});


var app = builder.Build();

app.UseCors("Frontend");

app.MapGamesEndPoints();
app.MapGenresEndPoints();

app.MigrateDb();

app.Run();

