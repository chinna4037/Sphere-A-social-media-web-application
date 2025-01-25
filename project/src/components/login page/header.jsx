import React from "react";
function Header(){
    return(
        <div className="f2">
                <svg  style={{"color":"rgb(90, 90, 240)"}} xmlns="http://www.w3.org/2000/svg" width="5%" height="5%" fill="currentColor" className="bi bi-plus-circle-fill" viewBox="0 0 16 16">
                <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0M8.5 4.5a.5.5 0 0 0-1 0v3h-3a.5.5 0 0 0 0 1h3v3a.5.5 0 0 0 1 0v-3h3a.5.5 0 0 0 0-1h-3z"/>
                </svg>
                <h1>prends</h1>
            <div className="f1">
                <p className="nam">Login</p>
                <p className="nam">Sign up</p>
            </div>
        </div>
    );
}
export default Header;