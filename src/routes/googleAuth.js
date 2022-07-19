const { OAuth2Client } = require('google-auth-library');
const { User } = require('../models');
const router = require('express').Router();
const config = require('../config');
const { authSign } = require('../util/jwt-util');

const client = new OAuth2Client(config.GOOGLE_CLIENT_ID);

router.post('/login', async (req, res) => {
  try {
    const { tokenId } = req.body.data;

    client.verifyIdToken({ idToken: tokenId, audience: config.GOOGLE_CLIENT_ID }).then((response) => {
      const { email, nickname, iconUrl } = response.getPayload();

      if (email) {
        User.findOne({ eamil: email }, (err, user) => {
          if (err) return res.status(400).send({ result: false, err });
          let accessToken = '';
          if (user) {
            accessToken = authSign({ email, nickname, iconUrl });
            res.status(200).send({
              accessToken,
            });
          } else {
            const newUser = new User({
              email,
              nickname,
              iconUrl,
            });
            newUser.save();
            accessToken = authSign({ newUser });
            res.status(200).send({
              accessToken,
            });
          }
        });
      }
    });
  } catch (error) {
    res.status(400).send({
      result: false,
      msg: error.message,
    });
  }
});

module.exports = router;
