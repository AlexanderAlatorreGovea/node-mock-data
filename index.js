const axios = require("axios");
const { faker } = require("@faker-js/faker");

const IDEA_GENERATOR = "https://appideagenerator.com/call.php";
const IDEA_API = "http://localhost:4000";

const randomInt = () => Math.floor(Math.random() * 10);

const generateIdea = async () => {
  const { data } = await axios.get(IDEA_GENERATOR);

  return data.replace(/\n/g, "");
};

const generateUser = async () => {
  try {
    const randomName = faker.name.findName();

    const { data } = await axios.post(
      `${IDEA_API}/register`,
      {
        username: randomName,
        password: "password",
      },
      {
        headers: {
          "content-type": "application/json",
        },
      }
    );
  
    return data.token; 
  } catch (error) {
    error.message
  }
};

const postNewIdea = async (token) => {
  try {
    const idea = await generateIdea();
    const data = await axios.post(
      `${IDEA_API}/api/ideas`,
      {
        idea,
        description: faker.lorem.paragraph(),
      },
      {
        headers: {
          "content-type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );
  
    return idea;
  } catch (error) {
    console.log(error) 
  }
};

(async () => {
  const randUserNum = randomInt();
  const randIdeaNum = randomInt();

  for (const index = 0; index < randUserNum; index++) {
    const token = await generateUser();
    for (const j = 0; j < randIdeaNum; j++) {
      const idea = await postNewIdea(token);
    }
  }
})();
