const redisClient = require('../database/redis');

class MessageStore {
  saveMessage(message) {}
  findMessagesForUser(userID) {}
}

const CONVERSATION_TTL = 24 * 60 * 60;

class RedisMessageStore extends MessageStore {
  constructor(redisClient) {
    super();
    this.redisClient = redisClient;
  }

  saveMessage(message) {
    const value = JSON.stringify(message);
    this.redisClient
      .multi()
      .rpush(`messages:${message.from}`, value)
      .rpush(`messages:${message.to}`, value)
      .expire(`messages:${message.from}`, CONVERSATION_TTL)
      .expire(`messages:${message.to}`, CONVERSATION_TTL)
      .exec();
  }

  findMessagesForUser(userID) {
    return this.redisClient.lrange(`messages:${userID}`, 0, -1).then((results) => {
      return results.map((result) => JSON.parse(result));
    });
  }
}
// let messageStorage;
// function initMessageStorage() {
//   messageStorage = new RedisMessageStore(redisClient);
// }
// function getMessageStorage() {
//   if (messageStorage === null) {
//     initMessageStorage(redisClient);
//   }
//   return messageStorage;
// }

module.exports = {
  RedisMessageStore,
};
