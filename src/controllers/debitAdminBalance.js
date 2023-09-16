const db = require("../connections/db");

let currentUTCTime = new Date();
let diff = -currentUTCTime.getTimezoneOffset();
const currentISTMins = currentUTCTime.getMinutes() + diff;
currentUTCTime.setMinutes(currentISTMins);
currentUTCTime.toISOString();

const debitAdminBalance = async (req, res) => {
  const requestBody = {
    query: { userName: req.body.userName },
    update: {
      $inc: {
        balance: -Number(req.body.transferAmount),
        totalWithdrawal: Number(req.body.transferAmount)
      },
      $push: {
        financialDetails: {
          dateAndTime: currentUTCTime,
          description: "Withdraw",
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

module.exports = debitAdminBalance;
