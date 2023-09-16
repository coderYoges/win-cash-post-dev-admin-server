const express = require("express");
const users = express.Router();

const getAllUsers = require("../controllers/getAllUsers");
const validateAdminUser = require("../controllers/validateAdminUser");
const createUser = require("../controllers/createUser");
const getUsers = require("../controllers/getUsers");
const deleteUser = require("../controllers/deleteUser");
const updateUserStatus = require("../controllers/updateUserStatus");
const updateUserPassword = require("../controllers/updateUserPassword");
const updateUserBankDetails = require("../controllers/updateUserBankDetails");
const addUserBalance = require("../controllers/addUserBalance");
const debitUserBalance = require("../controllers/debitUserBalance");
const getAdminsByParentId = require("../controllers/getAdminsByParentId");
const createAdmin = require("../controllers/createAdmin");
const getAdminDetails = require("../controllers/getAdminDetails");
const updateAdminPassword = require("../controllers/updateAdminPassword");
const updateAdminBankDetails = require("../controllers/updateAdminBankDetails");
const deleteAdmin = require("../controllers/deleteAdmin");
const updateAdminStatus = require("../controllers/updateAdminStatus");
const addAdminBalance = require("../controllers/addAdminBalance");
const debitAdminBalance = require("../controllers/debitAdminBalance");
const getCurrentGames = require("../controllers/getCurrentGames");
const setGameStatus = require("../controllers/setGameStatus");
const getGameStatus = require("../controllers/getGameStatus");
const setGameResult = require('../controllers/setGameResult');
const setCommissionRates = require('../controllers/setCommissionRates');
const getCommissionRates = require('../controllers/getCommissionRates');
const updateDues = require('../controllers/updateDues');
const getAdminsList = require('../controllers/getAdminsList');
const getUsersList = require('../controllers/getUsersList');
const clearPLBalance = require('../controllers/clearPLBalance');

users.get("/getAllUsers", getAllUsers);
users.get("/getGameStatus", getGameStatus);
users.get("/getCommissionRates", getCommissionRates)
users.post("/validateAdminUser", validateAdminUser);
users.post("/createUser", createUser);
users.post("/getUsers", getUsers);
users.post("/deleteUser", deleteUser);
users.post("/updateUserStatus", updateUserStatus);
users.post("/updateUserPassword", updateUserPassword);
users.post("/updateUserBankDetails", updateUserBankDetails);
users.post("/addUserBalance", addUserBalance);
users.post("/debitUserBalance", debitUserBalance);
users.post("/getAdminsByParentId", getAdminsByParentId);
users.post("/createAdmin", createAdmin);
users.post("/getAdminDetails", getAdminDetails);
users.post("/updateAdminPassword", updateAdminPassword);
users.post("/updateAdminBankDetails", updateAdminBankDetails);
users.post("/deleteAdmin", deleteAdmin);
users.post("/updateAdminStatus", updateAdminStatus);
users.post("/addAdminBalance", addAdminBalance);
users.post("/debitAdminBalance", debitAdminBalance);
users.post("/getCurrentGames", getCurrentGames);
users.post("/setGameStatus", setGameStatus);
users.post('/setGameResult', setGameResult)
users.post("/setCommissionRates", setCommissionRates)
users.post('/updateDues', updateDues);
users.post('/getAdminsList', getAdminsList);
users.post('/getUsersList', getUsersList);
users.post('./clearPLBalance', clearPLBalance);

module.exports = users;
