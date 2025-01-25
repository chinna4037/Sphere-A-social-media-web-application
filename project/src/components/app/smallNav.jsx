import  logo,{ HomeIcon,HomeFill,SearchIcon,MessFill,UploadIcon,ReelsFill,ReelsIcon,ProfileIcon,NotificationsFill,NotificationsIcon,MoreIcon,SmallLogo } from "../login page/logo";
import "./styles/smallnav.css";
import { useNavigate } from "react-router-dom";

function SmallNav(props){

    const navigate = useNavigate(); 

    return(
        <div className="nav" style={{"paddingLeft":"10px","borderRight":"1px solid black"}}>
            <div><button id="sphere">
                <SmallLogo />
            </button></div>

            <button>
                <HomeFill />
            </button>

            <button onClick={props.search}>
                <SearchIcon />
            </button>

            <button>
                <ReelsIcon />
            </button>

            <button onClick={(event)=>{
                    event.preventDefault();
                    
                }}>
                <MessFill />
            </button>

            <button>
                <NotificationsIcon />
            </button>

            <button>
                <UploadIcon  onClick={props.upload}/>
            </button>

            <button>
                <ProfileIcon />
            </button>

            <button style={{"marginTop": "auto"}}>
                <MoreIcon /> 
            </button>
            <br />

        </div>
    );
}

export default SmallNav;