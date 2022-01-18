const { randomUUID } = require('crypto');
const mongoose = require('mongoose');

require('dotenv').config();
require('./models/User');
require('./models/Item');
require('./models/Comment');

const User = mongoose.model('User');
const Item = mongoose.model('Item');
const Comment = mongoose.model('Comment');
const NUMBER_OF_USERS_TO_CREATE = 100;

mongoose.connect(process.env.MONGODB_URI);
mongoose.connection.once('open', () => {
  console.log('connected to mongodb');
});

const createUser = async () => {
  const randomId = randomUUID().split('-')[0];
  const user = new User({ username: `DummyUserWilco${randomId}`, email: `dummy${randomId}@dummy.com` });
  return user.save().then(user => {
    console.log(`created user ${user.username}`);
    return user;
  });
};

const createItem = async user => {
  const randomId = randomUUID();
  const randomNum = Math.floor(Math.random() * 200);

  const itemData = {
    slug: `test-item-${randomId}`,
    title: `Test Item-${randomId.split('-')[0]}`,
    description: 'Dummy item with random bear image',
    image: `https://placebear.com/g/200/${randomNum}`,
    favoritesCount: 0,
    comments: [],
    tagList: ['bear', 'dummy']
  };

  const item = new Item(itemData);
  item.seller = user;

  return item.save().then(item => {
    console.log(`${randomId} item created`);
    return item;
  });
};

const createComment = async (user, item) => {
  const commentData = {
    body: 'Just a dummy comment, bla bla bla.'
  };

  const comment = new Comment(commentData);
  comment.seller = user;
  comment.item = item;

  return comment.save().then(() => {
    item.comments = item.comments.concat([comment]);
    return item.save().then(() => {
      console.log(`comment created`);
    });
  });
};

const populateDummyUsers = async () => {
  const usersToCreate = new Array(NUMBER_OF_USERS_TO_CREATE).fill();
  return Promise.all(usersToCreate.map(() => createUser()));
};

const populateDummyData = async () => {
  try {
    const users = await populateDummyUsers();
    for (const user of users) {
      const item = await createItem(user);
      await createComment(user, item);
    }
    console.log('created dummy data');
  } catch (err) {
    console.log(err);
  }

  process.exit();
};

populateDummyData();
