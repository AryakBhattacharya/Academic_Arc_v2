import { Routes, Route } from 'react-router-dom'
import Login from './pages/Login'
import Signup from './pages/Signup'
import Dashboard from './pages/Dashboard'
import Profile from './pages/Profile'
import Submit from './pages/Submit'
import Post from './pages/Post'
import Category from './pages/Category'

function App() {
  return (
    <Routes>
      <Route path="/" element={<Dashboard />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/profile" element={<Profile />} />
      <Route path="/submit" element={<Submit />} />
      <Route path="/post/:id" element={<Post />} />
      <Route path="/category/:type" element={<Category />} />
    </Routes>
  )
}

export default App