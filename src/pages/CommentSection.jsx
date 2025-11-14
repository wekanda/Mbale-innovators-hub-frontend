import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import AuthContext from '../context/AuthContext';
import Spinner from '../components/Spinner';

const CommentSection = ({ projectId }) => {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { user } = useContext(AuthContext);
  const API_URL = import.meta.env.VITE_REACT_APP_API_URL || '';

  const fetchComments = async () => {
    try {
      const res = await axios.get(`${API_URL}/api/projects/${projectId}/comments`);
      setComments(Array.isArray(res.data.data) ? res.data.data : []);
    } catch (err) {
      setError('Failed to load comments.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (projectId) {
      fetchComments();
    }
  }, [projectId]);

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    const token = localStorage.getItem('token');
    if (!token) {
      setError('You must be logged in to comment.');
      return;
    }

    try {
      await axios.post(
        `${API_URL}/api/projects/${projectId}/comments`,
        { text: newComment },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setNewComment('');
      // Refetch comments to show the new one
      fetchComments();
    } catch (err) {
      setError('Failed to post comment. Please try again.');
      console.error(err);
    }
  };

  if (loading) return <Spinner />;
  if (error) return <p style={{ color: 'red' }}>{error}</p>;

  return (
    <div className="comment-section">
      <hr />
      <h4>Feedback & Comments</h4>
      <form onSubmit={handleCommentSubmit} className="comment-form">
        <textarea
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder="Leave your feedback..."
          required
          rows="3"
        />
        <button type="submit" className="btn">Post Comment</button>
      </form>
      <div className="comments-list">
        {comments.length > 0 ? (
          comments.map((comment) => (
            <div key={comment._id} className="comment">
              <p className="comment-text">{comment.text}</p>
              <small className="comment-author">
                By: {comment.user?.name ?? 'Anonymous'} on {new Date(comment.createdAt).toLocaleDateString()}
              </small>
            </div>
          ))
        ) : (
          <p>Be the first to leave a comment!</p>
        )}
      </div>
    </div>
  );
};

export default CommentSection;