import { useState } from 'react'

function Login() {
  const [identifier, setIdentifier] = useState('')
  const [password, setPassword] = useState('')

  const handleLogin = async (e) => {
    e.preventDefault()

    try {
        const response = await fetch('http://127.0.0.1:8000/auth/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                identifier,
                password,
            }),
        })

        const data = await response.json()

        console.log(data)

        if (!response.ok) {
            alert(data.detail || 'Login failed')
            return
        }

        localStorage.setItem('access_token', data.access_token)

        alert('Login successful!')
    }   catch (error) {
        console.error(error)
        alert('Could not connect to the backend')
    }
}

  return (
    <div>
      <h1>Login</h1>

      <form onSubmit={handleLogin}>
        <div>
          <label>Email or Phone Number</label>
          <input
            type="text"
            value={identifier}
            onChange={(e) => setIdentifier(e.target.value)}
            required
          />
        </div>

        <div>
          <label>Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        <button type="submit">Login</button>
      </form>
    </div>
  )
}

export default Login