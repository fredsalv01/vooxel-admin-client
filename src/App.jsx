import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import Layout from './components/shared/Layout'
import Dashboard from './modules/dashboard/Dashboard'
import { Login, Register } from './auth'
import ProtectedRoute from './components/validation/requireAuth'

import {
  WorkerList,
  WorkerDetailPage,
  WorkerVacationsPage,
} from './modules/workers/pages'

import { UserList } from './modules/users/pages/UserList'
import { ClientList, ClientDetailPage } from './modules/clients/pages'
import {
  BillingList,
  CreateBillingPage,
  EditBillingPage,
} from './modules/billing/pages'

import { ProjectList } from './modules/projects/pages'

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
          <Route path="workers/:id/detail" element={<WorkerDetailPage />} />
          <Route
            path="workers/:id/vacations"
            element={<WorkerVacationsPage />}
          />
          <Route path="clients/:id/detail" element={<ClientDetailPage />} />
          <Route path="clients" element={<ClientList />} />
          <Route path="billing" element={<BillingList />} />
          <Route path="billing/create" element={<CreateBillingPage />} />
          <Route path="billing/:id/edit" element={<EditBillingPage />} />
          <Route path="projects" element={<ProjectList />} />
        </Route>
      </Routes>
    </Router>
  )
}

export default App
