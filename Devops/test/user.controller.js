const { expect } = require("chai");
const userController = require("../src/controllers/user");
const db = require("../src/dbClient");

describe("User", () => {
  beforeEach(() => {
    // Clean DB before each test
    db.flushdb();
  });

  describe("Create", () => {
    it("create a new user", (done) => {
      const user = {
        username: "sergkudinov",
        firstname: "Sergei",
        lastname: "Kudinov",
      };
      userController.create(user, (err, result) => {
        expect(err).to.be.equal(null);
        expect(result).to.be.equal("OK");
        done();
      });
    });

    it("passing wrong user parameters", (done) => {
      const user = {
        firstname: "Sergei",
        lastname: "Kudinov",
      };
      userController.create(user, (err, result) => {
        expect(err).to.not.be.equal(null);
        expect(result).to.be.equal(null);
        done();
      });
    });

    it("avoid creating an existing user", (done) => {
      const user = {
        username: "sergkudinov",
        firstname: "Sergei",
        lastname: "Kudinov",
      };
      // Create a user
      userController.create(user, () => {
        // Create the same user again
        userController.create(user, (err, result) => {
          expect(err).to.not.be.equal(null);
          expect(result).to.be.equal(null);
          done();
        });
      });
    });
  });

  describe("Get", () => {
    it("get a user by username", (done) => {
      const user = {
        username: "sergkudinov",
        firstname: "Sergei",
        lastname: "Kudinov",
      };
      // Create a user
      userController.create(user, () => {
        // Get an existing user
        userController.get(user.username, (err, result) => {
          expect(err).to.be.equal(null);
          expect(result).to.be.deep.equal({
            firstname: "Sergei",
            lastname: "Kudinov",
          });
          done();
        });
      });
    });

    it("can not get a user when it does not exist", (done) => {
      userController.get("invalid", (err, result) => {
        expect(err).to.not.be.equal(null);
        expect(result).to.be.equal(null);
        done();
      });
    });
  });

  describe("Update", () => {
    it("update a user by username", (done) => {
      const user = {
        username: "sergkudinov",
        firstname: "Sergei",
        lastname: "Kudinov",
      };
      // Create a user
      userController.create(user, () => {
        // Get an existing user
        userController.update(user.username, user, (err, result) => {
          expect(err).to.be.equal(null);
          expect(result).to.be.equal("OK");
          done();
        });
      });
    });

    it("can not update a user when it does not exist", (done) => {
      const user = {
        username: "invalid",
        firstname: "Sergei",
        lastname: "Kudinov",
      };
      userController.update(user.username, user, (err, result) => {
        expect(err).to.not.be.equal(null);
        expect(result).to.be.equal(null);
        done();
      });
    });
  });

  describe("Delete", () => {
    it("should delete an user", (done) => {
      const user = {
        username: "sergkudinov",
        firstname: "Sergei",
        lastname: "Kudinov",
      };
      userController.create(user, () => {
        userController.delete(user.username, (err, result) => {
          expect(err).to.be.equal(null);
          expect(result).to.be.equal(1);
          done();
        });
      });
    });

    it("can not delete a user when it does not exist", (done) => {
      userController.get("invalid", (err, result) => {
        expect(err).to.not.be.equal(null);
        expect(result).to.be.equal(null);
        done();
      });
    });
  });
});
