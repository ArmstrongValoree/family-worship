import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
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
      <Routes>
        <Route path={ROUTES.LOGIN} element={<LoginPage />} />
        <Route path={ROUTES.REGISTER} element={<RegisterPage />} />
        <Route path={ROUTES.JOIN} element={<JoinHouseholdPage />} />
        <Route path={ROUTES.HOME} element={<DashboardPage />} />
        <Route path={ROUTES.CREATE_HOUSEHOLD} element={<CreateHouseholdPage />} />
        <Route path={ROUTES.CALENDAR} element={<CalendarPage />} />
        <Route path={ROUTES.STUDY} element={<StudyMaterialPage />} />
        <Route path={ROUTES.TOPICS} element={<TopicSelectionPage />} />
        <Route path={ROUTES.FEEDBACK} element={<FeedbackPage />} />
        <Route path={ROUTES.PROFILE} element={<ProfilePage />} />
        <Route path="*" element={<Navigate to={ROUTES.LOGIN} replace />} />
      </Routes>
    </BrowserRouter>
  )
}
