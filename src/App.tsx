import { BrowserRouter as Router, Routes, Route, Navigate, Outlet } from 'react-router-dom'
import CampusLayout from './layouts/CampusLayout'
import PublicLayout from './layouts/PublicLayout'
import AdminLayout from './layouts/AdminLayout'

// Pages
import CreditUniversityLanding from './pages/public/CreditUniversityLanding'
import TheGate from './pages/public/TheGate'
import TheGateVariantA from './pages/public/TheGateVariantA'
import TheGateVariantB from './pages/public/TheGateVariantB'
import CampusTour from './pages/public/CampusTour'
import Admissions from './pages/public/Admissions'
import StatusPortal from './pages/public/StatusPortal'
import Tuition from './pages/public/Tuition'
import WelcomeFreshman from './pages/public/WelcomeFreshman'

import StudentDashboard from './pages/StudentDashboard'
import Curriculum from './pages/Curriculum'
// import CreditLab from './pages/CreditLab' // Deprecated in favor of CreditTools
import CoursePlayer from './pages/CoursePlayer'
import Settings from './pages/Settings'
import Community from './pages/Community'
import VisionCenter from './pages/VisionCenter'
import LibraryHome from './pages/library/LibraryHome'
import ArticleView from './pages/library/ArticleView'
import { CreditTools } from '@/pages/CreditTools'
import MooStore from './pages/MooStore'
import AdminDashboard from './pages/admin/AdminDashboard'
import KnowledgeCockpit from './pages/admin/KnowledgeCockpit'
import UserManager from './pages/admin/UserManager'
import Login from './pages/Login'
import DisputePage from './pages/credit-lab/DisputePage'
import SimulatorPage from './pages/credit-lab/SimulatorPage'
import SecurityFreeze from './pages/credit-lab/SecurityFreeze'
import ReportAuditor from './pages/credit-lab/ReportAuditor'
import CreditQuest from './pages/CreditQuest' // Game
import KnowledgeCenter from './pages/KnowledgeCenter'
import ToolsHub from './pages/ToolsHub'
import CreditScoreSimulator from './pages/tools/CreditScoreSimulator'
import DisputeLetterGenerator from './pages/tools/DisputeLetterGenerator'
import InteractiveQuiz from './pages/tools/InteractiveQuiz'
import Analytics from './pages/Analytics'
import LearningPath from './pages/LearningPath'
import Onboarding from './pages/Onboarding'

// Auth
import { AdmissionsProvider } from './context/AdmissionsContext'
import { RequireAuth } from './components/auth/RequireAuth'

import FreshmanClassroom from './pages/classroom/FreshmanClassroom'
import SystemStatus from './components/debug/SystemStatus'


function App() {
    return (
        <AdmissionsProvider>
            <Router>
                <SystemStatus />
                <Routes>
                    {/* Public Front Door */}
                    <Route path="/" element={<CreditUniversityLanding />} />

                    {/* The Gate (Secure Portal) */}
                    <Route path="/gate" element={<TheGate />} />
                    <Route path="/gate-a" element={<TheGateVariantA />} />
                    <Route path="/gate-b" element={<TheGateVariantB />} />

                    <Route element={<PublicLayout />}>
                        <Route path="/onboarding" element={<Onboarding />} />
                        <Route path="/tour" element={<CampusTour />} />
                        <Route path="/apply" element={<Admissions />} />
                        <Route path="/status" element={<StatusPortal />} />
                        <Route path="/tuition" element={<Tuition />} />
                        <Route path="/welcome" element={<WelcomeFreshman />} />
                        <Route path="/login" element={<Login />} />
                        {/* <Route path="/lesson-test" element={<LessonTest />} /> REMOVED */}
                        <Route path="/signup" element={<Admissions />} />
                    </Route>

                    {/* Protected Campus Routes */}
                    <Route path="/dashboard" element={
                        <RequireAuth>
                            <CampusLayout><Outlet /></CampusLayout>
                        </RequireAuth>
                    }>
                        <Route index element={<StudentDashboard />} />
                        <Route path="curriculum" element={<Curriculum />} />
                        <Route path="course/:courseId" element={<CoursePlayer />} />
                        <Route path="class/freshman/:classId" element={<FreshmanClassroom />} />
                        <Route path="learning-path" element={<LearningPath />} />
                        <Route path="analytics" element={<Analytics />} /> {/* User Analytics */}

                        {/* Tools & Resources */}
                        <Route path="tools" element={<ToolsHub />} />
                        <Route path="tools/simulator" element={<CreditScoreSimulator />} />
                        <Route path="tools/score-simulator" element={<CreditScoreSimulator />} />
                        <Route path="tools/dispute" element={<DisputeLetterGenerator />} />
                        <Route path="tools/dispute-generator" element={<DisputeLetterGenerator />} />
                        <Route path="tools/quiz" element={<InteractiveQuiz />} />
                        <Route path="tools/utilization" element={<CreditTools defaultTab="utilization" />} />
                        <Route path="tools/debt-payoff" element={<CreditTools defaultTab="debt" />} />

                        {/* Credit Lab (Restored) */}
                        <Route path="credit-lab" element={<CreditTools />} />
                        <Route path="credit-lab/dispute" element={<DisputePage />} />
                        <Route path="credit-lab/simulator" element={<SimulatorPage />} />
                        <Route path="credit-lab/freeze" element={<SecurityFreeze />} />
                        <Route path="credit-lab/audit" element={<ReportAuditor />} />

                        {/* Legacy Redirects */}
                        <Route path="lab" element={<Navigate to="/dashboard/credit-lab" replace />} />
                        <Route path="lab/dispute" element={<Navigate to="/dashboard/credit-lab/dispute" replace />} />

                        {/* Knowledge & Community */}
                        <Route path="library" element={<LibraryHome />} />
                        <Route path="library/article/:slug" element={<ArticleView />} />
                        <Route path="knowledge" element={<KnowledgeCenter />} />
                        <Route path="community" element={<Community />} />
                        <Route path="vision" element={<VisionCenter />} />
                        <Route path="store" element={<MooStore />} />

                        {/* Games */}
                        <Route path="credit-quest" element={<CreditQuest />} />

                        <Route path="settings" element={<Settings />} />
                    </Route>

                    {/* Admin/Founder Routes */}
                    <Route path="/admin" element={
                        <RequireAuth>
                            <AdminLayout><Outlet /></AdminLayout>
                        </RequireAuth>
                    }>
                        <Route index element={<AdminDashboard />} />
                        <Route path="users" element={<UserManager />} />
                        <Route path="cockpit" element={<KnowledgeCockpit />} />
                    </Route>

                    {/* Catch All */}
                    <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
                <div className="fixed bottom-1 left-1 z-50 text-[10px] text-white/20 pointer-events-none font-mono">
                    v1.0.5 - RESTORED
                </div>
            </Router>
        </AdmissionsProvider >
    )
}

export default App
