import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import './Login.css'

function Login() {
    const navigate = useNavigate()
    const [identifier, setIdentifier] = useState('')
    const [password, setPassword] = useState('')
    const [showPassword, setShowPassword] = useState(false)

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

            navigate('/dashboard')
        } catch (error) {
            console.error(error)
            alert('Could not connect to the backend')
        }
    }

    return (
        <div className="login-page">

            {/* LEFT SIDE */}
            <div className="login-left">

                <div className="left-content">

                    <div className="quote-mark">"</div>

                    <h2>Education is the foundation of Society.</h2>

                    <div className="stats">

                        <div className="stat-card">
                            <strong>1,240+</strong>
                            <span>Writings Published</span>
                        </div>

                        <div className="stat-card">
                            <strong>86</strong>
                            <span>Schools</span>
                        </div>

                        <div className="stat-card">
                            <strong>36</strong>
                            <span>Total</span>
                        </div>

                    </div>

                </div>

            </div>

            {/* RIGHT SIDE */}
            <div className="login-right">
                
                <button
                    type="button"
                    className="auth-home-button"
                    onClick={() => navigate('/')}
                >
                    ← Go Back
                </button>

                <div className="login-container">

                    <h1>Welcome Back!</h1>

                    <p className="login-subtitle">
                        Log in to your account
                    </p>

                    {/* Login / Signup tabs */}
                    <div className="auth-tabs">
                        <button
                            type="button"
                            className="auth-tab active"
                        >
                            Login
                        </button>

                        <button
                            type="button"
                            className="auth-tab"
                            onClick={() => navigate('/signup')}
                        >
                            Sign Up
                        </button>
                    </div>

                    <form onSubmit={handleLogin}>

                        {/* Email / Phone */}
                        <div className="form-field">
                            <label>
                                Email or Phone Number
                                <span className="required">*</span>
                            </label>

                            <input
                                type="text"
                                value={identifier}
                                onChange={(e) => setIdentifier(e.target.value)}
                                placeholder="Enter your email or phone number"
                                required
                            />
                        </div>

                        {/* Password */}
                        <div className="form-field">
                            <label>
                                Password
                                <span className="required">*</span>
                            </label>

                            <div className="password-wrapper">
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="Enter your password"
                                    required
                                />

                                <button
                                    type="button"
                                    className="password-toggle"
                                    onClick={() =>
                                        setShowPassword(!showPassword)
                                    }
                                >
                                    {showPassword ? '◉' : '◌'}
                                </button>
                            </div>
                        </div>

                        {/* Remember / Forgot */}
                        <div className="login-options">

                            <label className="remember-me">
                                <input type="checkbox" />
                                <span>Remember me</span>
                            </label>

                            <button
                                type="button"
                                className="forgot-password"
                            >
                                Forgot password?
                            </button>

                        </div>

                        {/* Login button */}
                        <button
                            type="submit"
                            className="login-button"
                        >
                            Login
                        </button>

                    </form>

                    <p className="signup-prompt">
                        Don't have an account?

                        <button
                            type="button"
                            onClick={() => navigate('/signup')}
                        >
                            Sign Up
                        </button>
                    </p>

                </div>
            </div>

        </div>
    )
}

export default Login