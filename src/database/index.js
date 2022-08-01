const config = require('../config');

const mongoose = require('mongoose');

<<<<<<< HEAD
// const connect = async () => {
//   await mongoose
//     .connect(
//       `mongodb+srv://${config.MONGO_USERNAME}:${config.MONGO_PASSWORD}@${config.MONGO_URL}/?retryWrites=true&w=majority`,
//       {
//         ignoreUndefined: true,
//       },
//     )
//     .catch((err) => {
//       console.error(err);
//     });
// };

const connect = () => {
  mongoose.connect(config.MONGO_URL, { ignoreUndefined: true }).catch((err) => {
    console.error(err);
  });
};

// 여기에 스키마 함수 만들기

=======
const connect = async () => {
  await mongoose
    .connect(
      `mongodb+srv://${config.MONGO_USERNAME}:${config.MONGO_PASSWORD}@${config.MONGO_URL}/?retryWrites=true&w=majority`,
      {
        ignoreUndefined: true,
      },
    )
    .catch((err) => {
      console.error(err);
    });
};

>>>>>>> 7a16f0b2ec985004b01594fe3846a792533a8e1e
module.exports = connect;
