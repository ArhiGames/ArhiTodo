using ArhiTodo.Application.DTOs.Label;
using ArhiTodo.Application.Services.Interfaces.Kanban;
using ArhiTodo.Domain.Common.Result;
using ArhiTodo.Domain.Entities.DTOs;
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
        return labelGetDto.IsSuccess ? Ok(labelGetDto.Value) : HandleFailure(labelGetDto);
    }

    [HttpPatch("board/{boardId:int}/label/{labelId:int}/move/{location:int}")]
    public async Task<IActionResult> MoveLabel(int boardId, int labelId, int location)
    {
        Result moveLabelResult = await labelService.MoveLabel(boardId, labelId, location);
        return moveLabelResult.IsSuccess ? Ok() : HandleFailure(moveLabelResult);
    }

    [HttpDelete("board/{boardId:int}/label/{labelId:int}")]
    public async Task<IActionResult> DeleteLabel(int boardId, int labelId)
    {
        Result deleteLabelResult = await labelService.DeleteLabel(boardId, labelId);
        return deleteLabelResult.IsSuccess ? NoContent() : HandleFailure(deleteLabelResult);
    }
}