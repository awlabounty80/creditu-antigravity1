import { BrowserRouter as Router, Routes, Route, Navigate, Outlet } from 'react-router-dom'
import { AdmissionsProvider } from './context/AdmissionsContext'
import { ProfileProvider } from './context/ProfileContext'
import { RequireAuth } from './components/auth/RequireAuth'
import { Suspense, lazy } from 'react'
import MicroOfferCheckout from './pages/public/MicroOfferCheckout'
import { ErrorBoundary } from './components/debug/ErrorBoundary'
import { NodeRoutes, AdminNodeRoutes } from './nodes/NodeRouter'
import StudentDashboard from './pages/StudentDashboard'

// --- Public Pages ---
const CreditUniversityLanding = lazy(() => import('./pages/public/CreditUniversityLanding'))
const Admissions = lazy(() => import('./pages/public/Admissions'))
const TheGate = lazy(() => import('./pages/public/TheGate'))
const TheGateVariantA = lazy(() => import('./pages/public/TheGateVariantA'))
const TheGateVariantB = lazy(() => import('./pages/public/TheGateVariantB'))
const CampusTour = lazy(() => import('./pages/public/CampusTour'))
const Login = lazy(() => import('./pages/Login'))
const OnboardingVault = lazy(() => import('./components/credit-lab/OnboardingVault'))
const LinkView = lazy(() => import('./pages/public/LinkView'))
const StudentIdPage = lazy(() => import('./pages/public/StudentIdPage'))

// --- Campus Pages ---
const Curriculum = lazy(() => import('./pages/Curriculum'))
const KnowledgeCenter = lazy(() => import('./pages/KnowledgeCenter'))
const CreditQuest = lazy(() => import('./pages/CreditQuest'))
const CreditTools = lazy(() => import('./pages/CreditTools'))
const DisputePage = lazy(() => import('./pages/credit-lab/DisputePage'))
const SimulatorPage = lazy(() => import('./pages/credit-lab/SimulatorPage'))
const ReportAuditor = lazy(() => import('./pages/credit-lab/ReportAuditor'))
const SecurityFreeze = lazy(() => import('./pages/credit-lab/SecurityFreeze'))
const IdentityTheftCenter = lazy(() => import('./pages/credit-lab/IdentityTheftCenter'))
const VisionBoard = lazy(() => import('./pages/VisionBoard'))
const MooStore = lazy(() => import('./pages/MooStore'))
const GlobalCampus = lazy(() => import('./pages/Community'))
const UserSettings = lazy(() => import('./pages/Settings'))
const Orientation = lazy(() => import('./pages/Orientation'))
const HonorRoll = lazy(() => import('./pages/HonorRoll'))
const CertificateDownload = lazy(() => import('./pages/CertificateDownload'))
const ReferralDashboard = lazy(() => import('./pages/ReferralDashboard'))

// --- Missing Campus Pages ---
const DreamArchitect = lazy(() => import('./pages/DreamArchitect'))
const FinancialNervousSystem = lazy(() => import('./campus/academic/labs/fns/FinancialNervousSystem'))
const NeuralNetwork = lazy(() => import('./pages/NeuralNetwork'))
const TheVault = lazy(() => import('./pages/TheVault'))
const LectureHall = lazy(() => import('./pages/LectureHall'))
const ToolsHub = lazy(() => import('./pages/ToolsHub'))

// --- Financial Tools ---
const CreditScoreSimulator = lazy(() => import('./pages/tools/CreditScoreSimulator'))
const CreditUtilizationCalculator = lazy(() => import('./pages/tools/CreditUtilizationCalculator'))
const DebtToIncomeCalculator = lazy(() => import('./pages/tools/DebtToIncomeCalculator'))
const DisputeLetterGenerator = lazy(() => import('./pages/tools/DisputeLetterGenerator'))
const InteractiveQuiz = lazy(() => import('./pages/tools/InteractiveQuiz'))
const DebtPayoffCalculator = lazy(() => import('./pages/tools/DebtPayoffCalculator'))

// --- Admin Pages ---
const AdminDashboard = lazy(() => import('./pages/admin/AdminDashboard'))
const StudentManifest = lazy(() => import('./pages/admin/UserManager'))
const ReferralLog = lazy(() => import('./pages/admin/AdminReferralLog'))
const VideoModeration = lazy(() => import('./pages/admin/VideoModeration'))
const AdminLeaderboard = lazy(() => import('./pages/admin/Leaderboard'))

