const lodash = require("lodash");
const db = require("../connections/db");

const getCommissionRates = async (req, res) => {
  const fetchCommissions = {
    query: { docName: "commissions" },
    database: "admin-panel",
    collection: "admin-utils",
    method: "findOne",
  };

  try {
    const data = await db(fetchCommissions);
    if (!lodash.isEmpty(data)) {
      return res.status(200).json({
        isSuccessful: true,
        successCode: "0000",
        data,
      });
    } else {
      return res.status(401).json({
        isSuccessful: true,
        errorMessage: "Data not found!!!",
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

module.exports = getCommissionRates;
