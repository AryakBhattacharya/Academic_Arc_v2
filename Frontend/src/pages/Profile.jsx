import { useEffect, useState } from 'react'
import { Navigate } from 'react-router-dom'

function Profile() {
    const token = localStorage.getItem('access_token')
        if (!token) {
            return <Navigate to="/login" replace />
        }

    const [user, setUser] = useState(null)
    const [error, setError] = useState('')

        useEffect(() => {
            const token = localStorage.getItem('access_token')

            if (!token) {
            setError('You must be logged in to view your profile.')
            return
            }

            fetch('http://127.0.0.1:8000/auth/me', {
            headers: {
                Authorization: `Bearer ${token}`,
            },
            })
            .then((response) => {
                if (!response.ok) {
                throw new Error('Could not load profile.')
                }

                return response.json()
            })
            .then((data) => {
                setUser(data)
            })
            .catch((err) => {
                setError(err.message)
            })
        }, [])

        if (error) {
            return <p>{error}</p>
        }

        if (!user) {
            return <p>Loading profile...</p>
        }

        return (
            <div>
            <h1>My Profile</h1>

            <p><strong>Name:</strong> {user.name}</p>
            <p><strong>Email:</strong> {user.email}</p>
            <p><strong>Phone:</strong> {user.phone}</p>

            <p>
                <strong>Student:</strong>{' '}
                {user.is_student ? 'Yes' : 'No'}
            </p>

            {user.student && (
                <div>
                <h2>Student Information</h2>

                <p>
                    <strong>Date of Birth:</strong> {user.student.dob}
                </p>

                <p>
                    <strong>School:</strong> {user.student.school}
                </p>

                <p>
                    <strong>Class:</strong> {user.student.student_class}
                </p>
                </div>
            )}
            </div>
        )
    }

export default Profile