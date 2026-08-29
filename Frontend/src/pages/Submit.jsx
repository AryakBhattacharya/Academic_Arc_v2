import { useState } from 'react'
import { Navigate } from 'react-router-dom'

function Submit() {

    const token = localStorage.getItem('access_token')

    if (!token) {
        return <Navigate to="/login" replace />
    }

    const [contentType, setContentType] = useState('Writing')
    const [studentClass, setStudentClass] = useState('')
    const [heading, setHeading] = useState('')
    const [description, setDescription] = useState('')
    const [writtenContent, setWrittenContent] = useState('')
    const [message, setMessage] = useState('')
    const [file, setFile] = useState(null)

    const handleSubmit = async (e) => {
        e.preventDefault()

        const token = localStorage.getItem('access_token')

        if (!token) {
            setMessage('Please login first.')
            return
        }

        try {
            const response = await fetch('http://127.0.0.1:8000/submissions/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                    content_type: contentType,
                    student_class: studentClass,
                    heading: heading,
                    description: description,
                    written_content: writtenContent,
                }),
            })

            const data = await response.json()

            if (!response.ok) {
                setMessage(JSON.stringify(data.detail))
                return
            }

            if (file) {
                const uploadData = new FormData()
                uploadData.append('file', file)

                const uploadResponse = await fetch(
                    `http://127.0.0.1:8000/submissions/upload?submission_id=${data.submission_id}`,
                    {
                        method: 'POST',
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                        body: uploadData,
                    }
                )

                const uploadResult = await uploadResponse.json()

                if (!uploadResponse.ok) {
                    setMessage(JSON.stringify(uploadResult.detail))
                    return
                }
            }

            setMessage('Submission created successfully!')

            setStudentClass('')
            setHeading('')
            setDescription('')
            setWrittenContent('')
            setFile(null)

        }   catch (error) {
            console.error(error)
            setMessage('Could not connect to the backend.')
        }
    }

    return (
        <div>
            <h1>Submit Content</h1>

            <form onSubmit={handleSubmit}>
                <label>Content Type</label>
                <select
                    value={contentType}
                    onChange={(e) => setContentType(e.target.value)}
                >
                    <option value="Writing">Writing</option>
                    <option value="Drawing">Drawing</option>
                    <option value="Poem">Poem</option>
                    <option value="Instruments">Instruments</option>
                    <option value="Singing">Singing</option>
                    <option value="Dance">Dance</option>
                </select>

                <br /><br />

                <label>Class</label>
                <input
                    value={studentClass}
                    onChange={(e) => setStudentClass(e.target.value)}
                    required
                />

                <br /><br />

                <label>Heading</label>
                <input
                    value={heading}
                    onChange={(e) => setHeading(e.target.value)}
                    required
                />

                <br /><br />

                <label>Description</label>
                <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                />

                <br /><br />

                <label>Written Content</label>
                <textarea
                    value={writtenContent}
                    onChange={(e) => setWrittenContent(e.target.value)}
                    rows="8"
                />

                <br /><br />

                <label>Media</label>
                <input
                    type="file"
                    onChange={(e) => setFile(e.target.files[0])}
                />

                <br /><br />

                <button type="submit">Submit</button>
            </form>

            {message && <p>{message}</p>}
        </div>
    )
}

export default Submit