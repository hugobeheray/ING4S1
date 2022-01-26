const chai = require("chai");
const chaiHttp = require("chai-http");
const app = require("../src/index");
const db = require("../src/dbClient");
const userController = require("../src/controllers/user");

chai.use(chaiHttp);

describe("User REST API", () => {
  beforeEach(() => {
    // Clean DB before each test
    db.flushdb();
  });

  after(() => {
    app.close();
    db.quit();
  });

  describe("POST /user", () => {
    it("create a new user", (done) => {
      const user = {
        username: "sergkudinov",
        firstname: "Sergei",
        lastname: "Kudinov",
      };
      chai
        .request(app)
        .post("/user")
        .send(user)
        .then((res) => {
          chai.expect(res).to.have.status(201);
          chai.expect(res.body.status).to.equal("success");
          chai.expect(res).to.be.json;
          done();
        })
        .catch((err) => {
          done(err);
        });
    });

    it("pass wrong parameters", (done) => {
      const user = {
        firstname: "Sergei",
        lastname: "Kudinov",
      };
      chai
        .request(app)
        .post("/user")
        .send(user)
        .then((res) => {
          chai.expect(res).to.have.status(400);
          chai.expect(res.body.status).to.equal("error");
          chai.expect(res).to.be.json;
          done();
        })
        .catch((err) => {
          done(err);
        });
    });
  });

  describe("GET /user", () => {
    it("get an existing user", (done) => {
      const user = {
        username: "sergkudinov",
        firstname: "Sergei",
        lastname: "Kudinov",
      };
      // Create a user
      userController.create(user, () => {
        // Get the user
        chai
          .request(app)
          .get("/user/" + user.username)
          .then((res) => {
            chai.expect(res).to.have.status(200);
            chai.expect(res.body.status).to.equal("success");
            chai.expect(res).to.be.json;
            done();
          })
          .catch((err) => {
            done(err);
          });
      });
    });

    it("can not get a user when it does not exist", (done) => {
      chai
        .request(app)
        .get("/user/invalid")
        .then((res) => {
          chai.expect(res).to.have.status(400);
          chai.expect(res.body.status).to.equal("error");
          chai.expect(res).to.be.json;
          done();
        })
        .catch((err) => {
          done(err);
        });
    });
  });

  describe("PUT /user", () => {
    it("update an existing user", (done) => {
      const user = {
        username: "sergkudinov",
        firstname: "Sergei",
        lastname: "Kudinov",
      };
      // Create a user
      userController.create(user, () => {
        // Get the user
        chai
          .request(app)
          .put("/user/sergkudinov")
          .send(user)
          .then((res) => {
            chai.expect(res).to.have.status(200);
            chai.expect(res.body.status).to.equal("success");
            chai.expect(res).to.be.json;
            done();
          })
          .catch((err) => {
            done(err);
          });
      });
    });

    it("can not update a user when it does not exist", (done) => {
      chai
        .request(app)
        .put("/user/invalid")
        .then((res) => {
          chai.expect(res).to.have.status(400);
          chai.expect(res.body.status).to.equal("error");
          chai.expect(res).to.be.json;
          done();
        })
        .catch((err) => {
          done(err);
        });
    });
  });

  describe("DELETE /user", () => {
    it("delete an existing user", (done) => {
      const user = {
        username: "sergkudinov",
        firstname: "Sergei",
        lastname: "Kudinov",
      };
      // Create a user
      userController.create(user, () => {
        // Get the user
        chai
          .request(app)
          .delete("/user/" + user.username)
          .then((res) => {
            chai.expect(res).to.have.status(200);
            chai.expect(res.body.status).to.equal("success");
            chai.expect(res).to.be.json;
            done();
          })
          .catch((err) => {
            done(err);
          });
      });
    });

    it("can not delete a user when it does not exist", (done) => {
      chai
        .request(app)
        .delete("/user/invalid")
        .then((res) => {
          chai.expect(res).to.have.status(400);
          chai.expect(res.body.status).to.equal("error");
          chai.expect(res).to.be.json;
          done();
        })
        .catch((err) => {
          done(err);
        });
    });
  });
});
