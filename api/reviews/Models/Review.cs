using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace reviews.Models
{
     public class Review
    {
        public required string Id { get; set; }
        public required string TaskId { get; set; }
        public required string ReviewerUserId { get; set; }
        public required string RevieweeUserId { get; set; }
        public int RatingScore { get; set; }
        public required string CommentText { get; set; }
        public DateTime CreatedAt { get; set; }
    }
}