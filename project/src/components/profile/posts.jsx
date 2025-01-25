import { useState,useEffect,useRef } from "react";
import axios from "axios";
// import  getThumb from 'video-thumbnail-url';
// import ThumbnailVideo from 'react-thumbnail-video';
// import { createVideoThumbnail, clearCache } from 'react-native-compressor';
import {VideoThumbnailGenerator} from "browser-video-thumbnail-generator"
import "./styles/posts.css";


export default function Posts(props){

    const [posts,setPosts]=useState([]);

    const divRef = useRef(null);

    // Function to update CSS variable with div width
    const updateWidthVariable = () => {
      const divWidth = ((divRef.current.offsetWidth)-40)/3;
    //   console.log(divWidth);
      document.documentElement.style.setProperty('--div-width', `${divWidth}px`);
    };

    // Update the width variable when component mounts or when window resizes
    useEffect(() => {
      updateWidthVariable();
      window.addEventListener('resize', updateWidthVariable);
      return () => {
        window.removeEventListener('resize', updateWidthVariable);
      };
    }, []);


    useEffect(()=>{
        const fun=async()=>{
            try{
                // console.log("Posts");
                var res=await axios.get(`http://${process.env.REACT_APP_IP_ADD}:2000/posts?uid=${props.uid}`);
                console.log(res.data);
                setPosts(res.data);
            }
            catch(err){
                console.log(err);
                alert("ERROR");
            }
        }
        fun();
    },[]);


    return(<div className="posts" ref={divRef}>
        {posts.map((item)=>{
            return(<div className="postcon">
                {item.type==="image"
                  ?
                  <img className="post" src={item.data} alt="posts"/>
                  :
                  <video src={item.data} className="post" controls/>
                  
                }
               
            </div>);
        })}
    </div>);
}

/* <img className="post" src={async ()=>{
                      var generator = new VideoThumbnailGenerator(item.data);

                      generator.getThumbnail()
                        .then((thumbnail) => {
                          // Use the thumbnail...
                          console.log(thumbnail);
                          // When you're done with the thumbnail, revoke it to free memory
                          generator.revokeUrls();
                      });
                      // getThumb('https://www.youtube.com/watch?v=mNHNktxbjdk').then(thumb_url => { 
                      //   console.log(thumb_url);
                      // });
                  }} alt="posts"/> */