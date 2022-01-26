const { v4: uuid } = require("uuid");
const { merge } = require("mixme");
const microtime = require("microtime");
const level = require("level");
const db = level(__dirname + "/../db");

// upload picture
const path = require("path");
const __dirnameUpload = path.resolve();
const { promisify } = require("util");
const fs = require("fs");
const pipeline = promisify(require("stream").pipeline);

module.exports = {
  channels: {
    create: async (channel) => {
      if (!channel.name) throw Error("Invalid channel");
      const id = uuid();

      // check if the admin is in the members
      if (!channel.members.includes(channel.admin)) {
        channel.members.push(channel.admin);
      }

      await db.put(`channels:${id}`, JSON.stringify(channel));
      return merge(channel, { id: id });
    },
    get: async (id) => {
      if (!id) throw Error("Invalid id");
      const data = await db.get(`channels:${id}`);
      const channel = JSON.parse(data);
      return merge(channel, { id: id });
    },
    list: async (email) => {
      return new Promise((resolve, reject) => {
        const channels = [];
        db.createReadStream({
          gt: "channels:",
          lte: "channels" + String.fromCharCode(":".charCodeAt(0) + 1),
        })
          .on("data", ({ key, value }) => {
            channel = JSON.parse(value);
            channel.id = key.split(":")[1];

            if (channel.members && channel.members.includes(email)) {
              channels.push(channel);
            }
          })
          .on("error", (err) => {
            reject(err);
          })
          .on("end", () => {
            resolve(channels);
          });
      });
    },
    update: (id, channel) => {
      if (!id) throw Error("Invalid channel");
      if (!channel.members) throw Error("There must be at least one member");

      db.put(`channels:${id}`, JSON.stringify(channel));

      return merge(channel, { id: id });
    },
    delete: async (channelId) => {
      await db.del(`channels:${channelId}`);
    },
  },
  messages: {
    create: async (channelId, message) => {
      if (!channelId) throw Error("Invalid channel");
      if (!message.author) throw Error("Invalid message");
      if (!message.content) throw Error("Invalid message");
      creation = microtime.now();
      await db.put(
        `messages:${channelId}:${creation}`,
        JSON.stringify({
          author: message.author,
          content: message.content,
        })
      );
      return merge(message, { channelId: channelId, creation: creation });
    },
    list: async (channelId) => {
      return new Promise((resolve, reject) => {
        const messages = [];
        db.createReadStream({
          gt: `messages:${channelId}:`,
          lte:
            `messages:${channelId}` +
            String.fromCharCode(":".charCodeAt(0) + 1),
        })
          .on("data", ({ key, value }) => {
            message = JSON.parse(value);
            const [, channelId, creation] = key.split(":");
            message.channelId = channelId;
            message.creation = creation;
            messages.push(message);
          })
          .on("error", (err) => {
            reject(err);
          })
          .on("end", () => {
            resolve(messages);
          });
      });
    },
    update: async (channelId, creation, message) => {
      if (!channelId) throw Error("Invalid channel");
      if (!message.author) throw Error("Invalid message");
      if (!message.content) throw Error("Invalid message");
      await db.put(
        `messages:${channelId}:${creation}`,
        JSON.stringify({
          author: message.author,
          content: message.content,
        })
      );
      return merge(message, { channelId: channelId, creation: creation });
    },
    delete: async (channelId, creation) => {
      await db.del(`messages:${channelId}:${creation}`);
    },
  },
  users: {
    create: async (user) => {
      if (!user.username) throw Error("Invalid user");
      const id = uuid();
      await db.put(`users:${id}`, JSON.stringify(user));
      return merge(user, { id: id });
    },
    get: async (id) => {
      if (!id) throw Error("Invalid id");
      const data = await db.get(`users:${id}`);
      const user = JSON.parse(data);
      return merge(user, { id: id });
    },
    list: async () => {
      return new Promise((resolve, reject) => {
        const users = [];
        db.createReadStream({
          gt: "users:",
          lte: "users" + String.fromCharCode(":".charCodeAt(0) + 1),
        })
          .on("data", ({ key, value }) => {
            user = JSON.parse(value);
            user.id = key.split(":")[1];
            users.push(user);
          })
          .on("error", (err) => {
            reject(err);
          })
          .on("end", () => {
            resolve(users);
          });
      });
    },
    update: async (id, user) => {
      await db.put(`users:${id}`, JSON.stringify(user));
      return merge(user, { id: id });
    },
    delete: (id, user) => {
      const original = store.users[id];
      if (!original) throw Error("Unregistered user id");
      delete store.users[id];
    },
  },
  upload: {
    create: async (file, idUser) => {
      if (file.size > 2000000) {
        throw Error("Max size error");
      } else {
        const fileName = idUser + ".jpg";

        await pipeline(
          file.stream,
          fs.createWriteStream(
            `${__dirnameUpload}/../front-end/src/uploads/${fileName}`
          )
        );
      }
    },
  },
  admin: {
    clear: async () => {
      await db.clear();
    },
  },
  members: {
    create: async (channelId, member) => {
      const idMember = uuid();
      await db.put(`members:${channelId}:${idMember}`, JSON.stringify(member));
      return merge(member, { channelId: channelId, idMember: idMember });
    },
    list: async (channelId) => {
      return new Promise((resolve, reject) => {
        const members = [];
        db.createReadStream({
          gt: `members:${channelId}:`,
          lte:
            `members:${channelId}` + String.fromCharCode(":".charCodeAt(0) + 1),
        })
          .on("data", ({ key, value }) => {
            member = JSON.parse(value);
            members.push(member);
          })
          .on("error", (err) => {
            reject(err);
          })
          .on("end", () => {
            resolve(members);
          });
      });
    },
  },
};
