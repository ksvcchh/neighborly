namespace reviews.Models;

public class PatchReviewDto
{
    public string? TaskId { get; set; }
    public string? ReviewerUserId { get; set; }
    public string? RevieweeUserId { get; set; }
    public int? RatingScore { get; set; }
    public string? CommentText { get; set; }
}