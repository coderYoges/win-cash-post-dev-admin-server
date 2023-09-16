const db = require("../connections/db");

const getUsersList = async (req, res) => {
  const requestBody = {
    query: { $or : [
        { tier1Parent: req.body.parentName },
        { tier2Parent: req.body.parentName },
        { tier3Parent: req.body.parentName }
    ] },
    database: "user-panel",
    collection: "users",
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

module.exports = getUsersList;
