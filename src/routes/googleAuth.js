const { OAuth2Client } = require('google-auth-library');
const { User } = require('../models');
const router = require('express').Router();
const config = require('../config');
const { authSign } = require('../util/jwt-util');

const client = new OAuth2Client(config.GOOGLE_CLIENT_ID);

router.post('/login', async (req, res) => {
  try {
    const { tokenId } = req.body.data;

    const ticket = await client
      .verifyIdToken({ idToken: tokenId, audience: config.GOOGLE_CLIENT_ID })
      .then((response) => {
        const payload = ticket.getPayload();
      });
  } catch (error) {}
});

module.exports = router;
