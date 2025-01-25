import  logo,{ HomeIcon,HomeFill,SearchIcon,MessFill,UploadIcon,ReelsFill,ReelsIcon,ProfileIcon,NotificationsFill,NotificationsIcon,MoreIcon,SmallLogo } from "../login page/logo";
import "./styles/nav.css";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import axios from "axios";

function Nav(props){

    const navigate = useNavigate(); 

    return(
        <div id="nav" style={{"paddingLeft":"10px","borderRight":"1px solid black"}}>
            <div >
            <button  id="sphere" style={{"height":"fit-content"}}>
                <div className="nav-f1" style={{"marginTop":"20px"}}>
                    <SmallLogo />
                    <h1 style={{"fontFamily": "Lobster,sans-serif","fontWeight": "400","fontStyle":"normal" ,"margin":"0px"}}>Sphere</h1>
                </div>
            </button>
            </div>

            <button onClick={(event)=>{
                    event.preventDefault();
                    navigate("/app/",{state:{uid:props.uid}});
                }}>
                <div className="nav-f1">
                <HomeFill /><div style={{"alignSelf":"center"}}>Home</div>
                </div>
            </button>

            <button onClick={(event)=>{
                event.preventDefault();
                event.stopPropagation();
                props.search();
            }}>
                <div className="nav-f1">
                <SearchIcon /><div style={{"alignSelf":"center"}}>Search</div>
                </div>
            </button>
       
            <button onClick={(event)=>{
                event.preventDefault();
                navigate("/app/reels",{state:{uid:props.uid}});
            }}>
                <div className="nav-f1">
                <ReelsIcon /><div style={{"alignSelf":"center"}}>Reels</div>
                </div>
            </button>
        
            <button onClick={(event)=>{
                    event.preventDefault();
                    props.nav();
                    navigate("/app/msg",{state:{uid:props.uid}});
                }}>
                <div className="nav-f1">
                <MessFill /><div style={{"alignSelf":"center"}}>Messages</div>
                </div>
            </button>
        
            <button>
                <div className="nav-f1">
                <NotificationsIcon /><div style={{"alignSelf":"center"}}>Notifications</div>
                </div>
            </button>
        
            <button>
                <div className="nav-f1" onClick={props.upload}>
                <UploadIcon /><div style={{"alignSelf":"center"}}>Upload</div>
                </div>
            </button>
        
            <button>
                <div className="nav-f1"  onClick={(event)=>{
                    event.preventDefault();
                    navigate("/app/profile",{state:{uid:props.uid}});
                }}>
                <ProfileIcon /><div style={{"alignSelf":"center"}}>Profile</div>
                </div>
            </button>
    
        <button style={{"marginTop": "auto"}}>
            <div className="nav-f1" >
            <MoreIcon /><div style={{"alignSelf":"center"}}>More</div>
            </div> 
        </button>
        <br />
    
    </div>
    );
}

export default Nav;