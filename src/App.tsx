import { BrowserRouter as Router, Routes, Route, Navigate, Outlet } from 'react-router-dom'
import { SpeedInsights } from "@vercel/speed-insights/react"
import { Analytics as VercelAnalytics } from "@vercel/analytics/react"
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
import DormWeek from './pages/public/DormWeek'
import DormWeekPreReg from './nodes/DormWeekPreReg/DormWeekPreReg'
import CreditPositionSnapshot from './pages/worksheets/CreditPositionSnapshot'
import StrategicMoveWorksheet from './pages/worksheets/StrategicMoveWorksheet'
import BurnRitualWorksheet from './pages/worksheets/BurnRitualWorksheet'
import ApprovalFormulaWorksheet from './pages/worksheets/ApprovalFormulaWorksheet'
import ArchitectOathWorksheet from './pages/worksheets/ArchitectOathWorksheet'
import BureauControlWorksheet from './pages/worksheets/BureauControlWorksheet'
import FundingSecuredWorksheet from './pages/worksheets/FundingSecuredWorksheet'
import WealthSystemsWorksheet from './pages/worksheets/WealthSystemsWorksheet'

import StudentDashboard from './pages/StudentDashboard'
import Curriculum from './pages/Curriculum'
// import CreditLab from './pages/CreditLab' // Deprecated in favor of CreditTools
import CoursePlayer from './pages/CoursePlayer'
import Settings from './pages/Settings'
import Community from './pages/Community'
import VisionCenter from './pages/VisionCenter'
import LibraryHome from './pages/library/LibraryHome'
import Orientation from './pages/Orientation'
import OrientationWhite from './pages/OrientationWhite'
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
import TheVault from './pages/TheVault'
import NeuralNetwork from './pages/NeuralNetwork'
import LectureHall from './pages/LectureHall'
import CreditQuest from './pages/CreditQuest'
import KnowledgeCenter from './pages/KnowledgeCenter'
import ToolsHub from './pages/ToolsHub'
import DreamArchitect from './pages/DreamArchitect'
import CreditScoreSimulator from './pages/tools/CreditScoreSimulator'
import DisputeLetterGenerator from './pages/tools/DisputeLetterGenerator'
import InteractiveQuiz from './pages/tools/InteractiveQuiz'
import Analytics from './pages/Analytics'
import LearningPath from './pages/LearningPath'
import FinancialNervousSystem from './pages/FinancialNervousSystem'
import Onboarding from './pages/Onboarding'
import CreditUtilizationCalculator from './pages/tools/CreditUtilizationCalculator'
import DebtToIncomeCalculator from './pages/tools/DebtToIncomeCalculator'
import ConsumerLaw from './pages/library/ConsumerLaw'
import LetterLibrary from './pages/library/LetterLibrary'
import IdentityTheftCenter from './pages/credit-lab/IdentityTheftCenter'
import CertificateDownload from './pages/CertificateDownload'
import ReferralDashboard from './pages/ReferralDashboard'
import AdminReferralLog from './pages/admin/AdminReferralLog'

import DeansHonorRoll from './pages/campus/DeansHonorRoll'
import VisibilityStrategyLab from './pages/campus/VisibilityStrategyLab'
import VoiceTrainingLab from './pages/campus/VoiceTrainingLab'

// Auth
import { AdmissionsProvider } from './context/AdmissionsContext'
import { ProfileProvider } from './context/ProfileContext'
import { RequireAuth } from './components/auth/RequireAuth'

import FreshmanClassroom from './pages/classroom/FreshmanClassroom'

import { NodeRoutes, AdminNodeRoutes } from './nodes/NodeRouter'

