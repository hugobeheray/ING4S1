const express = require("express");
const userController = require("../controllers/user");

const userRouter = express.Router();

/**
 * @swagger
 * components:
 *  schemas:
 *    User:
 *      type: object
 *      required:
 *        - username
 *        - firstname
 *        - lastname
 *      properties:
 *        username:
 *          type: string
 *          description: The user username
 *        firstname:
 *          type: string
 *          description: The user firstname
 *        lastname:
 *          type: string
 *          description: The user lastname
 *      example:
 *        username: sergkuninov
 *        firstname: sergei
 *        lastname: kudinov
 */

/**
 * @swagger
 * tags:
 *   name: Users
 *   description: The user CRUD API
 */

/**
 * @swagger
 * /user:
 *  post:
 *    summary: creates a new user
 *    tags: [Users]
 *    requestBody:
 *       required: true
 *       content:
 *          application/json:
 *            schema:
 *               $ref: '#/components/schemas/User'
 *    responses:
 *      201:
 *        description: user created successfully
 *        content:
 *          application/json:
 *            schema:
 *               $ref: '#/components/schemas/User'
 *      400:
 *        description: Some server error
 *
 *
 */

userRouter
  .post("/", (req, resp) => {
    userController.create(req.body, (err, res) => {
      let respObj;
      if (err) {
        respObj = {
          status: "error",
          msg: err.message,
        };
        return resp.status(400).json(respObj);
      }
      respObj = {
        status: "success",
        msg: res,
      };
      resp.status(201).json(respObj);
    });
  })

  /**
   * @swagger
   * /user/{username}:
   *  get:
   *    summary: gets the  user by username
   *    tags: [Users]
   *    parameters:
   *      - in : path
   *        name: username
   *        schema:
   *          type: string
   *        required: true
   *        description: The user's username
   *    responses:
   *      200:
   *        description: The user's description by username
   *        content:
   *          application/json:
   *            schema:
   *               $ref: '#/components/schemas/User'
   *      404:
   *        description: The user was not found
   */

  .get("/:username", (req, resp) => {
    // Express URL params - https://expressjs.com/en/guide/routing.html
    // TODO Create get method API
    const username = req.params.username;
    userController.get(username, (err, res) => {
      let respObj;
      if (err) {
        respObj = {
          status: "error",
          msg: err.message,
        };
        return resp.status(400).json(respObj);
      }
      respObj = {
        status: "success",
        msg: res,
      };
      resp.status(200).json(respObj);
    });
  })

  /**
   * @swagger
   * /user/{username}:
   *  put:
   *    summary: Updates the user by username
   *    tags: [Users]
   *    parameters:
   *      - in : path
   *        name: username
   *        required: true
   *        schema:
   *          type: string
   *          required: true
   *          description: the user's username
   *    requestBody:
   *      required: true
   *      content:
   *        application/json:
   *          schema:
   *             $ref: '#/components/schemas/User'
   *    responses:
   *      200:
   *        description: The user was updated
   *        content:
   *          application/json:
   *            schema:
   *              $ref: '#/components/schemas/User'
   *      400:
   *        description: The user was not found
   */

  .put("/:username", (req, resp) => {
    const username = req.params.username;
    userController.update(username, req.body, (err, res) => {
      let respObj;
      if (err) {
        respObj = {
          status: "error",
          msg: err.message,
        };
        return resp.status(400).json(respObj);
      }
      respObj = {
        status: "success",
        msg: res,
      };
      resp.status(200).json(respObj);
    });
  })

  /**
   * @swagger
   * /user/{username}:
   *  delete:
   *    summary: deletes a user by username
   *    tags: [Users]
   *    parameters:
   *      - in: path
   *        name: username
   *        required: true
   *        schema:
   *          type: string
   *          required: true
   *          description: The user's username
   *    responses:
   *      200:
   *       description: The user was deleted
   *      400:
   *       description: The user was not found
   *
   *
   */

  .delete("/:username", (req, resp) => {
    const username = req.params.username;
    userController.delete(username, (err, res) => {
      let respObj;
      if (err) {
        respObj = {
          status: "error",
          msg: err.message,
        };
        return resp.status(400).json(respObj);
      }
      respObj = {
        status: "success",
        msg: res,
      };
      resp.status(200).json(respObj);
    });
  });

module.exports = userRouter;
