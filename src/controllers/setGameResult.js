const db = require("../connections/db");

const setGameResult = async (req, res) => {
  const requestBody = {
    query: { sequenceNumber: req.body.sequenceNumber },
    update: {
      $set: {
        winnerOption: req.body.winnerOption,
      },
    },
    database: "game-panel",
    collection: req.body.gameId,
    method: "updateOne",
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

module.exports = setGameResult;