function App() {
    return (
        <ProfileProvider>
            <AdmissionsProvider>
                <Router>
                    {/* <SystemStatus /> */}
                    <Routes>
                        {/* Public Front Door */}
                        <Route path="/" element={<CreditUniversityLanding />} />
                        <Route path="/dorm-week" element={<DormWeek />} />
                        <Route path="/pre-reg" element={<DormWeekPreReg />} />

                        {/* The Gate (Secure Portal) */}
                        <Route path="/gate" element={<TheGate />} />
                        <Route path="/gate-a" element={<TheGateVariantA />} />
                        <Route path="/gate-b" element={<TheGateVariantB />} />

                        {/* New Mandatory Orientation (Placeholder) */}
                        <Route path="/onboarding" element={<Onboarding />} />
                        {/* Orientation: Restored Auth Requirement to ensure Check-In flow */}
                        <Route path="/dashboard/orientation" element={<Orientation />} />
                        <Route path="/dashboard/orientation-white" element={<OrientationWhite />} />

                        <Route element={<PublicLayout />}>
                            <Route path="/tour" element={<CampusTour />} />
                            <Route path="/apply" element={<Admissions />} />
                            <Route path="/status" element={<StatusPortal />} />
                            <Route path="/tuition" element={<Tuition />} />
                            <Route path="/welcome" element={<WelcomeFreshman />} />
                            <Route path="/login" element={<Login />} />
                            <Route path="/signup" element={<Admissions />} />
                            <Route path="/resources/credit-snapshot" element={<CreditPositionSnapshot />} />
                            <Route path="/resources/strategy-execution" element={<StrategicMoveWorksheet />} />
                            <Route path="/resources/burn-ritual" element={<BurnRitualWorksheet />} />
                            <Route path="/resources/approval-formula" element={<ApprovalFormulaWorksheet />} />
                            <Route path="/resources/approval-sequence" element={<ApprovalFormulaWorksheet />} />
                            <Route path="/resources/oath" element={<ArchitectOathWorksheet />} />


                            {/* NEW DORM WEEK ROUTES */}
                            <Route path="/resources/bureau-control" element={<BureauControlWorksheet />} />
                            <Route path="/resources/approval-readiness" element={<FundingSecuredWorksheet />} />
                            <Route path="/resources/wealth-systems" element={<WealthSystemsWorksheet />} />
                            <Route path="/resources/operator-commitment" element={<ArchitectOathWorksheet />} />
                            {/* Expose Credit Lab for Graduates (Public Bypass) */}
                            <Route path="/resources/credit-lab" element={<CreditTools />} />
                            {/* Certificate Download */}
                            <Route path="/certificate" element={<CertificateDownload />} />
                        </Route>
                        <Route path="/dashboard" element={
                            <RequireAuth>
                                <CampusLayout><Outlet /></CampusLayout>
                            </RequireAuth>
                        }>
                            <Route index element={<StudentDashboard />} />
                            {/* Orientation moved to public route */}
                            <Route path="financial-nervous-system" element={<FinancialNervousSystem />} />
                            <Route path="curriculum" element={<Curriculum />} />

                            <Route path="honor-roll" element={<DeansHonorRoll />} />
                            <Route path="lab" element={<VisibilityStrategyLab />} />
                            <Route path="voice-training" element={<VoiceTrainingLab />} />

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


                            <Route path="tools/utilization" element={<CreditUtilizationCalculator />} />
                            <Route path="tools/dti" element={<DebtToIncomeCalculator />} />
                            <Route path="tools/debt-payoff" element={<DebtToIncomeCalculator />} />

                            {/* Credit Lab (Restored) */}
                            <Route path="credit-lab" element={<CreditTools />} />
                            <Route path="credit-lab/dispute" element={<DisputePage />} />
                            <Route path="credit-lab/simulator" element={<SimulatorPage />} />
                            <Route path="credit-lab/freeze" element={<SecurityFreeze />} />
                            <Route path="credit-lab/audit" element={<ReportAuditor />} />
                            <Route path="credit-lab/identity-theft" element={<IdentityTheftCenter />} />

                            {/* Legacy Redirects */}
                            <Route path="lab" element={<Navigate to="/dashboard/credit-lab" replace />} />
                            <Route path="lab/dispute" element={<Navigate to="/dashboard/credit-lab/dispute" replace />} />

                            {/* Knowledge & Community */}
                            <Route path="library" element={<LibraryHome />} />
                            <Route path="library/article/:slug" element={<ArticleView />} />
                            <Route path="library/law" element={<ConsumerLaw />} />
                            <Route path="library/letters" element={<LetterLibrary />} />
                            <Route path="knowledge" element={<KnowledgeCenter />} />
                            <Route path="community" element={<Community />} />
                            <Route path="vision" element={<VisionCenter />} />
                            <Route path="store" element={<MooStore />} />

                            {/* Games */}
                            <Route path="credit-quest" element={<CreditQuest />} />
                            <Route path="dream-architect" element={<DreamArchitect />} />
                            <Route path="vault" element={<TheVault />} />
                            <Route path="neural-network" element={<NeuralNetwork />} />
                            <Route path="lecture-hall" element={<LectureHall />} />

                            <Route path="settings" element={<Settings />} />
                            <Route path="referrals" element={<ReferralDashboard />} />

                            {/* REGISTERED EXPERIMENTAL NODES */}
                            {NodeRoutes()}
                        </Route>

                        {/* Admin/Founder Routes */}
                        <Route path="/admin" element={
                            <RequireAuth allowedRoles={['admin', 'dean']}>
                                <AdminLayout><Outlet /></AdminLayout>
                            </RequireAuth>
                        }>
                            <Route index element={<AdminDashboard />} />
                            <Route path="users" element={<UserManager />} />
                            <Route path="cockpit" element={<KnowledgeCockpit />} />
                            <Route path="referrals" element={<AdminReferralLog />} />

                            {/* ADMIN INFRASTRUCTURE NODES */}
                            {AdminNodeRoutes()}
                        </Route>

                        {/* Catch All */}
                        <Route path="*" element={<Navigate to="/" replace />} />
                    </Routes >
                    <div className="fixed bottom-1 left-1 z-50 text-[10px] text-white/20 pointer-events-none font-mono">
                        v1.0.5 - RESTORED
                    </div>
                    <SpeedInsights />
                    <VercelAnalytics />
                </Router >
            </AdmissionsProvider >
        </ProfileProvider>
    )
}

export default App
