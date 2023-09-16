const db = require("../connections/db");

const getAdminsList = async (req, res) => {
  const requestBody = {
    query: { $or : [
        { tier1Parent: req.body.parentName },
        { tier2Parent: req.body.parentName },
        { tier3Parent: req.body.parentName }
    ] },
    database: "admin-panel",
    collection: "admin-users",
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

module.exports = getAdminsList;
