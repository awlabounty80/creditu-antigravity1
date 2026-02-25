import { DashboardLayout } from "../components/layout/DashboardLayout";
import { useParams } from "react-router-dom";

const PublicProfile = () => {
    const { username } = useParams();
    return (
        <DashboardLayout>
            <div className="p-8 text-white">
                <h1 className="text-4xl font-bold mb-4">Public Profile</h1>
                <p>Viewing profile for: {username}</p>
            </div>
        </DashboardLayout>
    );
};

export default PublicProfile;
