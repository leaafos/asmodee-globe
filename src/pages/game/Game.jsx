import { useNavigate } from "react-router-dom";
import SideBarGames from "../../components/sidebargames/SideBarGames"
import GameScreen from "../../components/gamescreen/GameScreen"
import "./game.scss"
import closeIcon from "../../assets/closeIcon.svg"




const Game = () => {

    const navigate = useNavigate();

    const handleClick = () => {
        navigate('/');
    };

    return (
        <>
            <div id="gameContainer">
                <div id="innerGameContainer">
                    <SideBarGames></SideBarGames>
                    <GameScreen></GameScreen>
                    <button onClick={handleClick} id="backHome">
                        <img src={closeIcon} />
                    </button>

                    

                </div>
                


            </div>
        
        </>

    )
}

export default Game