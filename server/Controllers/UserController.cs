using Microsoft.Data.SqlClient;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using server.Constants;
using Server.Data;
using Server.Models;

namespace server.Controllers;

[ApiController]
[Route(Consts.DEFAULT_ROUTE)]
public class UserController : ControllerBase
{
    private readonly ApplicationDbContext _db; // create object of ApplicationDbContext class

    public UserController(ApplicationDbContext db) // constructor
    {
        _db = db;
    }

    // public IActionResult Index(){
    //     // var objCategoryList = _db.Categories.ToList();
    //     IEnumerable<User> objCategoryList = _db.Users;
    //     return objCategoryList;  
    // }

    // // GET - CREATE
    // public IActionResult Create(){
    //     return View();
    // }

    // // POST - CREATE
    // [HttpPost]
    // [ValidateAntiForgeryToken]
    // public IActionResult Create(Category objCategory){
    //     if(objCategory.Name == objCategory.DisplayOrder.ToString()){
    //         ModelState.AddModelError("name", "Name and Display Order cannot be the same");
    //     }
    //     if(ModelState.IsValid){
    //         _db.Categories.Add(objCategory);
    //         _db.SaveChanges();
    //         return RedirectToAction("Index");
    //     }
    //     return View(objCategory);
    // }

    // // GET - CREATE
    // public IActionResult Edit(int? id){
    //     if(id == null){
    //         return NotFound();
    //     }
    //     var categoryFromDb = _db.Categories.Find(id);
    //     // var categoryFromDbFirst = _db.Categories.FirstOrDefault(c => c.Id == id);
    //     // var categoryFromDbSingle = _db.Categories.SingleOrDefault(c => c.Id == id);
    //     if(categoryFromDb == null){
    //         return NotFound();
    //     }

    //     return View(categoryFromDb);
    // }

    // // POST - CREATE
    // [HttpPost]
    // [ValidateAntiForgeryToken]
    // public IActionResult Edit(Category objCategory){
    //     if(objCategory.Name == objCategory.DisplayOrder.ToString()){
    //         ModelState.AddModelError("name", "Name and Display Order cannot be the same");
    //     }
    //     if(ModelState.IsValid){
    //         _db.Categories.Update(objCategory); // it will find primary key
    //         _db.SaveChanges();
    //         return RedirectToAction("Index");
    //     }
    //     return View(objCategory);
    // }

    //     // GET - CREATE
    // public IActionResult Delete(int? id){
    //     if(id == null){
    //         return NotFound();
    //     }
    //     var categoryFromDb = _db.Categories.Find(id); //same with Edit
    //     // var categoryFromDbFirst = _db.Categories.FirstOrDefault(c => c.Id == id);
    //     // var categoryFromDbSingle = _db.Categories.SingleOrDefault(c => c.Id == id);
    //     if(categoryFromDb == null){
    //         return NotFound();
    //     }

    //     return View(categoryFromDb);
    // }

    // // POST - CREATE
    // [HttpPost, ActionName("Delete")]
    // [ValidateAntiForgeryToken]
    // public IActionResult DeletePOST(int? id){
    //     var obj = _db.Categories.Find(id);
    //     if(obj == null){
    //         return NotFound();
    //     }
    //     _db.Categories.Remove(obj); // it will find primary key
    //     _db.SaveChanges(); 
    //     TempData["Success"] = "Category Deleted Successfully";
    //     return RedirectToAction("Index");
    // }


    [HttpGet("id")]
    public string GetUserName(int id)
    {   
        // Get the underlying SqlConnection object
        SqlConnection sqlConnection = (SqlConnection)_db.Database.GetDbConnection();

        // get sql connection from appsettings.json
        var sql = "SELECT * FROM Users WHERE userId = @Id";
        var cmd = new SqlCommand(sql, sqlConnection);
        cmd.Parameters.AddWithValue("@Id", id);

        sqlConnection.Open();
        var reader = cmd.ExecuteReader();
        if (reader.Read())
        {
            var name = reader.GetString(1);
            return name;
        }

        return "User not found";
    }

    // [HttpGet("id")]  // hata veriyor cunku get id
    // public string EditUserName(int id)
    // {
    //     // Get the underlying SqlConnection object
    //     SqlConnection sqlConnection = (SqlConnection)_db.Database.GetDbConnection();

    //     // get sql connection from appsettings.json
    //     var sql = "UPDATE * FROM Users WHERE userId = @Id";
    //     var cmd = new SqlCommand(sql, sqlConnection);
    //     cmd.Parameters.AddWithValue("@Id", id);

    //     sqlConnection.Open();
    //     var reader = cmd.ExecuteReader();
    //     if (reader.Read())
    //     {
    //         var name = reader.GetString(1);
    //         return name;
    //     }

    //     return "User not found";
    // }

    
    // POST - CREATE
    [HttpPost]
    [ValidateAntiForgeryToken]
    public string Create(User objCategory){
        if(objCategory.Name == objCategory.Username.ToString()){
            ModelState.AddModelError("name", "Name and Display Order cannot be the same");
        }
        if(ModelState.IsValid){
            _db.Users.Add(objCategory);
            _db.SaveChanges();
            // return RedirectToAction("Index");
            return "Successfully created";
        }
        // return View(objCategory);
        return "Error occured when creating";;
    }

}
