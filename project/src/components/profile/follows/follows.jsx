import { useState,useEffect,useRef,useLayoutEffect } from "react";
import axios from "axios";
import "./styles/follows.css";
import Card from "./card";

export default function Follows(props){


    var style={"backgroundColor":"rgba(228, 228, 254, 0.887)"};
    var altstyle={"backgroundColor":"white"};
    const [list,setlist]=useState([]);

    const [followers,setfollowers]=useState(true);

    


    useEffect(()=>{
        const fun=async ()=>{
            try{
                if(followers){
                    var response=await axios.get(`http://${process.env.REACT_APP_IP_ADD}:2000/getfollows/getFollowers?uid=${props.uid}`);
                    var q=response.data;
                }
                else{
                    var response=await axios.get(`http://${process.env.REACT_APP_IP_ADD}:2000/getfollows/getFollowing?uid=${props.uid}`);
                    var q=response.data;
                }
               setlist(q);
               console.log(q);
              }
              catch(err){
                console.log(err);
                alert("error");
                setlist([]);
              }
        }
        fun();
    },[followers])
    return(<div className="follows" onClick={props.toggle}>
        <div style={{"backgroundColor":"white","width":"30vw","borderRadius":"20px","padding":"5px"}} onClick={(event)=>{event.stopPropagation();}}>
            <div className="headers">
                <div style={followers?style:altstyle} onClick={(event)=>{
                    event.preventDefault();
                    setfollowers(true);
                }}>
                    <b>Followers</b></div>
                <div style={followers?altstyle:style} onClick={(event)=>{
                    event.preventDefault();
                    setfollowers(false);
                }}>
                    <b>Following</b></div>
            </div>
            <div className="body" style={followers?{"borderTopLeftRadius":"0px"}:{"borderTopRightRadius":"0px"}}>
                {list.map((item)=>{
                    {/* console.log(item); */}
                    return (<Card 
                        key= {item.username} 
                        uid={props.uid}
                        username={item.username} 
                        profile={item.profile} 
                        following={item.following}
                        followback={item.followback}
                    />);
                })}
            </div>
        </div>
    </div>);
}