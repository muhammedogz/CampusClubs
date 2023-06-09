using Microsoft.AspNetCore.Mvc;
using server.Constants;
using Server.Models;

namespace server.Controllers;

[ApiController]
[Route(Consts.DEFAULT_ROUTE)]
public class FileUploadController : ControllerBase
{
  [HttpPost]
  public async Task<IActionResult> UploadFile([FromForm] IFormFile file)
  {
    Console.WriteLine("FileUploadController.UploadFile");
    if (file == null || file.Length == 0)
      return BadRequest("File is not selected");

    var allowedExtensions = new[] { ".jpg", ".jpeg", ".png" };
    var extension = Path.GetExtension(file.FileName).ToLowerInvariant();

    if (string.IsNullOrEmpty(extension) || !allowedExtensions.Contains(extension))
      return BadRequest("Invalid file type");

    // Check file size - the file should not exceed 8MB
    if (file.Length > 0 && file.Length <= 8388608)
    {
      // Use a GUID to ensure the file name is unique
      string fileName = Guid.NewGuid().ToString() + extension;

      // Construct the path where the file should be saved
      string path = Path.Combine(Directory.GetCurrentDirectory(), "../test-image", fileName);

      // Save the file
      await using (var stream = new FileStream(path, FileMode.Create))
      {
        await file.CopyToAsync(stream);
      }

      return Ok(new ApiResponse(true, "File uploaded successfully", new
      {
        filePath = fileName
      }));
    }
    else
    {
      return BadRequest("File is too large");
    }
  }
}
