using Server.Data;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

builder.Services.AddControllersWithViews();
builder.Services.AddDbContext<ApplicationDbContext>(options => options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));
builder.Services.AddSwaggerGen(); // Add this line to add Swagger services

var app = builder.Build();

// Configure the HTTP request pipeline.
if (!app.Environment.IsDevelopment())
{
  // The default HSTS value is 30 days. You may want to change this for production scenarios, see https://aka.ms/aspnetcore-hsts.
  app.UseHsts();
}

app.UseSwagger(); // Add this line to enable Swagger
app.UseSwaggerUI(c =>
{
  c.SwaggerEndpoint("/swagger/v1/swagger.json", "My API V1");
  c.RoutePrefix = "swagger";
}); // Add this line to configure Swagger UI

// if (app.Environment.IsProduction())
// {
//   app.UseHttpsRedirection();
// }

app.UseStaticFiles();
app.UseRouting();

app.MapControllerRoute(
  name: "api",
  pattern: "/api/{controller=Home}/{id?}");

app.MapFallbackToFile("/index.html");

app.Run();

