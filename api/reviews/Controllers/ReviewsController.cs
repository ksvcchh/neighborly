using Microsoft.AspNetCore.Mvc;
using reviews.Models;
using System.Text.RegularExpressions;
using Microsoft.EntityFrameworkCore;

namespace reviews.Controllers
{
    [Route("[controller]")]
    [ApiController]
    public partial class ReviewsController(ApplicationDbContext context) : ControllerBase
    {
        [GeneratedRegex("^[0-9a-fA-F]{24}$")]
        private static partial Regex Hex24Regex();
        
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Review>>> GetReviews()
        {
            var reviews = await context.Reviews.OrderBy(r => r.Id).ToListAsync();
            return Ok(reviews);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<Review>> GetReview(string id)
        {
            var review = await context.Reviews.FindAsync(id);
            if (review == null)
            {
                return NotFound();
            }
            return Ok(review);
        }

        [HttpPost]
        public async Task<ActionResult<Review>> CreateReview([FromBody] CreateReviewDto reviewDto)
        {
            if (!IsObjectId(reviewDto.TaskId) || !IsObjectId(reviewDto.RevieweeUserId) ||
                !IsObjectId(reviewDto.ReviewerUserId))
            {
                return BadRequest("One of given IDs from the request body is not an ObjectID.");
            }

            var review = new Review
            {
                Id = Guid.NewGuid().ToString("N").Substring(0, 24),
                TaskId = reviewDto.TaskId,
                ReviewerUserId = reviewDto.ReviewerUserId,
                RevieweeUserId = reviewDto.RevieweeUserId,
                RatingScore = reviewDto.RatingScore,
                CommentText = reviewDto.CommentText,
                CreatedAt = DateTime.UtcNow
            };

            context.Reviews.Add(review);
            await context.SaveChangesAsync();
            
            try
            {
                using var client = new HttpClient();
                var gw = Environment.GetEnvironmentVariable("GATEWAY_URL") ??
                         "http://gateway:3241";
                await client.PostAsync($"{gw}/events/review-created", null);
            }
            catch { /* ignore */ }

            return CreatedAtAction(nameof(GetReview), new { id = review.Id }, review);
        }

        [HttpPatch("{id}")]
        public async Task<IActionResult> UpdateReview(string id, [FromBody] PatchReviewDto patchDto)
        {
            var reviewToUpdate = await context.Reviews.FindAsync(id);

            if (reviewToUpdate == null)
            {
                return NotFound();
            }

            if (patchDto.TaskId is not null)
            {
                if (!IsObjectId(patchDto.TaskId))
                    return BadRequest(
                        "TaskId must be a 24-character hexadecimal string."
                    );
                reviewToUpdate.TaskId = patchDto.TaskId;
            }

            if (patchDto.ReviewerUserId is not null)
            {
                if (!IsObjectId(patchDto.ReviewerUserId))
                    return BadRequest(
                        "ReviewerUserId must be a 24-character hexadecimal string."
                    );
                reviewToUpdate.ReviewerUserId = patchDto.ReviewerUserId;
            }

            if (patchDto.RevieweeUserId is not null)
            {
                if (!IsObjectId(patchDto.RevieweeUserId))
                    return BadRequest(
                        "RevieweeUserId must be a 24-character hexadecimal string."
                    );
                reviewToUpdate.RevieweeUserId = patchDto.RevieweeUserId;
            }

            if (patchDto.RatingScore is not null)
            {
                reviewToUpdate.RatingScore = patchDto.RatingScore.Value;
            }

            if (patchDto.CommentText is not null)
            {
                reviewToUpdate.CommentText = patchDto.CommentText;
            }

            await context.SaveChangesAsync();

            return NoContent();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteReview(string id)
        {
            var reviewToDelete = await context.Reviews.FindAsync(id);
            if (reviewToDelete == null)
            {
                return NotFound();
            }

            context.Reviews.Remove(reviewToDelete);
            await context.SaveChangesAsync();

            return NoContent();
        }
        
        private Boolean IsObjectId(string id)
        {
            return Hex24Regex().IsMatch(id);
        }
    }
}