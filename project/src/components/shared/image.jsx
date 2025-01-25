import "./styles/image.css";
import { CommentIcon,NotificationsIcon } from "../login page/logo";

function Image(props){
    return(
        <div style={{"paddingBottom":"10px","borderBottom":"0.1px solid blue","marginBottom":"10px"}}>
            <div className="gridImg">
                <div className="imgCon">
                    <img src={props.profile} />
                </div>
                <div>{props.username}</div>
            </div>
            <div id="imgConimg">
                <img id= "img" src={props.src} />
            </div>
            <div id="iconBar">
                <NotificationsIcon />
                <CommentIcon />
            </div>
            
        </div>
    );
}
export default Image;