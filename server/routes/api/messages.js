const router = require("express").Router();
const { Conversation, Message } = require("../../db/models");
const onlineUsers = require("../../onlineUsers");
const { Op } = require("sequelize");

// expects {recipientId, text, conversationId } in body (conversationId will be null if no conversation exists yet)
router.post("/", async (req, res, next) => {
  try {
    if (!req.user) return res.sendStatus(401);

    const senderId = req.user.id;
    const { recipientId, text, conversationId, sender } = req.body;

    const conversationExists = await Conversation.findConversation(senderId, recipientId);

    const userAllowedConversations = await Conversation.findAll({
      where: {
        [Op.or]: {
          user1Id: senderId,
          user2Id: senderId,
        },
      },
    })
    
    const allowedConversationExists = userAllowedConversations.find(conversation => conversation.id === conversationId)

    // ER: if no existing convo between req.user and recipient, make a new convo and save the message
    if (!conversationExists) {
      let newConversation = await Conversation.create({ user1Id: senderId, user2Id: recipientId });

      if (onlineUsers.includes(sender.id)) sender.online = true;

      const message = await Message.create({
        senderId,
        text,
        conversationId: newConversation.id,
      });

      return res.json({ message, sender });

    // ER: if a conversation exists between req.user and recipient, but req.user is not user1 or user2 in the convo for which they're trying to post in, return permissions error
    } else if (conversationExists && !allowedConversationExists){ 

      return res.sendStatus(401);

    // ER: convo exists, and user has permission to post
    } else {
      const message = await Message.create({
        senderId,
        text,
        conversationId: conversationId,
      });

      return res.json({ message, sender });
    }
  } catch (error) {
    next(error);
  }
});

module.exports = router;
