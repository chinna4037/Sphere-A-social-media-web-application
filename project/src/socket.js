import { io } from 'socket.io-client';


const URL =  `http://${process.env.REACT_APP_IP_ADD}:2000`; 


export const socket = io(URL);