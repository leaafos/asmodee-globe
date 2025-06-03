import SideBarGames from "../../components/sidebargames/SideBarGames"
import GameScreen from "../../components/gamescreen/GameScreen"
import "./game.scss"

const Game = () => {
    return (
        <>
            <div id="gameContainer">
                <div id="innerGameContainer">
                    <SideBarGames></SideBarGames>
                    <GameScreen></GameScreen>

                </div>
                


            </div>
        
        </>

    )
}

export default Game