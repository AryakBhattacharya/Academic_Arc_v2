import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import './Category.css'

function Category() {
  const { type } = useParams()
  const categoryName = decodeURIComponent(type)

  const [submissions, setSubmissions] = useState([])

  useEffect(() => {
    fetch('http://127.0.0.1:8000/submissions/public')
      .then((response) => response.json())
      .then((data) => {
        const filtered = data.filter(
          (submission) =>
            submission.content_type === categoryName
        )

        setSubmissions(filtered)
      })
      .catch((error) => {
        console.error('Error fetching submissions:', error)
      })
  }, [categoryName])

  return (
    <div className="category-page">

      <nav className="navbar">

                <Link to="/" className="nav-logo">
                    Academic Arc
                </Link>

                <div className="nav-links">

                    <Link to="/">Home</Link>
                    
                    <Link to="/profile">Profile</Link>

                    {/*<button className="language-button">
                        বাংলা
                    </button>

                    <button onClick={logout}>
                        Logout
                    </button>*/}

                </div>

            </nav>

      <main className="category-container">

        <div className="category-heading">
          <span>{categoryName}</span>
          <h1>{categoryName}</h1>
          <p>
            Explore student {categoryName.toLowerCase()} submissions.
          </p>
        </div>

        {submissions.length === 0 ? (
          <p className="empty-category">
            No {categoryName.toLowerCase()} submissions yet.
          </p>
        ) : (
          <div className="submission-feed">

            {submissions.map((submission) => (
              <Link
                key={submission.id}
                to={`/post/${submission.id}`}
                className="submission-card"
              >

                <div className="submission-header">

                  <div className="submission-avatar">
                    {submission.student_name
                      ? submission.student_name.charAt(0).toUpperCase()
                      : 'S'}
                  </div>

                  <div className="submission-meta">

                    <strong>
                      {submission.student_name}
                    </strong>

                    <span>
                      Class {submission.student_class} • {submission.school}
                    </span>

                    <small>
                      {submission.created_at &&
                        new Date(submission.created_at).toLocaleDateString('en-IN', {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric'
                        })}
                    </small>

                  </div>

                  <span className="submission-menu">•••</span>

                </div>

                {submission.media_url && (
                  <div className="submission-image">
                    <img
                      src={submission.media_url}
                      alt={submission.heading}
                    />
                  </div>
                )}

                <div className="submission-content">

                  <h2>{submission.heading}</h2>

                  {submission.description && (
                    <p>{submission.description}</p>
                  )}

                  <span className="read-more">
                    Read more →
                  </span>

                </div>

              </Link>
            ))}

          </div>
        )}

      </main>
    </div>
  )
}

export default Category