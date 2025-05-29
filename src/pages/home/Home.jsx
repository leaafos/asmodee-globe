import GlobeScene from "../../components/globescene/GlobeScene"
import SideBar from "../../components/sidebar/SideBar"
import ParrotTalk from "../../components/parrottalk/ParrotTalk"
import TreasureTrail from "../../components/treasuretrail/TreasureTrail"
import "./home.scss"
import GloryChest from "../../components/glorychest/GloryChest"
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";


const Home = () => {
    const navigate = useNavigate();

    useEffect(() => {
        const user = JSON.parse(localStorage.getItem("user"));
        if (!user) navigate("/login");
    }, []);
    return (
        <>
            <div id="homeContainer">
                <SideBar></SideBar>
                <div id="mainRightContainer">
                    <div id="topContainer">
                        <GlobeScene></GlobeScene>
                        <ParrotTalk></ParrotTalk>
                    </div>
                    <div id="bottomContainer">
                        <TreasureTrail></TreasureTrail>
                        <GloryChest></GloryChest>

                    </div>
                    

                </div>
                
            </div>     
        </>
        
    )
}

export default Home