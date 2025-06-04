import "./victory.scss"
import SideBarGamesContainer from "../../components/sidebargames/SideBarGames"
import VictoryScreen from "../../components/victoryscreen/VictoryScreen"

const Victory = () => {

    return (
        <>
            <div id="victoryContainer">
                <div id="innerVictoryContainer">
                    <SideBarGamesContainer></SideBarGamesContainer>
                    <VictoryScreen></VictoryScreen>
                </div>
            </div>
        </>
    )
}

export default Victory