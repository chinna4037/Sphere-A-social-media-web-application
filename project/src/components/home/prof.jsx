import "./styles/profile.css";

function profile(props){
    return(
        <div className="grid1" style={{"justifySelf":"flex-end"}}>
            <div className="imgCon">
                <img src={props.prof} alt="profile" />
            </div>
            <div style={{"fontWeight":"bolder"}}>{props.username}</div>
            <div className="f1">
                <div>{props.firstname}</div> 
                <div>{props.lastname}</div>
            </div>
        </div>
    );
}

export default profile;