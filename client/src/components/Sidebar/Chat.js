import React, { Component } from "react";
import { Box } from "@material-ui/core";
import { BadgeAvatar, ChatContent } from "../Sidebar";
import { makeStyles } from "@material-ui/core/styles";
import { setActiveChat } from "../../store/activeConversation";
import { connect, useDispatch, useSelector } from "react-redux";

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

const Chat = (props) => {
  const classes = useStyles()
  const dispatch = useDispatch()
  const { conversation } = props
  const otherUser = conversation.otherUser;
  const activeConversation = useSelector( state => state.activeConversation);
  const unreadCount = conversation.messages.filter(message => message.senderId === otherUser.id && message.unread).length;
  
  const handleClick = async (conversation) => {
    // set clicked on window as active chat
    await dispatch(setActiveChat(otherUser.username));
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



// import React, { Component } from "react";
// import { Box } from "@material-ui/core";
// import { BadgeAvatar, ChatContent } from "../Sidebar";
// import { withStyles } from "@material-ui/core/styles";
// import { setActiveChat } from "../../store/activeConversation";
// import { connect } from "react-redux";

// const styles = {
//   root: {
//     borderRadius: 8,
//     height: 80,
//     boxShadow: "0 2px 10px 0 rgba(88,133,196,0.05)",
//     marginBottom: 10,
//     display: "flex",
//     alignItems: "center",
//     "&:hover": {
//       cursor: "grab",
//     },
//   },
//   unread: {
//     height: "30px",
//     width: "30px",
//     color: "white",
//     fontWeight: "bold",
//     backgroundColor: "#3A8DFF",
//     borderRadius: "50%",
//     display: "flex",
//     justifyContent: 'center',
//     alignItems: 'center',
//     marginRight: '10px',
//   },
//   hidden: {
//     display: 'none'
//   }
// };

// class Chat extends Component {
//   handleClick = async (conversation) => {
//     // set clicked on window as active chat
//     await this.props.setActiveChat(conversation.otherUser.username);
//   };

//   render() {
//     const { classes } = this.props;
//     const otherUser = this.props.conversation.otherUser;
//     const unreadCount = this.props.conversation.messages.filter(message => message.senderId === otherUser.id && message.unread).length;

//     return (
//       <Box
//         onClick={() => this.handleClick(this.props.conversation)}
//         className={classes.root}
//       >
//         <BadgeAvatar
//           photoUrl={otherUser.photoUrl}
//           username={otherUser.username}
//           online={otherUser.online}
//           sidebar={true}
//         />
//         <ChatContent conversation={this.props.conversation} />
//         {this.props.conversation.otherUser.username !== this.props.activeConversation &&
//           <div className={`${classes.unread} ${(unreadCount === 0 ? classes.hidden : null)}`}>{unreadCount}</div>
//         }
//       </Box>
//     );
//   }
// }

// const mapStateToProps = (state) => {
//   return {
//     conversations: state.conversations,
//     activeConversation: state.activeConversation,
//     user: state.user,
//   };
// };


// const mapDispatchToProps = (dispatch) => {
//   return {
//     setActiveChat: (id) => {
//       dispatch(setActiveChat(id));
//     },
//   };
// };

// export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(Chat));