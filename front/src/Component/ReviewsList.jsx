
import React, { useState } from "react";
import { Star, Trash2, Edit } from "lucide-react";
import axios from "axios";
import Swal from "sweetalert2";

const ReviewsList = ({
  reviews,
  currentUserId,
  onReviewDeleted,
  onReviewUpdated,
}) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [editedComment, setEditedComment] = useState("");
  const [editedRating, setEditedRating] = useState(0);
  const [tempRating, setTempRating] = useState(0); // لاستخدام التأثير عند تمرير الماوس

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const handleDeleteReview = async (reviewId) => {
    const confirm = await Swal.fire({
      title: "Are you sure?",
      text: "This review will be permanently deleted!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    });

    if (!confirm.isConfirmed) return;

    setLoading(true);

    try {
      await axios.delete(`http://localhost:5000/api/reviews/${reviewId}`, {
        withCredentials: true,
        headers: { "Content-Type": "application/json" },
      });

      if (onReviewDeleted) onReviewDeleted(reviewId);

      Swal.fire("Deleted!", "Your review has been deleted.", "success");
    } catch (error) {
      const errorMessage =
        error.response?.data?.message ||
        error.response?.data?.error ||
        "Failed to delete review";
      Swal.fire("Error", errorMessage, "error");
    } finally {
      setLoading(false);
    }
  };
  const handleEditReview = (review) => {
    setEditingId(review._id);
    setEditedComment(review.comment);
    setEditedRating(review.rating); // تعيين التقييم الحالي
  };

  const handleUpdateReview = async (reviewId) => {
    if (!editedComment.trim()) {
      Swal.fire("Warning", "Comment cannot be empty", "warning");
      return;
    }

    const confirm = await Swal.fire({
      title: "Update Review?",
      text: "Are you sure you want to save changes to this review?",
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#2563eb",
      cancelButtonColor: "#6b7280",
      confirmButtonText: "Yes, update it",
    });

    if (!confirm.isConfirmed) return;

    setLoading(true);

    try {
      const response = await axios.put(
        `http://localhost:5000/api/reviews/${reviewId}`,
        {
          comment: editedComment,
          rating: editedRating,
        },
        {
          withCredentials: true,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      setEditingId(null);

      if (onReviewUpdated) {
        onReviewUpdated({
          ...response.data,
          _id: reviewId,
          user: {
            _id: currentUserId,
          },
        });
      }

      Swal.fire("Updated!", "Your review has been updated.", "success");
    } catch (error) {
      const errorMessage =
        error.response?.data?.message ||
        error.response?.data?.error ||
        "Failed to update review";
      Swal.fire("Error", errorMessage, "error");
    } finally {
      setLoading(false);
    }
  };

  const getRatingText = (rating) => {
    switch (rating) {
      case 1:
        return "Poor";
      case 2:
        return "Fair";
      case 3:
        return "Good";
      case 4:
        return "Very Good";
      case 5:
        return "Excellent";
      default:
        return "";
    }
  };

  return (
    <div className="space-y-6">
      {reviews.map((review) => (
        <div key={review._id} className="bg-gray-50 p-4 rounded-lg">
          <div className="flex items-start justify-between">
            <div className="flex items-center mb-2">
              <div className="h-10 w-10 rounded-full bg-gray-200 overflow-hidden mr-3">
                <img
                  src={
                    review.userAvatar
                      ? `http://localhost:5000${review.userAvatar}`
                      : "../assets/pic/User-Icon.jpg"
                  }
                  alt={review.userName}
                  className="h-full w-full object-cover"
                  onError={(e) => {
                    e.target.src = "/images/default-avatar.png";
                  }}
                />
              </div>
              <div>
                <h4 className="font-medium text-gray-800">{review.userName}</h4>
                <div className="flex items-center">
                  <div className="flex mr-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        className={`w-4 h-4 ${
                          review.rating >= star
                            ? "text-yellow-400 fill-yellow-400"
                            : "text-gray-300"
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-xs text-gray-500">
                    {getRatingText(review.rating)} •{" "}
                    {formatDate(review.createdAt)}
                  </span>
                </div>
              </div>
            </div>

            {currentUserId === review.user._id && (
              <div className="flex space-x-2">
                <button
                  onClick={() => handleEditReview(review)}
                  className="text-blue-500 hover:text-blue-700"
                  disabled={loading}
                >
                  <Edit className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDeleteReview(review._id)}
                  className="text-red-500 hover:text-red-700"
                  disabled={loading}
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>

          {editingId === review._id ? (
            <div className="mt-3">
              {/* نجوم تعديل التقييم */}
              <div className="flex mb-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onMouseEnter={() => setTempRating(star)}
                    onMouseLeave={() => setTempRating(0)}
                    onClick={() => setEditedRating(star)}
                    className="focus:outline-none"
                  >
                    <Star
                      className={`w-5 h-5 ${
                        (tempRating || editedRating) >= star
                          ? "text-yellow-400 fill-yellow-400"
                          : "text-gray-300"
                      }`}
                    />
                  </button>
                ))}
                {editedRating > 0 && (
                  <span className="ml-2 text-sm text-gray-600">
                    {getRatingText(editedRating)}
                  </span>
                )}
              </div>

              {/* مربع تعديل التعليق */}
              <textarea
                value={editedComment}
                onChange={(e) => setEditedComment(e.target.value)}
                className="w-full px-3 py-2 border rounded-md"
                rows="3"
              />

              <div className="flex justify-end space-x-2 mt-2">
                <button
                  onClick={() => setEditingId(null)}
                  className="px-3 py-1 border rounded-md"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleUpdateReview(review._id)}
                  className="px-3 py-1 bg-blue-500 text-white rounded-md"
                  disabled={loading}
                >
                  {loading ? "Updating..." : "Update"}
                </button>
              </div>
            </div>
          ) : (
            <p className="text-gray-700 mt-3 pl-1">{review.comment}</p>
          )}
        </div>
      ))}
    </div>
  );
};

export default ReviewsList;