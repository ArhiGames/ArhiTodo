using ArhiTodo.Application.DTOs.Label;
using ArhiTodo.Application.Services.Interfaces.Kanban;
using ArhiTodo.Domain.Common.Result;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace ArhiTodo.Controllers.Kanban;

[Authorize]
[ApiController]
[Route("api")]
public class LabelsController(ILabelService labelService) : ApiControllerBase
{
    [HttpPost("board/{boardId:int}/label")]
    public async Task<IActionResult> CreateLabel(int boardId, [FromBody] LabelCreateDto labelCreateDto)
    {
        Result<LabelGetDto> createLabelResult = await labelService.CreateLabel(boardId, labelCreateDto);
        return createLabelResult.IsSuccess ? Ok(createLabelResult.Value) : HandleFailure(createLabelResult);
    }
    
    [HttpPut("board/{boardId:int}/label/")]
    public async Task<IActionResult> UpdateLabel(int boardId, [FromBody] LabelUpdateDto labelUpdateDto)
    {
        Result<LabelGetDto> labelGetDto = await labelService.UpdateLabel(boardId, labelUpdateDto);
        return labelGetDto.IsSuccess ? Ok(labelGetDto) : HandleFailure(labelGetDto);
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
        List<LabelGetDto>? labels = await labelService.GetEveryLabel(boardId);
        if (labels == null) return NotFound();
        return Ok(labels);
    } 
}