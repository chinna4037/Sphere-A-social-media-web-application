import { useState ,useEffect} from "react";
import { useLocation,useNavigate } from "react-router-dom";
import useStateRef from 'react-usestateref';
import axios from "axios";
import Panel from "./panel";

import "./styles/msg.css";
import { socket } from "../../socket";

export default function Message(props){

    useEffect(()=>{
        props.setNav(true);
    },[]);
    const location = useLocation();
    const x = location.state?.uid;
    const [uid,setUid]=useState(x);
    const [username,setUsername]=useState();

    const [msglist,setMsgList]=useState([]);

    const [unread,setUnread]=useState([]);

    const [select,setSelect]=useState(false);
    const [selected,setSelected,selectedRef]=useStateRef("");

    useEffect(()=>{
        socket.on("unread",(data)=>{
            // console.log(data);
            // console.log(data==selectedRef.current);
            // console.log( unread.indexOf(data));
            // console.log(selectedRef.current);
            if(selectedRef.current!=data && unread.indexOf(data)===(-1)){
                //console.log(selected);
                setUnread((prev)=>{
                    return ([...prev,data]);
                });
            }
    
        });
        return () => { socket.off('rec msg'); };
       },[socket]);


    

    useEffect(()=>{
        const fun=async () =>{
            var list=[]
            setMsgList([]);
            try{
                var r1=await axios.get(`http://${process.env.REACT_APP_IP_ADD}:2000/getusername?uid=${uid}`);
                setUsername(r1.data);
                var response=await axios.get(`http://${process.env.REACT_APP_IP_ADD}:2000/msg/List?uid=${uid}`);
                var res=response.data;
                //console.log(res);
                for(var i=0;i<res.length;i++){
                    var x=res[i];
                    var data=await axios.get(`http://${process.env.REACT_APP_IP_ADD}:2000/getUserData/others?username=${x}`);
                    //console.log(data.data);
                    list=[...list,data.data];
                }
                setMsgList(list);
            }
            catch(err){
                console.log(err);
                alert("error");
            }
        };
        fun();
        
    },[])

    function remFromUnread(name){
        setUnread((prev)=>{
           return (prev.filter((item)=>{
                return item!==name;
            }));
        })
    }


    async function handleClick(username){
        try{
            setSelect(true);
            setSelected(username.username);
            //console.log(select);
            //var response=await axios.get(`http://192.168.46.50:2000/msg/chat?uid=${uid}&username=${username}`);
           // console.log("clicked");    
        }catch(err){
            console.log(err);
            alert("ERROR");
        }
    }


    return(
    <div className="msg">
        <div className="list">
            <h1>{username}</h1>
            <br/>
            <h3> Messages</h3>
            <br/>
            <div className="userlist">
            {msglist.map((item)=>{
                return(<div className={item.username===selected&&"userSelected"} id="singlebox" onClick={(event)=>{
                            event.preventDefault();
                            handleClick(item);
                        }}>
                    <div className="listitem" >
                        {<Eachuser img={item.profile} username={item.username} />}
                    </div>
                    {unread.indexOf(item.username)!==(-1)&&<div className="reddot"></div>}
                </div>);
            })}
            </div>
        </div>
        {select&&<Panel selected={selected} username={username}  unread={remFromUnread}/>}
    </div>);
}



function Eachuser(props){
    return(
        <div className="card">
            <div className="imgCon">
                <img src={props.img} />
            </div>
            {props.username}
        </div>
    );
}