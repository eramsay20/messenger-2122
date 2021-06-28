import React, { Component } from "react";
import { Box } from "@material-ui/core";
import { BadgeAvatar, ChatContent } from "../Sidebar";
import { withStyles } from "@material-ui/core/styles";
import { setActiveChat } from "../../store/activeConversation";
import { readConversationMessages } from "../../store/utils/thunkCreators";
import { connect } from "react-redux";

const styles = {
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
};

class Chat extends Component {
  handleClick = async (conversation) => {
    // set clicked on window as active chat
    await this.props.setActiveChat(conversation.otherUser.username);

    // before opening and marking a new chat as read,
    // identify the last convo and run cleanup on last active convo to mark all messages 
    // that came through while the window was set to active as "read" 
    const lastConvo =  this.props.conversations.filter(convo => convo.id === conversation.lastActiveConvo)
    if(lastConvo.length) await this.props.readConversationMessages(lastConvo[0])
    
    // when chat is selected and set to active, reset unread count for the newly selected convo
    await this.props.readConversationMessages(conversation)
  };

  render() {
    const { classes } = this.props;
    const otherUser = this.props.conversation.otherUser;
    const unreadCount = this.props.conversation.messages.filter(message => message.senderId === otherUser.id && message.unread).length;
    
    return (
      <Box
        onClick={() => this.handleClick(this.props.conversation)}
        className={classes.root}
      >
        <BadgeAvatar
          photoUrl={otherUser.photoUrl}
          username={otherUser.username}
          online={otherUser.online}
          sidebar={true}
        />
        <ChatContent conversation={this.props.conversation} />
        { this.props.conversation.otherUser.username !== this.props.activeConversation &&
        <div className={`${classes.unread} ${(unreadCount === 0 ? classes.hidden : null)}`}>{unreadCount}</div>
        }
      </Box>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    conversations: state.conversations,
    activeConversation: state.activeConversation,
    user: state.user,
  };
};


const mapDispatchToProps = (dispatch) => {
  return {
    setActiveChat: (id) => {
      dispatch(setActiveChat(id));
    },
    readConversationMessages: (conversation) => {
      dispatch(readConversationMessages(conversation))
    }
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(Chat));
