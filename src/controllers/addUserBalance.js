const db = require("../connections/db");
const lodash = require("lodash");

const addUserBalance = async (req, res) => {
  let currentUTCTime = new Date();
  const currentISTMins =
    currentUTCTime.getMinutes() - currentUTCTime.getTimezoneOffset();
  currentUTCTime.setMinutes(currentISTMins);
  currentUTCTime.toISOString();

  const commissionTiersReqBody = {
    query: { docName: "commissions" },
    database: "admin-panel",
    collection: "admin-utils",
    method: "findOne",
  };

  const commission =
    Number(req.body.transferAmount) > 0
      ? Number(req.body.transferAmount) / 10
      : 0;

  const debitBalWithoutCommission = Number(
    req.body.transferAmount - commission
  );

  const adminReqBody = {
    query: { userName: req.body.parentName },
    update: {
      $inc: {
        balance: req.body.parentRole === 'superadmin' ? 0 : -debitBalWithoutCommission,
        totalCommissions: commission,
      },
      $push: {
        financialDetails: {
          dateAndTime: currentUTCTime,
          description: `Account topup to ${req.body.userName}`,
          isCredit: false,
          amount: Number(req.body.transferAmount),
        },
        commissionDetails: {
          dateAndTime: currentUTCTime,
          userName: req.body.userName,
          amount: Number(req.body.transferAmount) / 10,
        },
      },
    },
    database: "admin-panel",
    collection: "admin-users",
    method: "updateOne",
  };

  try {
    const commissionsTier = await db(commissionTiersReqBody);

    const tier1CommissionPercentage = lodash.get(
      commissionsTier,
      "tier1Percentage"
    );

    const usersReqBody = {
      query: { userName: req.body.userName },
      update: {
        $inc: {
          balance: Number(req.body.transferAmount),
          totalDeposits: Number(req.body.transferAmount),
          mainParentCommission:
            Number(req.body.transferAmount) * (tier1CommissionPercentage / 100),
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
      database: "user-panel",
      collection: "users",
      method: "updateOne",
    };

    const updatedUser = await db(usersReqBody);

    // Tier 1 Parent
    if (req.body.tier1Parent) {
      const tier1Commission =
        Number(req.body.transferAmount) * (tier1CommissionPercentage / 100);

      const tier1ReqBody = {
        query: { userName: req.body.tier1Parent },
        update: {
          $inc: {
            balance: req.body.parentRole === 'superadmin' ? 0 : -(Number(req.body.transferAmount) - tier1Commission),
            totalCommissions: tier1Commission,
          },
          $push: {
            financialDetails: {
              dateAndTime: currentUTCTime,
              description: `Account topup of ${req.body.transferAmount} to ${req.body.userName} and getting commission of ${tier1Commission} `,
              isCredit: false,
              amount: Number(req.body.transferAmount) - tier1Commission,
            },
            commissionDetails: {
              dateAndTime: currentUTCTime,
              userName: req.body.userName,
              amount: tier1Commission,
              transferedAmount: req.body.transferAmount,
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
        Number(req.body.transferAmount) * (tier2CommissionPercentage / 100);
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
              transferedAmount: req.body.transferAmount,
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
        Number(req.body.transferAmount) * (tier3CommissionPercentage / 100);
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
              transferedAmount: req.body.transferAmount,
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

    const existedAdmin = await db(adminReqBody);

    if (updatedUser.acknowledged && existedAdmin.acknowledged) {
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

module.exports = addUserBalance;
