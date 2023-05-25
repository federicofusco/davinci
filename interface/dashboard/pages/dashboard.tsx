import Navbar from "../components/navigation/Navbar";
import SoilHumidity from "../components/graphs/SoilHumidity";
import AtmophericHumidity from "../components/graphs/AtmosphericHumidity";
import AtmophericPressure from "../components/graphs/AtmosphericPressure";
import AtmophericTemperature from "../components/graphs/AtmosphericTemperature";

const Dashboard = () => {
        return <>
                <Navbar />
                <div className="mt-20 px-2">
                        <div className="md:flex md:justify-center">
                                <SoilHumidity />
                                <AtmophericHumidity />
                        </div>
                        <div className="md:flex md:justify-center">
                                <AtmophericPressure />
                                <AtmophericTemperature />
                        </div>
                </div>
        </>;
}

export default Dashboard;