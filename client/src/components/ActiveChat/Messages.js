import React, {useState, useEffect} from "react";
import { Box } from "@material-ui/core";
import { SenderBubble, OtherUserBubble } from "../ActiveChat";
import moment from "moment";

const Messages = (props) => {
  const { messages, otherUser, userId } = props;
  const [senderMessages, setSenderMessages] = useState(messages.filter(msg => msg.senderId === userId))
  const [unreadCount, setUnreadCount] = useState(messages.filter(msg => msg.unread && msg.senderId === userId).length)
  console.log(unreadCount)

  useEffect(() => {
    setSenderMessages(props.messages.filter(msg => msg.senderId === userId));
    setUnreadCount(props.messages.filter(msg => msg.unread && msg.senderId === userId).length)
  }, [props])

  return (
    <Box>
      {senderMessages && messages.map((message) => {
        const time = moment(message.createdAt).format("h:mm");
        return message.senderId === userId ? (
          <> { senderMessages.length > 0 && 
            <SenderBubble 
              key={message.id} 
              otherProfile={otherUser.photoUrl} 
              unreadCount={unreadCount}
              lastId={senderMessages[senderMessages.length-1-unreadCount].id}
              messageId = {message.id}
              text={message.text} 
              time={time} />
            }
            </>
        ) : (
          <OtherUserBubble key={message.id} text={message.text} time={time} otherUser={otherUser} />
        );
      })}
    </Box>
  );
};

export default Messages;
