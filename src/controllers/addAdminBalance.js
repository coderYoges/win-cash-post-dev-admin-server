const db = require("../connections/db");

const addAdminBalance = async (req, res) => {
  let currentUTCTime = new Date();
  let diff = -currentUTCTime.getTimezoneOffset();
  const currentISTMins = currentUTCTime.getMinutes() + diff;
  currentUTCTime.setMinutes(currentISTMins);
  currentUTCTime.toISOString();

  const usersReqBody = {
    query: { userName: req.body.userName },
    update: {
      $set: {
        clearedDues: false
      },
      $inc: {
        balance: Number(req.body.transferAmount),
        totalDeposits: Number(req.body.transferAmount),
      },
      $push: {
        financialDetails: {
          dateAndTime: currentUTCTime,
          description: `Amount Transfer from ${req.body.tier1Parent}`,
          isCredit: true,
          amount: Number(req.body.transferAmount),
        },
      },
    },
    database: "admin-panel",
    collection: "admin-users",
    method: "updateOne",
  };

  const adminReqBody = {
    query: { userName: req.body.tier1Parent },
    update: {
      $inc: {
        balance: req.body.parentRole === 'superadmin' ? 0 : -req.body.transferAmount,
      },
      $push: {
        financialDetails: {
          dateAndTime: currentUTCTime,
          description: `Account topup to ${req.body.userName}`,
          isCredit: false,
          amount: Number(req.body.transferAmount),
        },
      },
    },
    database: "admin-panel",
    collection: "admin-users",
    method: "updateOne",
  };

  try {
    const existedUser = await db(usersReqBody);
    const existedAdmin = await db(adminReqBody);

    if (existedUser.acknowledged && existedAdmin.acknowledged) {
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

module.exports = addAdminBalance;
