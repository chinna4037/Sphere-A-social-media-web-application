import "./styles/content.css";
import Image from "../shared/image";
import axios from "axios";
import { Buffer } from "buffer";

import { useState,useEffect } from "react";

function Content(props){

    const [imageList, setImageList] = useState([]);

    useEffect(() => {
        const fetchImage = async () => {
          try {
            const response = await axios.get(`http://${process.env.REACT_APP_IP_ADD}:2000/get`);
            console.log(response.data);
            setImageList(response.data);
          } catch (error) {
            console.error("Error fetching image:", error);
          }
        };
        fetchImage();
      },[]);

    return(
        <div className="con">
            <div className="imgCon">
              <img src={props.profile} alt="profile" />
            </div>
            <br />
            {imageList.map((item) => 
              <Image 
                key={item.id}  
                src={item.data} 
                username={item.username}
                profile={item.profile}
              />
            )}
        </div>
    );
}

export default Content;