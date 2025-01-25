import React from "react";
import First from "./login page/first";
import Home from "./home/home";
import Profile from "./profile/profile";
import { Routes, Route} from "react-router-dom";
import App2 from "./app/app";
import Message from "./messages/msg";
import Reels from "./reels/reels";

function App(){
    return(
    <Routes>
        <Route path="/" element={<First />} />
        <Route path="/app" element={<App2 />} >
        <Route path="/app/home" element={<Home />} />
        <Route path="/app/profile" element={<Profile />} />
        <Route path="/app/msg" element={<Message />} />
        <Route path="/app/reels" element={<Reels />} />
        </Route>
    </Routes>
    );
}
export default App;