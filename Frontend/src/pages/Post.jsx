import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'

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
        <div>
            <p>{error}</p>
            <Link to="/dashboard">Back to Home</Link>
        </div>
        )
    }

    if (!post) {
        return <p>Loading...</p>
    }

    return (
        <div>
            <Link to="/dashboard">← Back to Home</Link>

            <h1>{post.heading}</h1>

            <p>{post.description}</p>

            {post.written_content && (
                <div>
                <p>{post.written_content}</p>
                </div>
            )}

            {post.media_url && (
                <div>
                <img
                    src={post.media_url}
                    alt={post.heading}
                    style={{ maxWidth: '800px', width: '100%' }}
                />
                </div>
            )}

            <p>
                <small>
                    Published on{' '}
                    {new Date(post.created_at).toLocaleDateString()}
                </small>
            </p>
        </div>
    )
}

export default Post