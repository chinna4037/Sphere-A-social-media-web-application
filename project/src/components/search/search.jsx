import "./styles/search.css";

import { useEffect, useState } from "react";
import axios from "axios";

import Card from "./card";

function Search(props){

    const [list,setlist]=useState([]);

    useEffect(()=>{
        const fun=async()=>{
            try{
                const res=await axios.get(`http://${process.env.REACT_APP_IP_ADD}:2000/search?uid=${props.uid}`);
                setlist(res.data);
            }catch(err){
                console.log(err);
                alert("error");
            }
        }
        fun();
    },[])

    async function onChange(event) {
        const {name,value}=event.target;
        try{
            const res=await axios.get(`http://${process.env.REACT_APP_IP_ADD}:2000/search?uid=${props.uid}&entered=${value}`);
            setlist(res.data);
            console.log(res.data);
        }
        catch(err){
            alert("ERROR");
            console.log(err);
        }
    }

    return(
        <div id="se">
            <div className="search-container">
                <input type="text" placeholder="Search..." onChange={onChange}/>
                <button type="submit">Search</button>
            </div>
            <div className="bodyOfSearch" style={{"overflowY":"scroll","height":"70vh"}}>
            {list.map((item)=>{
                return(<Card key={item.username} uid={props.uid} img={item.profile} username={item.username} following={item.following} followback={item.followback}/>);
            })}
            </div>
        </div>
    );
}

export default Search;