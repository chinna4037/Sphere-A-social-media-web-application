import React , {useState,useEffect} from "react";
import Logo from "./logo";
import Login from "./login";
import Signup from "./signup";
import "./styles/login.css";

function First(){
    const [log,setlog]=useState(true);
    let bac_col={"backgroundColor":"#007bff"};
    let col={"color":"black"};
    const [loginstyle,setlogin]=useState(bac_col);
    const [signupstyle,setsignup]=useState(col);
    const [loginresult,setloginresult]=useState("");
    
    function toLog(){
        setlog(true);
        setloginresult("successfully registered.Try login");
    }

    return(
        <div className="g1">
        <div>
        <Logo />
        <h1 style={{"fontFamily": "Lobster,sans-serif","fontWeight": "400","fontStyle":"normal","fontSize":"3em"}}>Sphere</h1>
        <div className="but">
            <button  onClick={(event)=>{
                event.preventDefault();
                if(!log){
                    setlog(true);
                }
                setlogin(bac_col);
                setsignup(col);
            }} style={{...loginstyle,"borderRadius":"40%"}}>login</button>
            <button  onClick={(event)=>{
                event.preventDefault();
                if(log){
                    setlog(false);
                }
                setsignup(bac_col);
                setlogin(col);
            }} style={{...signupstyle,"borderRadius":"40%"}}>signup</button>
        </div>
        </div>
        {log?<Login x={loginresult}/>:<Signup onsucess={toLog}/>}
        </div>
    );
}

export default First;