// --- New Labs & Nodes ---
const VisibilityStrategyLab = lazy(() => import('./pages/campus/VisibilityStrategyLab'))
const FreshmanClassroom = lazy(() => import('./pages/classroom/FreshmanClassroom'))
const VoiceTrainingLab = lazy(() => import('./pages/campus/VoiceTrainingLab'))
const ConsumerLaw = lazy(() => import('./pages/library/ConsumerLaw'))
const DormWeekVideoGate = lazy(() => import('./campus/registrar/dorm-week/DormWeekVideoGate'))
const DormWeekPreReg = lazy(() => import('./campus/registrar/dorm-week/DormWeekPreReg'))
const StudentLocker = lazy(() => import('./pages/campus/StudentLocker'))
const LearnHub = lazy(() => import('./pages/learn/LearnHub'))
const TrackView = lazy(() => import('./pages/learn/TrackView'))
const CoursePlayer = lazy(() => import('./pages/learn/CoursePlayer'))
const Metro2AuditChecklist = lazy(() => import('./pages/credit-lab/Metro2AuditChecklist'))

// --- Layouts ---
import PublicLayout from './layouts/PublicLayout'
import CampusLayout from './layouts/CampusLayout'
import AdminLayout from './layouts/AdminLayout'
import { DormWeekGuard } from './components/auth/DormWeekGuard'
import { useProfile } from './hooks/useProfile'

const AdminDormWeek = lazy(() => import('./pages/admin/AdminDormWeek'))

/**
 * Auth-Aware Wildcard Redirect
 * Public -> Dorm Week
 * Auth -> Dashboard
 */
function AuthAwareNavigate() {
    const { user, loading } = useProfile();
    if (loading) return null; // Wait for profile
    if (user) return <Navigate to="/dashboard" replace />;
    return <Navigate to="/orientation/dorm-week" replace />;
}



