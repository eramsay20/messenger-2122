import React, {useState, useEffect} from "react";
import { Box } from "@material-ui/core";
import { SenderBubble, OtherUserBubble } from "../ActiveChat";
import moment from "moment";

const Messages = (props) => {
 const { messages, otherUser, userId } = props;
  const [senderMessages, setSenderMessages] = useState(messages.filter(msg => msg.senderId === userId))
  const [unread, setUnread] = useState(messages)

  useEffect(() => {
    setSenderMessages(props.messages.filter(msg => msg.senderId === userId));
    setUnread(props.messages.filter(msg => msg.unread && msg.senderId === userId).length)
  }, [props])
  console.log(messages)
  return (
    <Box>
      {messages && messages.map((message) => {
        const time = moment(message.createdAt).format("h:mm");
        return message.senderId === userId ? (
          <>
            <SenderBubble 
              unread={unread} 
              otherProfile={otherUser.photoUrl} 
              last={message.id === senderMessages[senderMessages.length-1].id} 
              key={message.id} 
              text={message.text} 
              time={time} />
            </>
        ) : (
          <OtherUserBubble key={message.id} text={message.text} time={time} otherUser={otherUser} />
        );
      })}
    </Box>
  );
};

export default Messages;
