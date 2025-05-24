import "./sideBar.scss"
import { useState } from "react"
import arrow from "../../assets/arrow.svg"

const SideBar = () => {


    const [expandedBar, setExpandedBar] = useState(false)

    function handleClick() {
        setExpandedBar(!expandedBar)
    }

    return (
        <>
            <div id={expandedBar ? "sideBarContainerExpanded" : "sideBarContainer"} >
                <button id="toggleSideBar" onClick={handleClick}>
                    <img src={arrow} alt="" />
                </button>
                <div id={expandedBar ? "innerContainerExpanded" : "innerContainer"}>

                </div>
            </div>
        </>

    )
}

export default SideBar