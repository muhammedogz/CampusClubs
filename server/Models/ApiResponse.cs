namespace Server.Models;

public class ApiResponse
{
    public bool Status { get; set; }
    public string Message { get; set; }
    public object? Data { get; set; }

    public ApiResponse(bool status, string message, object? data)
    {
        Status = status;
        Message = message;
        Data = data;
    }
}
