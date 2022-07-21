class SessionStore {
  findSession(id) {}
  saveSession(id, session) {}
}

// userId / nickname
const SESSION_TTL = 24 * 60 * 60;
const mapSession = ([userID, username, connected]) =>
  userID ? { userID, username, connected: connected === 'true' } : undefined;

class RedisSessionStore extends SessionStore {
  constructor(redisClient) {
    super();
    this.redisClient = redisClient;
  }

  findSession(id) {
    return this.redisClient.hmget(`session:${id}`, 'userID', 'username', 'connected').then(mapSession);
  }

  saveSession(id, { userID, username, connected }) {
    this.redisClient
      .multi() // exec에서 하나라도 실패하면 다 실패 레디스 트랜젝션 관리
      .hset(`session:${id}`, 'userID', userID, 'username', username, 'connected', connected)
      .expire(`session:${id}`, SESSION_TTL)
      .exec();
  }
}

module.exports = {
  RedisSessionStore,
};
