const supertest = require("supertest");
const { getMaxListeners } = require("../lib/app");
const app = require("../lib/app");
const db = require("../lib/db");

describe("channels", () => {
  beforeEach(async () => {
    await db.admin.clear();
  });

  describe("list", () => {
    it("list empty", async () => {
      // Return an empty channel list by default
      const { body: channels } = await supertest(app)
        .get("/channelsUser/hbeheray")
        .expect(200);
      channels.should.eql([]);
    });

    it("list one element", async () => {
      // Create a channel
      await supertest(app)
        .post("/channels")
        .send({ name: "channel 1", members: ["hbeheray"], admin: "hbeheray" });
      // Ensure we list the channels correctly
      const { body: channels } = await supertest(app)
        .get("/channelsUser/hbeheray")
        .expect(200);
      channels.should.match([
        {
          id: /^\w+-\w+-\w+-\w+-\w+$/,
          name: "channel 1",
          members: ["hbeheray"],
          admin: "hbeheray",
        },
      ]);
    });
  });

  it("create one element", async () => {
    // Create a channel
    const { body: channel } = await supertest(app)
      .post("/channels")
      .send({ name: "channel 1", members: ["hbeheray"], admin: "hbeheray" })
      .expect(201);
    // Check its return value
    channel.should.match({
      id: /^\w+-\w+-\w+-\w+-\w+$/,
      name: "channel 1",
      members: ["hbeheray"],
      admin: "hbeheray",
    });
    // Check it was correctly inserted
    const { body: channels } = await supertest(app).get(
      `/channelsUser/hbeheray`
    );
    channels.length.should.eql(1);
  });

  it("get channel", async () => {
    // Create a channel
    const { body: channel1 } = await supertest(app)
      .post("/channels")
      .send({ name: "channel 1", members: ["hbeheray"], admin: "hbeheray" });
    // Check it was correctly inserted
    const { body: channel } = await supertest(app)
      .get(`/channels/${channel1.id}`)
      .expect(200);
    channel.name.should.eql("channel 1");
  });
});
