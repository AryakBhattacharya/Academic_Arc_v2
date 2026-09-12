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
import AdminFeatured from './pages/AdminFeatured'
import AdminUsers from './pages/AdminUsers'
import AdminUserView from './pages/AdminUserView'

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
      <Route path="/admin/featured" element={<AdminFeatured />} />
      <Route path="/admin/users" element={<AdminUsers />} />
      <Route path="/admin/users/:user_id" element={<AdminUserView />} />
    </Routes>
  )
}

export default App