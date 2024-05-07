import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import Layout from './components/shared/Layout'
import Dashboard from './modules/dashboard/Dashboard'
import { Login, Register } from './auth'
import ProtectedRoute from './components/validation/requireAuth'

import Workers from './modules/workers/Workers'

import { UserList } from './modules/users/pages/UserList'

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
