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
        const filtered = data
          .filter(
            (submission) =>
              submission.content_type === categoryName
          )
          .sort(
            (a, b) =>
              new Date(b.created_at) - new Date(a.created_at)
          )

        setSubmissions(filtered)
      })
      .catch((error) => {
        console.error('Error fetching submissions:', error)
      })
  }, [categoryName])

  const isVideoType = (submission) => {
    const type = submission.content_type?.toLowerCase()

    return (
      type === 'song' ||
      type === 'dance' ||
      type === 'instrumental'
    )
  }

  const isUploadedVideo = (url) => {
    if (!url) return false

    return /\.(mp4|webm|ogg|mov)(\?.*)?$/i.test(url)
  }

  const getEmbedUrl = (url) => {
    if (!url) return null

    // YouTube
    if (url.includes('youtube.com/watch')) {
      try {
        const videoId = new URL(url).searchParams.get('v')

        if (videoId) {
          return `https://www.youtube.com/embed/${videoId}`
        }
      } catch {
        return null
      }
    }

    // YouTube shortened URL
    if (url.includes('youtu.be/')) {
      const videoId = url
        .split('youtu.be/')[1]
        .split(/[?&]/)[0]

      if (videoId) {
        return `https://www.youtube.com/embed/${videoId}`
      }
    }

    // Facebook
    if (url.includes('facebook.com')) {
      return `https://www.facebook.com/plugins/video.php?href=${encodeURIComponent(
        url
      )}&show_text=false`
    }

    // Google Drive
    if (url.includes('drive.google.com')) {
      const match = url.match(/\/file\/d\/([^/]+)/)

      if (match) {
        return `https://drive.google.com/file/d/${match[1]}/preview`
      }

      try {
        const fileId = new URL(url).searchParams.get('id')

        if (fileId) {
          return `https://drive.google.com/file/d/${fileId}/preview`
        }
      } catch {
        return null
      }
    }

    return null
  }

  return (
    <div className="category-page">

      <nav className="navbar">

        <Link to="/" className="nav-logo">
          Academic Arc
        </Link>

        <div className="nav-links">

          <Link to="/">
            Home
          </Link>

          <Link to="/profile">
            Profile
          </Link>

        </div>

      </nav>


      <main className="category-container">

        <div className="category-heading">

          <h1>
            {categoryName}
          </h1>

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

            {submissions.map((submission) => {

              const videoType = isVideoType(submission)
              const uploadedVideo = isUploadedVideo(
                submission.media_url
              )
              const embedUrl = getEmbedUrl(
                submission.media_url
              )

              return (

                <article
                  key={submission.id}
                  className="submission-card"
                >

                  {/* POST HEADER */}

                  <div className="submission-header">

                    <div className="submission-avatar">
                      {submission.profile_picture ? (
                        <img
                          src={submission.profile_picture}
                          alt={submission.student_name}
                        />
                      ) : (
                        submission.student_name
                          ? submission.student_name.charAt(0).toUpperCase()
                          : 'S'
                      )}
                    </div>


                    <div className="submission-meta">

                      <strong>
                        {submission.student_name}
                      </strong>

                      <span>
                        Class {submission.student_class} • {submission.school}
                      </span>

                      <small>
                        Published on{' '}
                        {submission.created_at &&
                          new Date(
                            submission.created_at
                          ).toLocaleDateString('en-IN', {
                            day: 'numeric',
                            month: 'short',
                            year: 'numeric'
                          })}
                      </small>

                    </div>


                    <span className="submission-menu">
                      •••
                    </span>

                  </div>


                  {/* IMAGE */}

                  {!videoType &&
                    submission.media_url && (

                      <div className="submission-image">

                        <img
                          src={submission.media_url}
                          alt={submission.heading}
                        />

                      </div>

                    )}


                  {/* NATIVE VIDEO UPLOAD */}

                  {videoType &&
                    uploadedVideo && (

                      <div className="submission-video">

                        <video controls>

                          <source
                            src={submission.media_url}
                          />

                          Your browser does not support
                          video playback.

                        </video>

                      </div>

                    )}


                  {/* VIDEO LINK */}

                  {videoType &&
                    !uploadedVideo &&
                    embedUrl && (

                      <div className="submission-video">

                        <iframe
                          src={embedUrl}
                          title={submission.heading}
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                          allowFullScreen
                        />

                      </div>

                    )}


                  {/* UNSUPPORTED VIDEO LINK */}

                  {videoType &&
                    !uploadedVideo &&
                    !embedUrl &&
                    submission.media_url && (

                      <div className="submission-link">

                        <a
                          href={submission.media_url}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          Open video ↗
                        </a>

                      </div>

                    )}


                  {/* POST TEXT */}

                  <div className="submission-content">

                    <h2>
                      {submission.heading}
                    </h2>

                    {submission.description && (
                      <p>
                        {submission.description}
                      </p>
                    )}


                    {/* WRITING / POEM CONTENT */}

                    {submission.written_content && (

                      <div className="written-content-box">

                        <div className="written-content">

                          {submission.written_content}

                        </div>

                      </div>

                    )}

                  </div>

                </article>

              )
            })}

          </div>

        )}

      </main>

    </div>
  )
}

export default Category