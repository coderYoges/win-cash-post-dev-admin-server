const lodash = require("lodash");
const db = require("../connections/db");
const { client } = require("../config/client");

const createUser = async (req, res) => {
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

  const commissionTiersReqBody = {
    query: { docName: "commissions" },
    database: "admin-panel",
    collection: "admin-utils",
    method: "findOne",
  };

  try {
    const existedUser = await db(usersReqBody);
    const existedAdmin = await db(adminReqBody);
    const commissionsTier = await db(commissionTiersReqBody);

    const tier1CommissionPercentage = lodash.get(
      commissionsTier,
      "tier1Percentage"
    );

    const createUserReqBody = {
      query: {},
      update: {
        balance: Number(req.body.balance),
        tier1Parent: lodash.get(req, "body.tier1Parent", ""),
        tier2Parent: lodash.get(req, "body.tier2Parent", ""),
        tier3Parent: lodash.get(req, "body.tier3Parent", ""),
        mainParentCommission:
          Number(req.body.balance) * (tier1CommissionPercentage / 100),
        userName: req.body.userName,
        userRole: "user",
        isUserDisabled: false,
        isUserDeleted: false,
        password: req.body.password,
        totalDeposits: Number(req.body.balance),
        totalWithdrawal: 0,
        lastLogins: [],
        financialDetails: [
          {
            dateAndTime: currentUTCTime,
            description: `Balance Trasfer from ${req.body.tier1Parent}`,
            isCredit: true,
            amount: Number(req.body.balance),
          },
        ],
      },
      database: "user-panel",
      collection: "users",
      method: "insertOne",
    };

    if (lodash.isEmpty(existedUser) && lodash.isEmpty(existedAdmin)) {
      const createdUser = await db(createUserReqBody);
      if (req.body.balance) {
        // Tier 1 Parent
        if (req.body.tier1Parent) {
          const tier1Commission =
            Number(req.body.balance) * (tier1CommissionPercentage / 100);

          const tier1ReqBody = {
            query: { userName: req.body.tier1Parent },
            update: {
              $inc: {
                balance: req.body.parentRole === 'superadmin' ? 0 : -(Number(req.body.balance) - tier1Commission),
                totalCommissions: tier1Commission,
              },
              $push: {
                financialDetails: {
                  dateAndTime: currentUTCTime,
                  description: `Account topup of ${req.body.balance} to ${req.body.userName} and getting commission of ${tier1Commission} `,
                  isCredit: false,
                  amount: Number(req.body.balance) - tier1Commission,
                },
                commissionDetails: {
                  dateAndTime: currentUTCTime,
                  userName: req.body.userName,
                  amount: tier1Commission,
                  transferedAmount: req.body.balance,
                  commissionPercentage: tier1CommissionPercentage,
                },
                totalUsers: req.body.userName,
              },
            },
            database: "admin-panel",
            collection: "admin-users",
            method: "updateOne",
          };
          const updateTier1Parent = await db(tier1ReqBody);
          if (!updateTier1Parent.acknowledged) {
            res.status(400).json({
              isSuccessful: true,
              errorMessage: "Tier1 Parent updation error !!!",
            });
          }
        }

        // Tier 2 Parent
        if (req.body.tier2Parent) {
          const tier2CommissionPercentage = lodash.get(
            commissionsTier,
            "tier2Percentage"
          );
          const tier2Commission =
            Number(req.body.balance) * (tier2CommissionPercentage / 100);
          const tier2ReqBody = {
            query: { userName: req.body.tier2Parent },
            update: {
              $inc: {
                balance: tier2Commission,
                totalCommissions: tier2Commission,
              },
              $push: {
                financialDetails: {
                  dateAndTime: currentUTCTime,
                  description: `Commission for account transfer to ${req.body.userName}`,
                  isCredit: true,
                  amount: tier2Commission,
                },
                commissionDetails: {
                  dateAndTime: currentUTCTime,
                  userName: req.body.userName,
                  amount: tier2Commission,
                  transferedAmount: req.body.balance,
                  commissionPercentage: tier2CommissionPercentage,
                },
                totalUsers: req.body.userName,
              },
            },
            database: "admin-panel",
            collection: "admin-users",
            method: "updateOne",
          };
          const updateTier2Parent = await db(tier2ReqBody);
          if (!updateTier2Parent.acknowledged) {
            res.status(400).json({
              isSuccessful: true,
              errorMessage: "Tier2 Parent updation error !!!",
            });
          }
        }

        // Tier 3 Parent
        if (req.body.tier3Parent) {
          const tier3CommissionPercentage = lodash.get(
            commissionsTier,
            "tier3Percentage"
          );
          const tier3Commission =
            Number(req.body.balance) * (tier3CommissionPercentage / 100);
          const tier3ReqBody = {
            query: { userName: req.body.tier3Parent },
            update: {
              $inc: {
                balance: tier3Commission,
                totalCommissions: tier3Commission,
              },
              $push: {
                financialDetails: {
                  dateAndTime: currentUTCTime,
                  description: `Commission for account transfer to ${req.body.userName}`,
                  isCredit: true,
                  amount: tier3Commission,
                },
                commissionDetails: {
                  dateAndTime: currentUTCTime,
                  userName: req.body.userName,
                  amount: tier3Commission,
                  transferedAmount: req.body.balance,
                  commissionPercentage: tier3CommissionPercentage,
                },
                totalUsers: req.body.userName,
              },
            },
            database: "admin-panel",
            collection: "admin-users",
            method: "updateOne",
          };
          const updateTier3Parent = await db(tier3ReqBody);
          if (!updateTier3Parent.acknowledged) {
            res.status(400).json({
              isSuccessful: true,
              errorMessage: "Tier3 Parent updation error !!!",
            });
          }
        }
      }

      return createdUser.acknowledged
        ? res.status(200).json({
            isSuccessful: true,
            successCode: "0000",
          })
        : res.status(401).json({
            isSuccessful: true,
            errorMessage: "User creation went wrong!!!",
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
  } finally {
    await client.close();
  }
};

module.exports = createUser;
