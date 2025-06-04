import "./sinkOrSail.scss"
import SideBarSinkOrSail from "../../components/sidebarsinkorsail/SideBarSinkOrSail"
import SinkOrSailScreen from "../../components/sinkorsailscreen/SinkOrSailScreen"

const SinkOrSail = () => {
    return (
        <>
            <div id="sinkOrSailContainer">
                <div id="innerSinkOrSailContainer">
                    <SideBarSinkOrSail></SideBarSinkOrSail>
                    <SinkOrSailScreen></SinkOrSailScreen>
                </div>
            </div>
        </>
    )
}

export default SinkOrSail