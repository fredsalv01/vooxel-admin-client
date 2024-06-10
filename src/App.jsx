import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import Layout from './components/shared/Layout'
import Dashboard from './modules/dashboard/Dashboard'
import { Login, Register } from './auth'
import ProtectedRoute from './components/validation/requireAuth'

import { WorkerList, DetailWorkerPage } from './modules/workers/pages'

import { UserList } from './modules/users/pages/UserList'
import { ClientList, DetailClientPage } from './modules/clients/pages'
import { ClientServiceList } from './modules/client-services/pages/ClientServiceList'
import { BillingList } from './modules/billing/pages/BillingList'

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
                    <Route path="workers" element={<WorkerList />} />
                    <Route path="users" element={<UserList />} />
                    <Route path="workers/:id/detail" element={<DetailWorkerPage />} />
                    <Route path="clients/:id/detail" element={<DetailClientPage />} />
                    <Route path="clients" element={<ClientList />} />
                    <Route path="services" element={<ClientServiceList />} />
                    <Route path="billing" element={<BillingList />} />
                </Route>
            </Routes>
        </Router>
    )
}

export default App
