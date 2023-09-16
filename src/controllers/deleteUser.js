const db = require("../connections/db");

const deleteUser = async (req, res) => {
  const requestBody = {
    query: { userName: req.body.userName },
    database: "user-panel",
    collection: "users",
    method: "delete",
  };
  try {
    const data = await db(requestBody);
    if (data.acknowledged && data.deletedCount > 0)
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

module.exports = deleteUser;
