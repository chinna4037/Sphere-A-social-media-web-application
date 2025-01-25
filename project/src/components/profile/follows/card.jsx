import "./styles/card.css";
import { useState } from "react";
import axios from "axios";

export default function Card(props){

    const [following,setFollow]=useState(props.following);

    const[followback,setFB]=useState(props.followback);


    async function addFollow(){
        try{
            const res=await axios.get(`http://${process.env.REACT_APP_IP_ADD}:2000/fg/addToFollowing?uid=${props.uid}&username=${props.username}`);
            console.log(res);
            setFollow((pre)=>{return !pre;})
        }catch(err){
            alert("error");
            console.log(err);
        }
    }

    async function removeFollow(){
        try{
            const res=await axios.get(`http://${process.env.REACT_APP_IP_ADD}:2000/fg/removeFromFollowing?uid=${props.uid}&username=${props.username}`);
            console.log(res);
            setFollow((pre)=>{return !pre;})
        }catch(err){
            alert("error");
            console.log(err);
        }
    }

    return(
        <div className="proflex">
            <div className="f2">
                <div className="imgCon">
                    <img src={props.profile} />
                </div>
                {props.username}
            </div>
             {following?
                    <button id="followed" onClick={removeFollow}>following</button>
                :
                followback
                    ?
                    <button id="followed" onClick={addFollow}>follow back</button>
                    :
                    <button id="follow" onClick={addFollow}>follow</button>
            }
        </div>
    );
}