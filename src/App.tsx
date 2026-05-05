import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import { ProtectedRoute } from './components/auth/ProtectedRoute'
import { ROUTES } from './lib/constants'

import { LoginPage } from './pages/auth/LoginPage'
import { RegisterPage } from './pages/auth/RegisterPage'
import { CreateHouseholdPage } from './pages/onboarding/CreateHouseholdPage'
import { JoinHouseholdPage } from './pages/onboarding/JoinHouseholdPage'
import { DashboardPage } from './pages/DashboardPage'
import { CalendarPage } from './pages/calendar/CalendarPage'
import { StudyMaterialPage } from './pages/study/StudyMaterialPage'
import { TopicSelectionPage } from './pages/topics/TopicSelectionPage'
import { FeedbackPage } from './pages/feedback/FeedbackPage'
import { ProfilePage } from './pages/profile/ProfilePage'

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          {/* Public routes */}
          <Route path={ROUTES.LOGIN} element={<LoginPage />} />
          <Route path={ROUTES.REGISTER} element={<RegisterPage />} />
          <Route path={ROUTES.JOIN} element={<JoinHouseholdPage />} />

          {/* Protected routes */}
          <Route path={ROUTES.HOME} element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
          <Route path={ROUTES.CREATE_HOUSEHOLD} element={<ProtectedRoute><CreateHouseholdPage /></ProtectedRoute>} />
          <Route path={ROUTES.CALENDAR} element={<ProtectedRoute><CalendarPage /></ProtectedRoute>} />
          <Route path={ROUTES.STUDY} element={<ProtectedRoute><StudyMaterialPage /></ProtectedRoute>} />
          <Route path={ROUTES.TOPICS} element={<ProtectedRoute><TopicSelectionPage /></ProtectedRoute>} />
          <Route path={ROUTES.FEEDBACK} element={<ProtectedRoute><FeedbackPage /></ProtectedRoute>} />
          <Route path={ROUTES.PROFILE} element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />

          <Route path="*" element={<Navigate to={ROUTES.LOGIN} replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  )
}