function App() {
    return (
        <ProfileProvider>
            <AdmissionsProvider>
                <Router>
                    <Routes>
                        {/* Public Front Door */}
                        <Route path="/" element={<Suspense fallback={null}><CreditUniversityLanding /></Suspense>} />
                        <Route path="/login" element={<Suspense fallback={null}><Login /></Suspense>} />
                        <Route path="/links" element={<Suspense fallback={null}><LinkView /></Suspense>} />
                        <Route path="/admissions" element={<Navigate to="/orientation/dorm-week" replace />} />
                        <Route path="/admissions/register" element={<Navigate to="/orientation/dorm-week" replace />} />
                        <Route path="/admissions/summary" element={<Suspense fallback={null}><StudentIdPage /></Suspense>} />
                        <Route path="/learn" element={<RequireAuth><Suspense fallback={null}><LearnHub /></Suspense></RequireAuth>} />
                        <Route path="/learn/personal-credit" element={<RequireAuth requiredLevels={['foundation', 'freshman', 'sophomore', 'junior', 'senior', 'graduate']}><Suspense fallback={null}><TrackView /></Suspense></RequireAuth>} />
                        <Route path="/learn/business-credit" element={<RequireAuth requiredLevels={['sophomore', 'junior', 'senior', 'graduate']}><Suspense fallback={null}><TrackView /></Suspense></RequireAuth>} />
                        <Route path="/learn/:trackSlug" element={<RequireAuth><Suspense fallback={null}><TrackView /></Suspense></RequireAuth>} />
                        <Route path="/learn/:trackSlug/:lessonSlug" element={<RequireAuth><Suspense fallback={null}><CoursePlayer /></Suspense></RequireAuth>} />
                        <Route path="/locker" element={<RequireAuth><Suspense fallback={null}><StudentLocker /></Suspense></RequireAuth>} />
                        <Route path="/apply" element={<Navigate to="/orientation/dorm-week" replace />} />
                        <Route path="/accepted" element={<Navigate to="/orientation/dorm-week" replace />} />
                        <Route path="/gate" element={<Navigate to="/orientation/dorm-week" replace />} />

                        {/* Gated Dorm Week routes mapped to Antigravity Edition */}
                        <Route path="/dorm-week" element={<Navigate to="/orientation/dorm-week" replace />} />
                        <Route path="/orientation/dorm-week" element={<Suspense fallback={null}><DormWeekPreReg /></Suspense>} />
                        <Route path="/dorm-week/protocol" element={<DormWeekGuard><Suspense fallback={null}><Orientation /></Suspense></DormWeekGuard>} />

                        {/* Pre-Registration Node (Public) */}
                        <Route path="/pre-reg" element={<Suspense fallback={null}><Outlet /></Suspense>}>
                            <Route path="offer/:slug" element={<MicroOfferCheckout />} />
                            {NodeRoutes()}
                        </Route>

                        {/* Onboarding Flow */}
                        <Route path="/onboarding" element={
                            <RequireAuth>
                                <Suspense fallback={null}>
                                    <OnboardingVault onUploadComplete={(data) => console.log('Upload complete', data)} />
                                </Suspense>
                            </RequireAuth>
                        } />

                        {/* Admissions & Course Overrides */}
                        <Route path="/curriculum" element={<Navigate to="/dashboard/curriculum" replace />} />

                        <Route path="/dashboard" element={
                            <RequireAuth>
                                <CampusLayout><Outlet /></CampusLayout>
                            </RequireAuth>
                        }>
                            <Route index element={<StudentDashboard />} />
                            <Route path="dream-architect" element={<RequireAuth requiredLevels={['senior', 'graduate']}><Suspense fallback={null}><DreamArchitect /></Suspense></RequireAuth>} />
                            <Route path="financial-nervous-system" element={<RequireAuth requiredLevels={['freshman', 'sophomore', 'junior', 'senior', 'graduate']}><Suspense fallback={null}><FinancialNervousSystem /></Suspense></RequireAuth>} />
                            <Route path="labs/financial-nervous-system" element={<Navigate to="/dashboard/financial-nervous-system" replace />} />
                            <Route path="neural-network" element={<RequireAuth requiredLevels={['junior', 'senior', 'graduate']}><Suspense fallback={null}><NeuralNetwork /></Suspense></RequireAuth>} />
                            <Route path="curriculum" element={<Suspense fallback={null}><Curriculum /></Suspense>} />
                            <Route path="course/:id" element={<Suspense fallback={null}><CoursePlayer /></Suspense>} />
                            <Route path="knowledge" element={<Suspense fallback={null}><KnowledgeCenter /></Suspense>} />
                            <Route path="quest" element={<Suspense fallback={null}><CreditQuest /></Suspense>} />
                            <Route path="tools" element={<Suspense fallback={null}><ToolsHub /></Suspense>} />
                            <Route path="tools/score-simulator" element={<RequireAuth requiredLevels={['sophomore', 'junior', 'senior', 'graduate']}><Suspense fallback={null}><CreditScoreSimulator /></Suspense></RequireAuth>} />
                            <Route path="tools/utilization" element={<RequireAuth><Suspense fallback={null}><CreditUtilizationCalculator /></Suspense></RequireAuth>} />
                            <Route path="tools/dti" element={<RequireAuth><Suspense fallback={null}><DebtToIncomeCalculator /></Suspense></RequireAuth>} />
                            <Route path="tools/dispute-generator" element={<RequireAuth requirePremium={true} requiredFlag="NODE_DISPUTE_LAB"><Suspense fallback={null}><DisputeLetterGenerator /></Suspense></RequireAuth>} />
                            <Route path="tools/quiz" element={<Suspense fallback={null}><InteractiveQuiz /></Suspense>} />
                            <Route path="tools/debt-payoff" element={<Suspense fallback={null}><DebtPayoffCalculator /></Suspense>} />
                            <Route path="vault" element={<Suspense fallback={null}><TheVault /></Suspense>} />
                            <Route path="lecture-hall" element={<Suspense fallback={null}><LectureHall /></Suspense>} />
                            <Route path="credit-lab" element={<Suspense fallback={null}><CreditTools /></Suspense>} />
                            <Route path="credit-lab/dispute" element={<RequireAuth requirePremium={true} requiredFlag="NODE_DISPUTE_LAB"><Suspense fallback={null}><DisputePage /></Suspense></RequireAuth>} />
                            <Route path="credit-lab/simulator" element={<RequireAuth requiredLevels={['sophomore', 'junior', 'senior', 'graduate']}><Suspense fallback={null}><SimulatorPage /></Suspense></RequireAuth>} />
                            <Route path="credit-lab/audit" element={<RequireAuth requiredLevels={['freshman', 'sophomore', 'junior', 'senior', 'graduate']}><Suspense fallback={null}><ReportAuditor /></Suspense></RequireAuth>} />
                            <Route path="credit-lab/audit-checklist" element={<RequireAuth><Suspense fallback={null}><Metro2AuditChecklist /></Suspense></RequireAuth>} />
                            <Route path="credit-lab/freeze" element={<RequireAuth><Suspense fallback={null}><SecurityFreeze /></Suspense></RequireAuth>} />
                            <Route path="credit-lab/identity-theft" element={<RequireAuth requirePremium={true}><Suspense fallback={null}><IdentityTheftCenter /></Suspense></RequireAuth>} />
                            <Route path="honor-roll" element={<Suspense fallback={null}><HonorRoll /></Suspense>} />
                            <Route path="vision" element={<Suspense fallback={null}><VisionBoard /></Suspense>} />
                            <Route path="store" element={<Suspense fallback={null}><MooStore /></Suspense>} />
                            <Route path="community" element={<Suspense fallback={null}><GlobalCampus /></Suspense>} />
                            <Route path="settings" element={<Suspense fallback={null}><UserSettings /></Suspense>} />
                            <Route path="orientation" element={<Suspense fallback={null}><Orientation /></Suspense>} />
                            <Route path="certificate" element={<Suspense fallback={null}><CertificateDownload /></Suspense>} />
                            <Route path="referrals" element={<Suspense fallback={null}><ReferralDashboard /></Suspense>} />

                            {/* Legacy Aliases */}
                            <Route path="lab" element={<RequireAuth requiredLevels={['junior', 'senior', 'graduate']}><Suspense fallback={null}><VisibilityStrategyLab /></Suspense></RequireAuth>} />
                            <Route path="classroom" element={<RequireAuth requiredLevels={['freshman', 'sophomore', 'junior', 'senior', 'graduate']}><Suspense fallback={null}><FreshmanClassroom /></Suspense></RequireAuth>} />
                            <Route path="dispute" element={<RequireAuth requirePremium={true} requiredFlag="NODE_DISPUTE_LAB"><Suspense fallback={null}><DisputePage /></Suspense></RequireAuth>} />
                            <Route path="voice" element={<RequireAuth requirePremium={true}><Suspense fallback={null}><VoiceTrainingLab /></Suspense></RequireAuth>} />
                            <Route path="consumer-law" element={<RequireAuth requirePremium={true}><Suspense fallback={null}><ConsumerLaw /></Suspense></RequireAuth>} />

                            {/* Deep-linking for Node Labs */}
                            <Route path="labs/*" element={<Suspense fallback={null}><Outlet /></Suspense>}>
                                {NodeRoutes()}
                            </Route>
                        </Route>

                        {/* Admin Routes */}
                        <Route path="/admin" element={
                            <RequireAuth allowedRoles={['admin', 'dean']}>
                                <AdminLayout><Outlet /></AdminLayout>
                            </RequireAuth>
                        }>
                            <Route index element={<Suspense fallback={null}><AdminDashboard /></Suspense>} />
                            <Route path="users" element={<Suspense fallback={null}><StudentManifest /></Suspense>} />
                            <Route path="dormweek" element={<Suspense fallback={null}><AdminDormWeek /></Suspense>} />
                            <Route path="referrals" element={<Suspense fallback={null}><ReferralLog /></Suspense>} />
                            <Route path="moderation" element={<Suspense fallback={null}><VideoModeration /></Suspense>} />
                            <Route path="leaderboard" element={<Suspense fallback={null}><AdminLeaderboard /></Suspense>} />
                            {AdminNodeRoutes()}
                        </Route>

                        {/* Fallback to Admissions for Public, Dashboard for Auth */}
                        <Route path="*" element={<AuthAwareNavigate />} />
                    </Routes>
                <div className="fixed bottom-1 left-1 z-50 text-[10px] text-white/20 pointer-events-none font-mono flex flex-col gap-0 uppercase">
                    <div>v2.1.0 - TAKEOVER // <span className="text-amber-500/50 text-[8px]">thecredituniversityai.com</span></div>
                        <div className="text-amber-500/50 text-[8px]">STRIPE {import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY?.startsWith('pk_test_') ? 'TEST MODE ACTIVE' : 'LIVE MODE ACTIVE'}</div>
                    </div>
                </Router>
            </AdmissionsProvider>
        </ProfileProvider>
    )
}

export default App
