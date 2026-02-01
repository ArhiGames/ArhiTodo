using ArhiTodo.Application.DTOs.Label;
using ArhiTodo.Application.Services.Interfaces.Kanban;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace ArhiTodo.Controllers;

[Authorize]
[ApiController]
[Route("api")]
public class LabelsController(ILabelService labelService) : ControllerBase
{
    [HttpPost("board/{boardId:int}/label")]
    public async Task<IActionResult> CreateLabel(int boardId, [FromBody] LabelCreateDto labelCreateDto)
    {
        LabelGetDto? label = await labelService.CreateLabel(boardId, labelCreateDto);
        if (label == null) return NotFound();
        return Ok(label);
    }
    
    [HttpPut("board/{boardId:int}/label/")]
    public async Task<IActionResult> UpdateLabel(int boardId, [FromBody] LabelUpdateDto labelUpdateDto)
    {
        LabelGetDto? labelGetDto = await labelService.UpdateLabel(boardId, labelUpdateDto);
        if (labelGetDto == null) return NotFound();
        return Ok(labelGetDto);
    }

    [HttpDelete("board/{boardId:int}/label/{labelId:int}")]
    public async Task<IActionResult> DeleteLabel(int boardId, int labelId)
    {
        bool succeeded = await labelService.DeleteLabel(boardId, labelId);
        if (!succeeded) return NotFound();
        return NoContent();
    }

    [HttpGet("board/{boardId:int}/label")]
    public async Task<IActionResult> GetLabels(int boardId)
    {
        List<LabelGetDto> labels = await labelService.GetEveryLabel(boardId);
        return Ok(labels);
    } 
}