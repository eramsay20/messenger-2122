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

    let conversation = await Conversation.findByPk(conversationId);

    if(conversation){
      // if req.user not a member of the conversation, return 403 early
      if (!(conversation.user1Id === senderId) && !(conversation.user2Id === senderId)) return res.sendStatus(403);

      const message = await Message.create({
        senderId,
        text,
        conversationId: conversationId,
      });
      return res.json({ message, sender });
    } 

    conversation = await Conversation.create({ user1Id: senderId, user2Id: recipientId });
    
    if (onlineUsers.includes(sender.id)) sender.online = true;

    const message = await Message.create({
      senderId,
      text,
      conversationId: conversation.id,
    });

    return res.json({ message, sender });

  } catch (error) {
    next(error);
  }
});

module.exports = router;
