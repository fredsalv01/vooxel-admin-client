import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import Layout from './components/shared/Layout'
import Dashboard from './pages/dashboard/Dashboard'
import Login from './pages/login/Login'
import Register from './pages/register/Register'
import ProtectedRoute from './components/validation/requireAuth'

import Workers from './pages/workers/Workers'
import { UserList } from './pages/users/UserList'

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
                    <Route path="users" element={<UserList />} />
                </Route>
            </Routes>
        </Router>
    )
}

export default App
