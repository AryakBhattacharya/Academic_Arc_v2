import { useState } from 'react'

function Signup() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    is_student: true,
    dob: '',
    school: '',
    student_class: '',
  })

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target

    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
    })
  }

  const handleSignup = async (e) => {
    e.preventDefault()

    try {
        const dataToSend = {
        ...formData,
        }

        if (!formData.is_student) {
            delete dataToSend.school
            delete dataToSend.student_class
        }

        const response = await fetch('http://127.0.0.1:8000/auth/signup', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(dataToSend),
        })

        const data = await response.json()

        console.log(data)

        if (!response.ok) {
            alert(data.detail || 'Signup failed')
            return
        }

        alert('Signup successful!')
    }   catch (error) {
        console.error(error)
        alert('Could not connect to the backend')
    }
}

  return (
    <div>
      <h1>Sign Up</h1>

      <form onSubmit={handleSignup}>
        <div>
          <label>Name</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </div>

        <div>
          <label>Email</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>

        <div>
          <label>Phone Number</label>
          <input
            type="tel"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            required
          />
        </div>

        <div>
          <label>Password</label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
          />
        </div>

        <div>
          <label>
            <input
              type="checkbox"
              name="is_student"
              checked={formData.is_student}
              onChange={handleChange}
            />
            I am a student
          </label>
        </div>

        <div>
          <label>Date of Birth</label>
          <input
            type="date"
            name="dob"
            value={formData.dob}
            onChange={handleChange}
            required
          />
        </div>

        {formData.is_student && (
          <>
            <div>
              <label>School</label>
              <input
                type="text"
                name="school"
                value={formData.school}
                onChange={handleChange}
                required
              />
            </div>

            <div>
              <label>Class</label>
              <input
                type="text"
                name="student_class"
                value={formData.student_class}
                onChange={handleChange}
                required
              />
            </div>
          </>
        )}

        <button type="submit">Sign Up</button>
      </form>
    </div>
  )
}

export default Signup