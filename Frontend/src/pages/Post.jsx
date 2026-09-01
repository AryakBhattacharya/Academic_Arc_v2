import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import './Post.css'

function Post() {
  const { id } = useParams()
  const [post, setPost] = useState(null)
  const [error, setError] = useState('')

  useEffect(() => {
    fetch('http://127.0.0.1:8000/submissions/public')
      .then((response) => response.json())
      .then((data) => {
        const foundPost = data.find(
          (submission) => submission.id === Number(id)
        )

        if (foundPost) {
          setPost(foundPost)
        } else {
          setError('Post not found.')
        }
      })
      .catch(() => {
        setError('Could not load the post.')
      })
  }, [id])

  if (error) {
    return (
      <div className="post-page">
        <div className="post-container">
          <p>{error}</p>
          <Link to="/">← Back to Home</Link>
        </div>
      </div>
    )
  }

  if (!post) {
    return (
      <div className="post-page">
        <div className="post-container">
          <p>Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="post-page">
      <nav className="post-navbar">
        <Link to="/" className="post-logo">
          Academic Arc
        </Link>

        <Link to="/" className="back-link">
          ← Home
        </Link>
      </nav>

      <main className="post-container">

        <div className="post-category">
          {post.content_type}
        </div>

        <h1>{post.heading}</h1>

        {post.description && (
          <p className="post-description">
            {post.description}
          </p>
        )}

        <div className="post-meta">
          Published on{' '}
          {new Date(post.created_at).toLocaleDateString()}
        </div>

        {post.media_url && (
          <div className="post-media">
            <img
              src={post.media_url}
              alt={post.heading}
            />
          </div>
        )}

        {post.written_content && (
          <div className="written-content">
            {post.written_content}
          </div>
        )}

      </main>
    </div>
  )
}

export default Post