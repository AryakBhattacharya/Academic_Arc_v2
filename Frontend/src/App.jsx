import { Routes, Route, Link } from 'react-router-dom'
import Login from './pages/Login'
import Signup from './pages/Signup'
import Dashboard from './pages/Dashboard'
import Submit from './pages/Submit'
import Profile from './pages/Profile'

function Home() {
  return (
    <div>
      <h1>Academic Arc</h1>
      <p>Welcome to Academic Arc</p>

      <Link to="/login">
        <button>Login</button>
      </Link>

      <Link to="/signup">
        <button>Sign Up</button>
      </Link>
    </div>
  )
}

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/submit" element={<Submit />} />
      <Route path="/profile" element={<Profile />} />
    </Routes>
  )
}

export default App