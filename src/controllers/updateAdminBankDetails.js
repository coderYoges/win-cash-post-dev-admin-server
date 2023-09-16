const db = require("../connections/db");

const updateAdminBankDetails = async (req, res) => {
  const requestBody = {
    query: { userName: req.body.userName },
    update: {
      $set: {
        upiId: req.body.upiId,
        bankName: req.body.bankName,
        ifscCode: req.body.ifscCode,
        accountHolderName: req.body.accountHolderName,
        accountNo: req.body.accountNo,
      },
    },
    database: "admin-panel",
    collection: "admin-users",
    method: "updateOneWithUpsert",
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

module.exports = updateAdminBankDetails;
