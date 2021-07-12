import React from "react";
import { Box } from "@material-ui/core";
import { BadgeAvatar, ChatContent } from "../Sidebar";
import { makeStyles } from "@material-ui/core/styles";
import { setActiveChat } from "../../store/activeConversation";
import { useDispatch, useSelector } from "react-redux";

const useStyles = makeStyles(() => ({
  root: {
    borderRadius: 8,
    height: 80,
    boxShadow: "0 2px 10px 0 rgba(88,133,196,0.05)",
    marginBottom: 10,
    display: "flex",
    alignItems: "center",
    "&:hover": {
      cursor: "grab",
    },
  },
  unread: {
    height: "30px",
    width: "30px",
    color: "white",
    fontWeight: "bold",
    backgroundColor: "#3A8DFF",
    borderRadius: "50%",
    display: "flex",
    justifyContent: 'center',
    alignItems:'center',
    marginRight: '10px',
  },
  hidden: {
    display: 'none'
  }
}));

const Chat = ({ conversation }) => {
  const classes = useStyles()
  const dispatch = useDispatch()
  const activeConversation = useSelector( state => state.activeConversation);
  const otherUser = conversation.otherUser;
  const unreadCount = conversation.messages.filter(message => message.senderId === otherUser.id && message.unread).length;
  
  const handleClick = async (conversation) => {
    // set clicked on window as active chat
    await dispatch(setActiveChat(conversation.otherUser.username));
  };

    return (
      <Box
        onClick={() => handleClick(conversation)}
        className={classes.root}
      >
        <BadgeAvatar
          photoUrl={otherUser.photoUrl}
          username={otherUser.username}
          online={otherUser.online}
          sidebar={true}
        />
        <ChatContent conversation={conversation} />
        { otherUser.username !== activeConversation &&
        <div className={`${classes.unread} ${(unreadCount === 0 ? classes.hidden : null)}`}>{unreadCount}</div>
        }
      </Box>
    );
}

export default Chat;