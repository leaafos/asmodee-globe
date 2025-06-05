import "./victory.scss"
import SideBarGamesContainer from "../../components/sidebargames/SideBarGames"
import VictoryScreen from "../../components/victoryscreen/VictoryScreen"
import { useNavigate } from "react-router-dom"
import closeIcon from "../../assets/closeIcon.svg"

const Victory = () => {

    const navigate = useNavigate();

    const handleClick = () => {
        navigate('/');
    };

    return (
        <>
            <div id="victoryContainer">
                <div id="innerVictoryContainer">
                    <SideBarGamesContainer></SideBarGamesContainer>
                    <VictoryScreen></VictoryScreen>
                    <button onClick={handleClick} id="backHome">
                        <img src={closeIcon} />
                    </button>
                </div>
            </div>
        </>
    )
}

export default Victory