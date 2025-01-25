import { useState ,useEffect} from "react";
import "./styles/panel.css"
import {socket} from "../../socket.js";
import axios from "axios";

export default function Panel(props){
  
    const [msg,setmsg]=useState('');

    const [history,setHistory]=useState([]);

    function handleChange(event){
        const {name,value}=event.target;
        setmsg(value);
    }

    useEffect(()=>{
        setHistory([]);
        const his=async()=>{
            try{
                var h=await axios.get(`http://${process.env.REACT_APP_IP_ADD}:2000/msg/history/?username=${props.username}&selected=${props.selected}`);
                setHistory(h.data);
            }
            catch(err){
                console.log(err);
                alert("ERROR");
            }
        }
        his();
        props.unread(props.selected);
    },[props.selected])


    useEffect(()=>{
        var l=history;
        var unseen_ex=false;
        for (var i=0;i<l.length;i++){
            if(l[i].seen===false&&l[i].to==props.username){
                console.log("unseen");
                unseen_ex=true;
                l[i].seen=true;
            }
        }
        if(unseen_ex){
            setHistory(l);
            console.log(history);
            socket.emit("setallread",{selected:props.selected,username:props.username});
        }
        
    },[history])

   
    

       useEffect(()=>{
        socket.on("rec msg",(data)=>{
            setHistory((prev)=>{
                return [...prev,data];
            }); 
            console.log(history);
        });
        return () => { socket.off('rec msg'); };
       },[socket]);
    

    async function send(){
        if(socket && msg!==""){
            var date=(new Date()).toString();
            var format_msg={
                msg:msg,
                author:props.username,
                to:props.selected,
                date:date.substring(4,15),
                time:date.substring(16,21),
                seen:false
            };
            socket.emit("new msg",{selected:props.selected,username:props.username,msg:format_msg});
            setmsg("");
            var queryParams = new URLSearchParams(format_msg).toString();
            try{
                await axios.post(`http://${process.env.REACT_APP_IP_ADD}:2000/msg/chat/`,format_msg)
            }catch(err){
                console.log(err);
            }
            
        }
    }
    return(
        <div className="panel">
            <h1>{props.selected}</h1>
            {history.length===0?<div className="newChat">Start a  new chat with {props.selected}</div>
            :
                <div className="hiscon">
                    <div className="history">
                    {history.map((item)=>{
                        return (
                            <div style={{"display":"flex","flexDirection":"column"}}>
                                {(!(item.seen)&&item.author!==props.username)&&<div className="unreadmsg">unread msgs</div>}
                                <div id="ind" className={props.username===item.author?"sental":"recal"}>
                                    <div className={props.username===item.author?"sent":"rec"}>{item.msg}</div>
                                    <div className="time">{item.time}</div>
                                </div>
                            </div>);
                    })}
                    </div>
                </div>
            }
            <div className="msgip">
                <input type="text" placeholder="Message..."  onChange={handleChange} value={msg}/>
                <button type="submit" onClick={send}>{">"}</button>
            </div>
        </div>
    );
}