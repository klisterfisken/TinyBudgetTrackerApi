using System.Text.Json;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddOpenApi();

builder.Services.AddCors(options =>
{
    options.AddDefaultPolicy(policy =>
    {
        policy.AllowAnyOrigin()
              .AllowAnyMethod()
              .AllowAnyHeader();
    });
});

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
}

app.UseHttpsRedirection();

app.UseCors();
app.UseDefaultFiles();
app.UseStaticFiles();

var dataDir = Path.Combine(AppContext.BaseDirectory, "data");
var dataFil = Path.Combine(dataDir, "data.json");
var historikFil = Path.Combine(dataDir, "historik.txt");
var transaktionerFil = Path.Combine(dataDir, "transaktioner.json");

app.MapGet("/api/data", () =>
{
    var json = File.ReadAllText(dataFil);
    return Results.Content(json, "application/json");
});

app.MapPost("/api/data", async (HttpContext context) =>
{
    var json = await new StreamReader(context.Request.Body).ReadToEndAsync();
    await File.WriteAllTextAsync(dataFil, json);
    return Results.Ok();
});

app.MapPost("/api/historik", async (HttpContext context) =>
{
    var json = await new StreamReader(context.Request.Body).ReadToEndAsync();
    var data = System.Text.Json.JsonSerializer.Deserialize<Dictionary<string, JsonElement>>(json);

    var vecka = data["vecka"].GetInt32();
    var kvar = data["kvar"].GetDouble();

    var rad = kvar >= 0
        ? $"Vecka {vecka}: {kvar:F2} kr sparades"
        : $"Vecka {vecka}: {Math.Abs(kvar):F2} kr över budget";

    await File.AppendAllTextAsync(historikFil, rad + Environment.NewLine);
    return Results.Ok();
});

app.MapPost("/api/transaktion", async (HttpContext context) =>
{
var json = await new StreamReader(context.Request.Body).ReadToEndAsync();
var befintliga = await File.ReadAllTextAsync(transaktionerFil);
var lista = JsonSerializer.Deserialize<List<Dictionary<string, JsonElement>>>(befintliga)
    ?? new List<Dictionary<string, JsonElement>>();
var nyPost = JsonSerializer.Deserialize<Dictionary<string, JsonElement>>(json);
lista.Add(nyPost);
await File.WriteAllTextAsync(transaktionerFil, JsonSerializer.Serialize(lista));
return Results.Ok();
});

app.MapGet("/api/transaktioner", async () =>
{
    var json = await File.ReadAllTextAsync(transaktionerFil);
    return Results.Content(json, "application/json");
});

app.Run();