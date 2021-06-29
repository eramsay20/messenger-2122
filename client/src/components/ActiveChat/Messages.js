import React, {useState, useEffect} from "react";
import { Box } from "@material-ui/core";
import { SenderBubble, OtherUserBubble } from "../ActiveChat";
import { readConversationMessages } from "../../store/utils/thunkCreators";
import { useDispatch } from 'react-redux';
import moment from "moment";

const Messages = (props) => {
  const dispatch = useDispatch()
  const { messages, otherUser, userId } = props;
  
  const [senderMessages, setSenderMessages] = useState(messages)
  const [otherUserMessages, setOtherUserMessages] = useState(messages)
  const [unreadMessageCount, setUnreadMessageCount] = useState(0)
  const [lastId, setLastId] = useState(null)

  // reset sender mgs, otherUser msg and unread msg count whenever props changes
  useEffect(() => {
    setSenderMessages(props.messages.filter(msg => msg.senderId === userId));
    setOtherUserMessages(props.messages.filter(msg => msg.senderId !== userId));
  }, [props, userId])

  // After senderMessages filters and saves in useState, count the number of unread sender msgs and
  // if there's at least 1 message thats been read, set the id of the 'last' read msg so the 
  // SenderBubble knows where to show the 'last read msg' icon
  useEffect(() => {
    if(senderMessages.length) setUnreadMessageCount(senderMessages.filter(msg => msg.unread).length)
    if (unreadMessageCount < senderMessages.length) {
      setLastId(senderMessages[senderMessages.length - 1 - unreadMessageCount].id)
    }
  }, [senderMessages, unreadMessageCount])

  
  // when both users have their convo in ActiveChat, we'll want to update 'read' messages
  // whenever the otherUser in the convo posts a new message so we can update the last read msg icon placement
  useEffect(() => {
    dispatch(readConversationMessages(props.conversation))
  }, [otherUserMessages.length])

  return (
    <Box>
      {senderMessages && messages.map((message) => {
        const time = moment(message.createdAt).format("h:mm");
        return message.senderId === userId ? (
    
            <SenderBubble 
              key={message.id} 
              otherProfile={otherUser.photoUrl} 
              unreadCount={unreadMessageCount}
              lastId={lastId}
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
