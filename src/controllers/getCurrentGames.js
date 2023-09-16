const db = require("../connections/db");

const getCurrentGames = async (req, res) => {
  const requestBody = {
    query: {},
    database: "game-panel",
    collection: req.body.gameCollection,
    method: "findWithLimit",
    sort: {
      _id: -1,
    },
    limit: 50,
  };
  try {
    const data = await db(requestBody);
    res.status(200).json({
      isSuccessful: true,
      successCode: "0000",
      data,
    });
  } catch (error) {
    res.status(500).json({
      isSuccessful: false,
      errorMessage: "Internal Server Error",
      data: { error },
    });
  }
};

module.exports = getCurrentGames;
