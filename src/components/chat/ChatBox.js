import React, { useEffect, useState } from 'react';
import './ChatBox.css';
import ChatHeader from './ChatHeader';
import Messages from '../message/Message';

import AddCircleIcon from '@material-ui/icons/AddCircle';
import CardGiftcardIcon from '@material-ui/icons/CardGiftcard';
import GifIcon from '@material-ui/icons/Gif';
import EmojiEmotionsIcon from '@material-ui/icons/EmojiEmotions';
import { useSelector } from 'react-redux';
import { selectUser } from '../../features/userSlice';
import { selectChannelId, selectChannelName } from '../../features/appSlice';
import db from '../../firebase';
import firebase from 'firebase';


function Chat() {
    const user = useSelector(selectUser);
    const channelId = useSelector(selectChannelId);
    const channelName = useSelector(selectChannelName);
    const [ input, setInput ] = useState('');
    const [ messages, setMessages ] = useState([]);

    useEffect(()=>{
        if(channelId){
            db.collection("channels").doc(channelId).collection("messages").orderBy("timestamp","asc").onSnapshot((snapshot) => {
            setMessages(snapshot.docs.map((doc)=> doc.data()))
        });
        }
        
    },[channelId]);

    const sendMessages = e =>{
        e.preventDefault();

        db.collection("channels").doc(channelId).collection("messages").add({
            timestamp: firebase.firestore.FieldValue.serverTimestamp(),
            user: user,
            message: input,
        })

        setInput("");
    }

    return (

        <div className="chat">
            <ChatHeader channelName={channelName} />

            <div className="chat__messages">
                {messages.map((message)=>(
                    <Messages 
                        timestamp = {message.timestamp}
                        message = {message.message}
                        user = {message.user}
                    />
                ))}
            </div>

            <div className="chat__input">
                <AddCircleIcon />
                <form onSubmit={(input) =>{
                    db.collection('channels')
                }}> 
                    <input disabled = {!channelId} value={input} onChange={(e)=> setInput(e.target.value)} placeholder={`Message #${channelName}`}/>
                    <button onClick={sendMessages} disabled = {!channelId} className="chat__inputButton" type="submit">Send</button>
                </form>
                <div className="chat__inputIcons">
                    <CardGiftcardIcon fontSize="large"/>
                    <GifIcon fontSize="large"/>
                    <EmojiEmotionsIcon fontSize="large"/>
                </div>

            </div>
        </div>

    )
}

export default Chat
