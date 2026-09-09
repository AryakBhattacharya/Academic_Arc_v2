import { Routes, Route } from 'react-router-dom'
import Login from './pages/Login'
import Signup from './pages/Signup'
import Dashboard from './pages/Dashboard'
import Profile from './pages/Profile'
import Submit from './pages/Submit'
import Category from './pages/Category'
import AdminDashboard from './pages/AdminDashboard'
import AdminPosts from './pages/AdminPosts'
import AdminPostView from './pages/AdminPostView'
import AdminCategories from './pages/AdminCategories'

function App() {
  return (
    <Routes>
      <Route path="/" element={<Dashboard />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/profile" element={<Profile />} />
      <Route path="/submit" element={<Submit />} />
      <Route path="/category/:type" element={<Category />} />
      <Route path="/admin" element={<AdminDashboard />} />
      <Route path="/admin/posts" element={<AdminPosts />} />
      <Route path="/admin/posts/:id" element={<AdminPostView />} />
      <Route path="/admin/categories" element={<AdminCategories />} />
    </Routes>
  )
}

export default App