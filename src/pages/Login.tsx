import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

export default function Login() {
    const navigate = useNavigate()

    useEffect(() => {
        // ULTIMATE DESTRUCTION OF THE LOGIN WALL
        console.log("!!! LOGIN WALL GOTTEN RID OF !!!");
        window.location.replace("/admissions");
    }, []);

    return (
        <div className="min-h-screen bg-black flex items-center justify-center">
            <div className="text-white font-mono text-xs animate-pulse">
                INITIALIZING ADMISSIONS SEQUENCE... REDIRECTING...
            </div>
        </div>
    )
}
