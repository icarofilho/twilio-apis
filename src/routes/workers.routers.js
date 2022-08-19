require("dotenv").config();
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const client = require("twilio")(accountSid, authToken);

module.exports = {
  async create(req, res) {
    try {
      const { name, friendlyName } = req.body;
      await client.taskrouter.v1
        .workspaces(process.env.TWILIO_WORKSPACE_SID)
        .workers.create({
          friendlyName,
          attributes: JSON.stringify({ name }),
        });
      return res.json({ msg: "Worker created" });
    } catch (error) {
      return res.status(500).json({ error });
    }
  },

  async fetch(req, res) {
    // retorna o activity do worker
    try {
      const { activitySid } = req.query;
      const worker = {
        activity: "",
      };
      await client.taskrouter.v1
        .workspaces(process.env.TWILIO_WORKSPACE_SID)
        .activities("WAf1e54c5b08b0ceb979798a547b2e6c26")
        .fetch()
        .then((activity) => {
          worker.activity = activity;
        });
      return res.json({ worker });
    } catch (error) {
      return res.status(500).json({ error });
    }
  },
};
