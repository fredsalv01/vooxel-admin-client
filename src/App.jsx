import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import Layout from './components/shared/Layout'
import Dashboard from './pages/dashboard/Dashboard'
import Login from './pages/login/Login'
import Register from './pages/register/Register'
import Workers from './pages/workers/Workers'
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
                    <Route index element={<Dashboard />} />
                    <Route path="workers" element={<Workers />} />
                </Route>
            </Routes>
        </Router>
    )
}

export default App
