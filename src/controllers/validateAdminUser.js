const lodash = require("lodash");
const db = require("../connections/db");

const validateAdminUser = async (req, res) => {
  const fetchUserReqBody = {
    query: { userName: req.body.userName },
    database: "admin-panel",
    collection: "admin-users",
    method: "findOne",
  };

  let currentUTCTime = new Date();
  let diff = -currentUTCTime.getTimezoneOffset();
  const currentISTMins = currentUTCTime.getMinutes() + diff;
  currentUTCTime.setMinutes(currentISTMins);
  currentUTCTime.toISOString();

  const updateLoginReqBody = {
    query: { userName: req.body.userName },
    update: {
      $push: {
        lastLogins: {
          userPlatform: req.body.userPlatform,
          userBrowser: req.body.userBrowser,
          userIPAddress: req.body.userIPAddress,
          userCity: req.body.userCity,
          loginTime: currentUTCTime,
        },
      },
    },
    database: "admin-panel",
    collection: "admin-users",
    method: "updateOneWithUpsert",
  };
  try {
    const data = await db(fetchUserReqBody);
    !lodash.isEmpty(data) && await db(updateLoginReqBody);
    const isError =
      lodash.isEmpty(data) ||
      data.isBlocked ||
      data.isDeleted ||
      data.password !== req.body.password;

    if (!isError) {
      return res.status(200).json({
        isSuccessful: true,
        successCode: "0000",
        data,
      });
    } else {
      if (lodash.isEmpty(data))
        res.status(401).json({
          isSuccessful: true,
          errorMessage: "User not found!!!",
        });
      else if (data.isDeleted)
        res.status(401).json({
          isSuccessful: true,
          errorMessage: "User is deleted !!!",
        });
      else if (data.isBlocked)
        res.status(401).json({
          isSuccessful: true,
          errorMessage: "User is not in active state!!!",
        });
      else if (data.password !== req.body.password)
        res.status(401).json({
          isSuccessful: true,
          errorMessage: "Password Incorrect !!!",
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

module.exports = validateAdminUser;
