import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import './Dashboard.css'

function Dashboard() {
  const token = localStorage.getItem('access_token')

  const logout = () => {
    localStorage.removeItem('access_token')
    window.location.href = '/'
  }

  const [submissions, setSubmissions] = useState([])

  const isLoggedIn = !!token

  useEffect(() => {
    fetch('http://127.0.0.1:8000/submissions/public')
      .then((response) => response.json())
      .then((data) => {
        setSubmissions(data)
      })
      .catch((error) => {
        console.error('Error fetching submissions:', error)
      })
  }, [])

  return (
    <div className="magazine">
      <nav className="navbar">
        <Link to="/" className="nav-logo">
          Academic Arc
        </Link>

        <div className="nav-links">
          <Link to="/">Home</Link>

          {isLoggedIn ? (
            <>
              <Link to="/submit">Submit</Link>
              <Link to="/profile">Profile</Link>
              <button onClick={logout}>Logout</button>
            </>
          ) : (
            <>
              <Link to="/login">Login</Link>
              <Link to="/signup">Sign Up</Link>
            </>
          )}
        </div>
      </nav>

      <header className="magazine-header">
        <h1>Academic Arc</h1>
        <p>Student Magazine</p>
      </header>

      <main className="posts-container">
        <h2>Latest Posts</h2>

        {submissions.length === 0 ? (
          <p>No posts yet.</p>
        ) : (
          <div className="posts-grid">
            {submissions.map((submission) => (
              <Link
                to={`/post/${submission.id}`}
                className="post-link"
              >
                <article className="post-card">
                  {submission.media_url && (
                    <img
                      className="post-image"
                      src={submission.media_url}
                      alt={submission.heading}
                    />
                  )}

                  <div className="post-content">
                    <h3>{submission.heading}</h3>

                    {submission.description && (
                      <p>{submission.description}</p>
                    )}

                    {submission.written_content && (
                      <p>{submission.written_content}</p>
                    )}

                    <small>
                      {new Date(submission.created_at).toLocaleDateString()}
                    </small>
                  </div>
                </article>
              </Link>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}

export default Dashboard