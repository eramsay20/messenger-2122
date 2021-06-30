import React, {useState, useEffect} from "react";
import { Box } from "@material-ui/core";
import { SenderBubble, OtherUserBubble } from "../ActiveChat";
import { readConversationMessages } from "../../store/utils/thunkCreators";
import { useDispatch, useSelector } from 'react-redux';
import moment from "moment";

const Messages = (props) => {
  const dispatch = useDispatch()
  const { messages, otherUser, userId, conversation } = props;
  
  const [senderMessages, setSenderMessages] = useState(messages.filter(msg => msg.senderId === userId))
  const [otherUserMessages, setOtherUserMessages] = useState(messages.filter(msg => msg.senderId !== userId))
  const [unreadSenderMessageCount, setUnreadSenderMessageCount] = useState(0)
  const [lastSenderMessageId, setLastSenderMessageId] = useState(null)
  const activeChat = useSelector(state => state.activeConversation)
  
  // When new active chat opened, mark msgs as read
  // When navigating away to new chat window on unmount, mark all msgs from open window as read
  useEffect(() => {
    if (activeChat && activeChat === props.otherUser.username) dispatch(readConversationMessages(conversation))
    return () => dispatch(readConversationMessages(conversation))
  }, [activeChat])


  // Update sender && otherUser msg arrays as well as the unread msg count whenever props changes
  useEffect(() => {
    setSenderMessages(props.messages.filter(msg => msg.senderId === userId));
    setOtherUserMessages(props.messages.filter(msg => msg.senderId !== userId));
  }, [props, userId])


  // Whenever the other user replies in an active chat increasing the length of the otherUserMessages 
  // mark messages a read to update placement of last read profile icon
  useEffect(() => {
    dispatch(readConversationMessages(conversation))
  }, [otherUserMessages.length])

  // When senderMessages array changes, count the number of unread senderMessages
  // While the count of unread msgs is less than the count of all sender messages, set the id of the 'last' read sender msg
  // Feed the last read sender msg id to SenderBubble child component to know where to set the 'last read msg' profile icon
  useEffect(() => {
    if(senderMessages.length) setUnreadSenderMessageCount(senderMessages.filter(msg => msg.unread).length)
    if(unreadSenderMessageCount < senderMessages.length) {
      setLastSenderMessageId(senderMessages[senderMessages.length - 1 - unreadSenderMessageCount].id)
    }
  }, [senderMessages, unreadSenderMessageCount])

  return (
    <Box>
      {senderMessages && messages.map((message) => {
        const time = moment(message.createdAt).format("h:mm");
        return message.senderId === userId ? (
    
            <SenderBubble 
              key={message.id} 
              otherProfile={otherUser.photoUrl} 
              unreadCount={unreadSenderMessageCount}
              lastId={lastSenderMessageId}
              messageId = {message.id}
              text={message.text} 
              time={time} />
        ) : (
          <OtherUserBubble key={message.id} text={message.text} time={time} otherUser={otherUser} />
        );
      })}
    </Box>
  );
};

export default Messages;
