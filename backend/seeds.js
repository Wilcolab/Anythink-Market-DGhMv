const axios = require('axios');

const DUMMY_EMAIL = 'dummy@dummy.com';
const DUMMY_PASSWORD = '1234';
const PORT = process.env.PORT || 3000;
const BASE_URL = `http://localhost:${PORT}/api/`;

const createUser = async () => {
  try {
    const res = await axios.post(`${BASE_URL}users`, {
      user: {
        username: 'DummyUserWilco',
        email: DUMMY_EMAIL,
        password: DUMMY_PASSWORD
      }
    });
    return res.data;
  } catch (e) {
    console.log(e.message);
    throw e;
  }
};

const userLogin = async () => {
  try {
    const res = await axios.post(`${BASE_URL}users/login`, {
      user: {
        email: DUMMY_EMAIL,
        password: DUMMY_PASSWORD
      }
    });
    return res.status !== 200 ? false : res.data;
  } catch (e) {
    console.log(e.message);
    return false;
  }
};

const postItem = async token => {
  const randomNum = Math.floor(Math.random() * 999);
  try {
    await axios.post(
      `${BASE_URL}items`,
      {
        item: {
          slug: `test-item-${randomNum}`,
          title: 'Test Item',
          description: 'Dummy item with random bear image',
          image: `https://placebear.com/g/200/${randomNum}`
        }
      },
      { headers: { Authorization: `Bearer ${token}` } }
    );
  } catch (e) {
    console.log(e.message);
  }
};

const getItemsCount = async () => {
  try {
    const res = await axios.get(`${BASE_URL}items`);
    return res.data.itemsCount;
  } catch (e) {
    console.log(e.message);
  }
};

const populateDummyData = async () => {
  const itemsCount = await getItemsCount();
  if (itemsCount > 42) {
    console.log('You have enough dummy data');
    return;
  }
  let user;
  const isUserExist = await userLogin();
  if (isUserExist) {
    user = isUserExist;
    console.log('used logged in user');
  } else {
    user = await createUser();
    console.log('created new user');
  }
  const itemsToCreate = new Array(42).fill();
  await Promise.all(itemsToCreate.map(() => postItem(user.user.token)));
  console.log('created dummy data');
};

populateDummyData();
