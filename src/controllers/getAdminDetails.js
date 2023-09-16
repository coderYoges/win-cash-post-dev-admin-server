const lodash = require("lodash");
const db = require("../connections/db");

const getAdminDetails = async (req, res) => {
  const fetchUserReqBody = {
    query: { userName: req.body.userName },
    database: "admin-panel",
    collection: "admin-users",
    method: "findOne",
  };

  try {
    const data = await db(fetchUserReqBody);
    if (!lodash.isEmpty(data)) {
      return res.status(200).json({
        isSuccessful: true,
        successCode: "0000",
        data,
      });
    } else {
      return res.status(401).json({
        isSuccessful: true,
        errorMessage: "User not found!!!",
      });
    }
  } catch (err) {
    console.log("error", err);
    res.status(500).json({
      isSuccessful: true,
      errorMessage: "Internal Server Error",
    });
  }
};

module.exports = getAdminDetails;
