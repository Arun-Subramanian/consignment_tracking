/**
 * This file will contain all the routes
 * related to consignment management
 *
 * @author M. Thivagar
 * Last Modified - 01/05/2020
 *
 * ROUTES
 * -------
 * /add
 * /edit/id
 * /get/id
 */

const express = require("express");
const router = express.Router();
const logger = require("../logger");
const { INFO, ERROR } = require("../utils/constants").LOGGER_LEVEL;
const Consignment = require("../models/consignmentModel");
const middleware = require("../utils/middleware");

router.get("/get/:id*", middleware.verifyToken, (req, res) => {
  logger.log({
    level: INFO,
    message: `Going to fetch the consignment details based on the Contract number`,
  });
  let contractNumber = `${req.params["id"]}${req.params[0]}`;
  try {
    Consignment.find(
      { "Contract Number": contractNumber },
      (err, foundConsignment) => {
        if (err) {
          logger.log({
            level: ERROR,
            message: `Error while trying to retrieve the consignment details with contract number: ${req.params.id} with error: ${err}`,
          });
          res.send({
            success: false,
            statusCode: 500,
            message: `Error while retrieving the consignment details. Please try again later`,
          });
        } else {
          if (foundConsignment.length != 0) {
            logger.log({
              level: INFO,
              message: `Retrieved the consignment details successfully`,
            });
            res.send({
              success: true,
              statusCode: 200,
              data: foundConsignment[0],
            });
          } else {
            logger.log({
              level: INFO,
              message: `Retrieved the consignment details successfully. Consignment details not found`,
            });
            res.send({
              success: true,
              statusCode: 200,
              message: `Consignment details not found for given Contract Number`,
            });
          }
        }
      }
    );
  } catch (exception) {
    logger.log({
      level: ERROR,
      message: `Exception while fetching the consignment details`,
    });
    res.send({
      success: false,
      statusCode: 500,
      message: `Error while retrieving the consignment details. Please try again later`,
    });
  }
});

router.put("/edit/:id", middleware.verifyToken, (req, res) => {
  logger.log({
    level: INFO,
    message: `Going to update the consignment details for the contract number: ${req.params.id}`,
  });

  try {
    const obj = req.body.obj;
    Consignment.findByIdAndUpdate(req.params.id, obj, (err) => {
      if (err) {
        logger.log({
          level: ERROR,
          message: `Error while updating the consignment detail for contract number: ${req.params.id}`,
        });
        res.send({
          success: false,
          statusCode: 500,
          message: `Erro while updating the consignment detail. Please try again later`,
        });
      } else {
        logger.log({
          level: INFO,
          message: `Updated the consignment details successfully`,
        });
        res.send({
          success: true,
          statusCode: 200,
          message: "Updated the consignment details successfully",
        });
      }
    });
  } catch (exception) {
    logger.log({
      level: ERROR,
      message: `Exception while trying to update the consignment details`,
    });
    res.send({
      success: false,
      statusCode: 500,
      message: `Unable to update the consigment detail. Please try again later`,
    });
  }
});

router.post("/add", middleware.verifyToken, (req, res) => {
  try {
    const obj = req.body.obj;
    logger.log({
      level: INFO,
      message: `Going to add new consignment details`,
    });
    Consignment.create(obj, (err) => {
      if (err) {
        logger.log({
          level: ERROR,
          message: `Error while creating the new consignment with error: ${err}`,
        });
        res.send({
          statusCode: 500,
          success: false,
          message: `Unable to create the consignment. Please try again`,
        });
      } else {
        logger.log({
          level: INFO,
          message: `Created the new consignment successfully`,
        });
        res.send({
          success: true,
          statusCode: 200,
          message: `Consignment created successfully`,
        });
      }
    });
  } catch (exception) {
    logger.log({
      INFO: ERROR,
      message: `Exception while trying to add the consignment details`,
    });
    res.send({
      success: false,
      statusCode: 500,
      message: `Error while creating new consignment`,
    });
  }
});

module.exports = router;
