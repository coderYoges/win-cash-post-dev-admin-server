const db = require("../connections/db");

const getGameStatus = async (req, res) => {
  const requestBody = {
    query: {},
    database: "admin-panel",
    collection: "admin-utils",
    method: "find",
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

module.exports = getGameStatus;
