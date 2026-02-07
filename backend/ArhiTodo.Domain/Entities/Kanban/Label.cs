using ArhiTodo.Domain.Common.Errors;
using ArhiTodo.Domain.Common.Result;

namespace ArhiTodo.Domain.Entities.Kanban;

public class Label
{
    public int BoardId { get; private set; }
    
    public int LabelId { get; private set; }
    public int LabelColor { get; private set; }
    public string LabelText { get; private set; } = string.Empty;

    private Label() { }

    private Label(int boardId, string labelText, int labelColor)
    {
        BoardId = boardId;
        LabelText = labelText;
        LabelColor = labelColor;
    }
    
    private static Result ValidateLabelName(string name)
    {
        if (string.IsNullOrWhiteSpace(name) || name.Length < 1 || name.Length > 24)
        {
            return new Error("InvalidLabelName", ErrorType.BadRequest, "The Label name must contain between 1-24 characters!");
        }

        return Result.Success();
    }

    public static Result<Label> Create(int boardId, string labelText, int labelColor)
    {
        Result validateLabelNameResult = ValidateLabelName(labelText);
        return validateLabelNameResult.IsSuccess
            ? new Label(boardId, labelText, labelColor)
            : validateLabelNameResult.Error!;
    }

    public Result RenameLabel(string labelText)
    {
        Result validateLabelNameResult = ValidateLabelName(labelText);
        if (!validateLabelNameResult.IsSuccess) return validateLabelNameResult;
        
        LabelText = labelText;
        return Result.Success();
    }

    public void ChangeLabelColor(int labelColor)
    {
        LabelColor = labelColor;
    }
}