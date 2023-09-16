const db = require("../connections/db");

const setCommissionRates = async (req, res) => {
  const fetchCommissions = {
    query: { docName: "commissions" },
    update: {
      $set: {
        tier1Percentage: Number(req.body.tier1Percentage),
        tier2Percentage: Number(req.body.tier2Percentage),
        tier3Percentage: Number(req.body.tier3Percentage),
      },
    },
    database: "admin-panel",
    collection: "admin-utils",
    method: "updateOneWithoutUpsert",
  };

  try {
    const data = await db(fetchCommissions);
    if (data.acknowledged) {
      return res.status(200).json({
        isSuccessful: true,
        successCode: "0000",
        data,
      });
    } else {
      return res.status(401).json({
        isSuccessful: true,
        errorMessage: "Error updating commission rates!!!",
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

module.exports = setCommissionRates;
