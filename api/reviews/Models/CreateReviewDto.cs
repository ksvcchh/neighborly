namespace reviews.Models;

public class CreateReviewDto
{
    public required string TaskId { get; set; }
    public required string ReviewerUserId { get; set; }
    public required string RevieweeUserId { get; set; }
    public int RatingScore { get; set; }
    public required string CommentText { get; set; }
}