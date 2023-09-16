const db = require("../connections/db");

const clearPLBalance = async (req, res) => {
  const reqBody = {
    query: { userName: req.body.userName },
    update: {
      $set: {
        plBalance: 0,
      },
    },
    database: "admin-panel",
    collection: "admin-users",
    method: "updateOne",
  };
  try {
    const existedAdmin = await db(reqBody);

    if (existedAdmin.acknowledged) {
      res.status(200).json({
        isSuccessful: true,
        successCode: "0000",
      });
    } else {
      res.status(400).json({
        isSuccessful: false,
        errorMessage: "Invalid User details!",
      });
    }
  } catch (err) {
    res.status(500).json({
      isSuccessful: false,
      errorMessage: "Internal Server Error",
      data: { err },
    });
  }
};

module.exports = clearPLBalance;