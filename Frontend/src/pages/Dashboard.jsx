import { Link } from 'react-router-dom'
import './Dashboard.css'

function Dashboard() {
  const token = localStorage.getItem('access_token')

  const logout = () => {
    localStorage.removeItem('access_token')
    window.location.href = '/'
  }

  const isLoggedIn = !!token

  const categories = [
    {
      title: 'Writing',
      description: 'Stories, essays & creative writing',
      type: 'Writing',
      number: '01',
    },
    {
      title: 'Drawing',
      description: 'Sketches, paintings & illustrations',
      type: 'Drawing',
      number: '02',
    },
    {
      title: 'Poem',
      description: 'Poetry & original compositions',
      type: 'Poem',
      number: '03',
    },
    {
      title: 'Song',
      description: 'Original songs & musical creations',
      type: 'Song',
      number: '04',
    },
    {
      title: 'Instrumental',
      description: 'Instrumental Performances',
      type: 'Instrumental',
      number: '05',
    },
    {
      title: 'Dance',
      description: 'Classical, contemporary & folk dance',
      type: 'Dance',
      number: '06',
    },
  ]

  return (
    <div className="magazine">
      <nav className="dashboard-navbar">
        <Link to="/" className="dashboard-nav-logo">
          Academic Arc
        </Link>

        <div className="dashboard-nav-links">
          <Link to="/">Home</Link>

          <button className="language-button">
            বাংলা
          </button>

          {isLoggedIn ? (
            <>
              <Link to="/submit">Submit</Link>
              <Link to="/profile">Profile</Link>
              <button onClick={logout}>Logout</button>
            </>
          ) : (
            <>
              <Link to="/login">Login</Link>
              <Link to="/signup">Sign Up</Link>
            </>
          )}
        </div>
      </nav>

      <main className="categories-section">
        <div className="section-label">
          • STUDENT CREATIVITY
        </div>

        <h1>Where does your talent belong?</h1>

        <p className="section-description">
          Share your creative work and reach readers, artists and
          audiences who appreciate student talent.
        </p>

        <div className="categories-grid">
          {categories.map((category) => (
            <Link
              key={category.type}
              to={`/category/${encodeURIComponent(category.type)}`}
              className={`category-card category-${category.number}`}
            >
              <div className="category-number">
                {category.number}
              </div>

              <div className="category-content">
                <span className="category-type">
                  {category.type}
                </span>

                <h2>{category.title}</h2>

                <p>{category.description}</p>

                <span className="category-link">
                  Explore →
                </span>
              </div>
            </Link>
          ))}
        </div>
      </main>
    </div>
  )
}

export default Dashboard