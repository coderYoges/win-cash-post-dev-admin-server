const db = require("../connections/db");

const updateDues = async (req, res) => {
  const requestBody = {
    query: { userName: req.body.userName },
    update: {
      $set: {
        plBalance: 0
      },
    },
    database: "admin-panel",
    collection: "admin-users",
    method: "updateOne",
  };

  try {
    const data = await db(requestBody);
    if (data.acknowledged)
      res.status(200).json({
        isSuccessful: true,
        successCode: "0000",
        data,
      });
    else
      res.status(400).json({
        isSuccessful: false,
        errorMessage: "Invalid User details!",
      });
  } catch (error) {
    res.status(500).json({
      isSuccessful: false,
      errorMessage: "Internal Server Error",
      data: { error },
    });
  }
};

module.exports = updateDues;
