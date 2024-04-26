import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import Layout from './components/shared/Layout'
import Dashboard from './components/Dashboard'
import Products from './components/Products'
import Login from './components/Login'
import Register from './components/Register'
import Workers from './components/Workers'
import ProtectedRoute from './components/validation/requireAuth'

function App() {
    return (
        <Router>
            <Routes>
                <Route path="login" element={<Login />} />
                <Route path="register" element={<Register />} />
                <Route
                    path="/"
                    element={
                        <ProtectedRoute>
                            <Layout />{' '}
                        </ProtectedRoute>
                    }
                >
                    {/* <Route index element={<Dashboard />} /> */}
                    {/* <Route path="products" element={<Products />} /> */}
                    <Route path="workers" element={<Workers />} />
                </Route>
            </Routes>
        </Router>
    )
}

export default App
