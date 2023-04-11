using Microsoft.AspNetCore.Mvc;
using BulkyBookWeb.Data;
using BulkyBookWeb.Models;
namespace BulkyBookWeb.Contollers;

public class CategoryController : Controller 
{
    private readonly ApplicationDbContext _db; // create object of ApplicationDbContext class

    public CategoryController(ApplicationDbContext db) // constructor
    {
        _db = db;
    }

    public IActionResult Index(){
        // var objCategoryList = _db.Categories.ToList();
        IEnumerable<Category> objCategoryList = _db.Categories;
        return View(objCategoryList);  
    }

    // GET - CREATE
    public IActionResult Create(){
        return View();
    }

    // POST - CREATE
    [HttpPost]
    [ValidateAntiForgeryToken]
    public IActionResult Create(Category objCategory){
        if(objCategory.Name == objCategory.DisplayOrder.ToString()){
            ModelState.AddModelError("name", "Name and Display Order cannot be the same");
        }
        if(ModelState.IsValid){
            _db.Categories.Add(objCategory);
            _db.SaveChanges();
            return RedirectToAction("Index");
        }
        return View(objCategory);
    }

    // GET - CREATE
    public IActionResult Edit(int? id){
        if(id == null){
            return NotFound();
        }
        var categoryFromDb = _db.Categories.Find(id);
        // var categoryFromDbFirst = _db.Categories.FirstOrDefault(c => c.Id == id);
        // var categoryFromDbSingle = _db.Categories.SingleOrDefault(c => c.Id == id);
        if(categoryFromDb == null){
            return NotFound();
        }

        return View(categoryFromDb);
    }

    // POST - CREATE
    [HttpPost]
    [ValidateAntiForgeryToken]
    public IActionResult Edit(Category objCategory){
        if(objCategory.Name == objCategory.DisplayOrder.ToString()){
            ModelState.AddModelError("name", "Name and Display Order cannot be the same");
        }
        if(ModelState.IsValid){
            _db.Categories.Update(objCategory); // it will find primary key
            _db.SaveChanges();
            return RedirectToAction("Index");
        }
        return View(objCategory);
    }

        // GET - CREATE
    public IActionResult Delete(int? id){
        if(id == null){
            return NotFound();
        }
        var categoryFromDb = _db.Categories.Find(id); //same with Edit
        // var categoryFromDbFirst = _db.Categories.FirstOrDefault(c => c.Id == id);
        // var categoryFromDbSingle = _db.Categories.SingleOrDefault(c => c.Id == id);
        if(categoryFromDb == null){
            return NotFound();
        }

        return View(categoryFromDb);
    }

    // POST - CREATE
    [HttpPost, ActionName("Delete")]
    [ValidateAntiForgeryToken]
    public IActionResult DeletePOST(int? id){
        var obj = _db.Categories.Find(id);
        if(obj == null){
            return NotFound();
        }
        _db.Categories.Remove(obj); // it will find primary key
        _db.SaveChanges(); 
        TempData["Success"] = "Category Deleted Successfully";
        return RedirectToAction("Index");
    }



}
