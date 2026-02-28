import { BrowserRouter as Router, Routes, Route, Navigate, Outlet } from 'react-router-dom'
import { AdmissionsProvider } from './context/AdmissionsContext'
import { ProfileProvider } from './context/ProfileContext'
import { RequireAuth } from './components/auth/RequireAuth'
import { Suspense, lazy } from 'react'

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

// --- Campus Pages ---
import StudentDashboard from './pages/StudentDashboard'
const Curriculum = lazy(() => import('./pages/Curriculum'))
const CoursePlayer = lazy(() => import('./pages/CoursePlayer'))
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
const FinancialNervousSystem = lazy(() => import('./pages/FinancialNervousSystem'))
const NeuralNetwork = lazy(() => import('./pages/NeuralNetwork'))
const TheVault = lazy(() => import('./pages/TheVault'))
const LectureHall = lazy(() => import('./pages/LectureHall'))
const ToolsHub = lazy(() => import('./pages/ToolsHub'))

// --- Admin Pages ---
const AdminDashboard = lazy(() => import('./pages/admin/AdminDashboard'))
const StudentManifest = lazy(() => import('./pages/admin/UserManager'))
const ReferralLog = lazy(() => import('./pages/admin/AdminReferralLog'))

// --- New Labs & Nodes ---
const VisibilityStrategyLab = lazy(() => import('./pages/campus/VisibilityStrategyLab'))
const FreshmanClassroom = lazy(() => import('./pages/classroom/FreshmanClassroom'))
const VoiceTrainingLab = lazy(() => import('./pages/campus/VoiceTrainingLab'))
const ConsumerLaw = lazy(() => import('./pages/library/ConsumerLaw'))

// --- Layouts ---
import PublicLayout from './layouts/PublicLayout'
import CampusLayout from './layouts/CampusLayout'
import AdminLayout from './layouts/AdminLayout'

// --- Auth Bypass Component ---
import { NodeRoutes, AdminNodeRoutes } from './nodes/NodeRouter'

function App() {
    return (
        <ProfileProvider>
            <AdmissionsProvider>
                <Router>
                    <Routes>
                        {/* Public Front Door */}
                        <Route path="/" element={<Suspense fallback={null}><CreditUniversityLanding /></Suspense>} />
                        <Route path="/gate" element={<Suspense fallback={null}><TheGate /></Suspense>} />
                        <Route path="/gate-a" element={<Suspense fallback={null}><TheGateVariantA /></Suspense>} />
                        <Route path="/gate-b" element={<Suspense fallback={null}><TheGateVariantB /></Suspense>} />
                        <Route path="/tour" element={<Suspense fallback={null}><CampusTour /></Suspense>} />
                        <Route path="/login" element={<Suspense fallback={null}><Login /></Suspense>} />
                        <Route path="/links" element={<Suspense fallback={null}><LinkView /></Suspense>} />
                        <Route path="/admissions" element={<Suspense fallback={null}><Admissions /></Suspense>} />

                        {/* Pre-Registration Node (Public) */}
                        <Route path="/pre-reg" element={<Suspense fallback={null}><Outlet /></Suspense>}>
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
                        <Route path="/apply" element={<Navigate to="/gate" replace />} />
                        <Route path="/curriculum" element={<Navigate to="/dashboard/curriculum" replace />} />

                        <Route path="/dashboard" element={
                            <RequireAuth>
                                <CampusLayout><Outlet /></CampusLayout>
                            </RequireAuth>
                        }>
                            <Route index element={<StudentDashboard />} />
                            <Route path="dream-architect" element={<Suspense fallback={null}><DreamArchitect /></Suspense>} />
                            <Route path="financial-nervous-system" element={<Suspense fallback={null}><FinancialNervousSystem /></Suspense>} />
                            <Route path="neural-network" element={<Suspense fallback={null}><NeuralNetwork /></Suspense>} />
                            <Route path="curriculum" element={<Suspense fallback={null}><Curriculum /></Suspense>} />
                            <Route path="course/:id" element={<Suspense fallback={null}><CoursePlayer /></Suspense>} />
                            <Route path="knowledge" element={<Suspense fallback={null}><KnowledgeCenter /></Suspense>} />
                            <Route path="quest" element={<Suspense fallback={null}><CreditQuest /></Suspense>} />
                            <Route path="tools" element={<Suspense fallback={null}><ToolsHub /></Suspense>} />
                            <Route path="vault" element={<Suspense fallback={null}><TheVault /></Suspense>} />
                            <Route path="lecture-hall" element={<Suspense fallback={null}><LectureHall /></Suspense>} />
                            <Route path="credit-lab" element={<Suspense fallback={null}><CreditTools /></Suspense>} />
                            <Route path="credit-lab/dispute" element={<Suspense fallback={null}><DisputePage /></Suspense>} />
                            <Route path="credit-lab/simulator" element={<Suspense fallback={null}><SimulatorPage /></Suspense>} />
                            <Route path="credit-lab/audit" element={<Suspense fallback={null}><ReportAuditor /></Suspense>} />
                            <Route path="credit-lab/freeze" element={<Suspense fallback={null}><SecurityFreeze /></Suspense>} />
                            <Route path="credit-lab/identity-theft" element={<Suspense fallback={null}><IdentityTheftCenter /></Suspense>} />
                            <Route path="honor-roll" element={<Suspense fallback={null}><HonorRoll /></Suspense>} />
                            <Route path="vision" element={<Suspense fallback={null}><VisionBoard /></Suspense>} />
                            <Route path="store" element={<Suspense fallback={null}><MooStore /></Suspense>} />
                            <Route path="community" element={<Suspense fallback={null}><GlobalCampus /></Suspense>} />
                            <Route path="settings" element={<Suspense fallback={null}><UserSettings /></Suspense>} />
                            <Route path="orientation" element={<Suspense fallback={null}><Orientation /></Suspense>} />
                            <Route path="certificate" element={<Suspense fallback={null}><CertificateDownload /></Suspense>} />
                            <Route path="referrals" element={<Suspense fallback={null}><ReferralDashboard /></Suspense>} />

                            {/* Legacy Aliases */}
                            <Route path="lab" element={<Suspense fallback={null}><VisibilityStrategyLab /></Suspense>} />
                            <Route path="classroom" element={<Suspense fallback={null}><FreshmanClassroom /></Suspense>} />
                            <Route path="dispute" element={<Suspense fallback={null}><DisputePage /></Suspense>} />
                            <Route path="voice" element={<Suspense fallback={null}><VoiceTrainingLab /></Suspense>} />
                            <Route path="consumer-law" element={<Suspense fallback={null}><ConsumerLaw /></Suspense>} />

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
                            <Route path="students" element={<Suspense fallback={null}><StudentManifest /></Suspense>} />
                            <Route path="referrals" element={<Suspense fallback={null}><ReferralLog /></Suspense>} />
                            {AdminNodeRoutes()}
                        </Route>

                        {/* Fallback to Dashboard */}
                        <Route path="*" element={<Navigate to="/dashboard" replace />} />
                    </Routes>
                    <div className="fixed bottom-1 left-1 z-50 text-[10px] text-white/20 pointer-events-none font-mono">
                        v2.0.6 - STABILIZED
                    </div>
                </Router>
            </AdmissionsProvider>
        </ProfileProvider>
    )
}

export default App
