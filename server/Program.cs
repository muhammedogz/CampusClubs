using Server.Data;
using Microsoft.EntityFrameworkCore;
using Microsoft.OpenApi.Models;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using Microsoft.AspNetCore.Authorization;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

builder.Services.AddControllersWithViews();
builder.Services.AddDbContext<ApplicationDbContext>(options => options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));
builder.Services.AddSwaggerGen(); // Add this line to add Swagger services
builder.Services.AddSwaggerGen(option => // authentication in Swagger
{
    option.SwaggerDoc("v1", new OpenApiInfo { Title = "Demo API", Version = "v1" });
    option.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
    {
        In = ParameterLocation.Header,
        Description = "Please enter a valid token",
        Name = "Authorization",
        Type = SecuritySchemeType.Http,
        BearerFormat = "JWT",
        Scheme = "Bearer"
    });
    option.AddSecurityRequirement(new OpenApiSecurityRequirement
    {
        {
            new OpenApiSecurityScheme
            {
                Reference = new OpenApiReference
                {
                    Type=ReferenceType.SecurityScheme,
                    Id="Bearer"
                }
            },
            new string[]{}
        }
    });
});

builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
        .AddJwtBearer(options =>
        {
            options.TokenValidationParameters = new TokenValidationParameters
            // {
            //     ValidateIssuer = false,
            //     // ValidateIssuer = true,
            //     // ValidIssuer = "Also My Issuer",    //Missing line here
            //     ValidateAudience = false,
            //     IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes("YWxpY2VudGVyX2FkZHI="))
            // };
            {
                ValidateAudience = true,
                // ValidAudience = "Audience",
                ValidateIssuer = true,
                // ValidIssuer = "http://localhost:5130",
                ValidAudience = "Audience", // Set the desired audience value
                ValidIssuer = "Issuer", // Set the desired issuer value
                RequireExpirationTime = false,
                ValidateIssuerSigningKey = true,
                IssuerSigningKey = new SymmetricSecurityKey(Encoding.ASCII.GetBytes("your_signing_key"))
            };
        });

// builder.Services.AddAuthentication(IdentityServerAuthenticationDefaults.AuthenticationScheme)
//                 .AddIdentityServerAuthentication( x =>
//                 {
//                     x.Authority = "http://localhost:5000"; //idp address
//                     x.RequireHttpsMetadata = false;
//                     x.ApiName = "api2"; //api name
//                 });

builder.Services.AddAuthorization(auth =>
{
    auth.AddPolicy("Bearer", new AuthorizationPolicyBuilder()
        .AddAuthenticationSchemes(JwtBearerDefaults.AuthenticationScheme‌​)
        .RequireAuthenticatedUser().Build());
});


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

// // Place the following line after app.UseRouting() and before app.UseEndpoints(...)
app.UseAuthentication(); 
app.UseAuthorization();

app.MapControllerRoute(
  name: "api",
  pattern: "/api/{controller=Home}/{id?}");

app.MapFallbackToFile("/index.html");

app.Run();

// #######################################################

// using Server.Data;
// using Microsoft.EntityFrameworkCore;
// using Microsoft.OpenApi.Models;
// using Microsoft.AspNetCore.Authentication.JwtBearer;
// using Microsoft.IdentityModel.Tokens;
// using System.Text;

// public class Program
// {
//     public static void Main(string[] args)
//     {
//         var builder = WebApplication.CreateBuilder(args);

//         // Add services to the container.
//         builder.Services.AddControllersWithViews();
//         builder.Services.AddDbContext<ApplicationDbContext>(options => options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));
//         builder.Services.AddSwaggerGen(option =>
//         {
//             option.SwaggerDoc("v1", new OpenApiInfo { Title = "Demo API", Version = "v1" });
//             option.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
//             {
//                 In = ParameterLocation.Header,
//                 Description = "Please enter a valid token",
//                 Name = "Authorization",
//                 Type = SecuritySchemeType.Http,
//                 BearerFormat = "JWT",
//                 Scheme = "Bearer"
//             });
//             option.AddSecurityRequirement(new OpenApiSecurityRequirement
//             {
//                 {
//                     new OpenApiSecurityScheme
//                     {
//                         Reference = new OpenApiReference
//                         {
//                             Type=ReferenceType.SecurityScheme,
//                             Id="Bearer"
//                         }
//                     },
//                     new string[]{}
//                 }
//             });
//         });

//         builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
//         .AddJwtBearer(options =>
//         {
//             options.TokenValidationParameters = new TokenValidationParameters
//             {
//                 ValidateIssuer = true,
//                 ValidIssuer = "Also My Issuer",    //Missing line here
//                 ValidateAudience = false,
//                 IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes("eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwidXNlck5hbWUiOiJzZ2xibCIsInBhc3N3b3JkIjoic2dsYmwxMjMifQ.T53csRt1UbgNks_Oi3EML-y0_l45fCpUUjGQEpShzMc"))
//             };
//         });


//         var app = builder.Build();

//         // Configure the HTTP request pipeline.
//         if (!app.Environment.IsDevelopment())
//         {
//             app.UseHsts();
//         }

//         app.UseSwagger();
//         app.UseSwaggerUI(c =>
//         {
//             c.SwaggerEndpoint("/swagger/v1/swagger.json", "My API V1");
//             c.RoutePrefix = "swagger";
//         });

//         app.UseStaticFiles();
//         app.UseRouting();

//         app.UseAuthentication(); // Add this line to enable authentication
//         app.UseAuthorization();

//         app.MapControllerRoute(
//             name: "api",
//             pattern: "/api/{controller=Home}/{id?}");

//         app.MapFallbackToFile("/index.html");

//         app.Run();
//     }
// }
