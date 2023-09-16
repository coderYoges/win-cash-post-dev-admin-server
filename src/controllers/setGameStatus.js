const db = require("../connections/db");

const setGameStatus = async (req, res) => {
  const gameName = req.body.gameName;
  const requestBody = {
    query: {docName: gameName },
    update: {
      $set: {
        blocked: req.body.blocked,
        removed: req.body.removed,
        blockRemarks: req.body.blockRemarks,
        mode: req.body.mode
      },
    },
    database: "admin-panel",
    collection: "admin-utils",
    method: "updateOneWithoutUpsert",
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

module.exports = setGameStatus;
