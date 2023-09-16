const lodash = require("lodash");
const db = require("../connections/db");

const createAdmin = async (req, res) => {
  const usersReqBody = {
    query: { userName: req.body.userName },
    database: "user-panel",
    collection: "users",
    method: "findOne",
  };
  const adminReqBody = {
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

  const createAdminReqBody = {
    query: {},
    update: {
      balance: Number(req.body.balance),
      plBalance: 0,
      tier1Parent: lodash.get(req, "body.tier1Parent", ""),
      tier2Parent: lodash.get(req, "body.tier2Parent", ""),
      tier3Parent: lodash.get(req, "body.tier3Parent", ""),
      userName: req.body.userName,
      userRole: req.body.userRole,
      isUserDisabled: false,
      isUserDeleted: false,
      password: req.body.password,
      totalDeposits: Number(req.body.balance),
      totalWithdrawal: 0,
      clearedDues: false,
      lastLogins: [],
      totalUsers: [],
      financialDetails: [
        {
          dateAndTime: currentUTCTime,
          description: `Balance Trasfer from ${req.body.tier1Parent}`,
          isCredit: true,
          amount: Number(req.body.balance),
        },
      ],
    },
    database: "admin-panel",
    collection: "admin-users",
    method: "insertOne",
  };

  const parentReqBody = {
    query: { userName: req.body.tier1Parent },
    update: {
      $inc: {
        balance:
          req.body.parentRole === "superadmin" ? 0 : -Number(req.body.balance),
      },
      $push: {
        financialDetails: {
          dateAndTime: currentUTCTime,
          description: `Account topup of ${req.body.balance} to ${req.body.userName} `,
          isCredit: false,
          amount: Number(req.body.balance),
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

    if (lodash.isEmpty(existedUser) && lodash.isEmpty(existedAdmin)) {
      const createdAdmin = await db(createAdminReqBody);
      const updatedParent = await db(parentReqBody);

      return createdAdmin.acknowledged && updatedParent.acknowledged
        ? res.status(200).json({
            isSuccessful: true,
            successCode: "0000",
          })
        : res.status(401).json({
            isSuccessful: true,
            errorMessage: "Something went wrong!!!",
          });
    } else {
      return res.status(401).json({
        isSuccessful: true,
        errorMessage: "User name already exist!!!",
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

module.exports = createAdmin;
