const { Module } = require("module");

require("dotenv").config();
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const client = require("twilio")(accountSid, authToken);

module.exports = {
  async fetch(req, res) {
    const valor = { info: "" };
    await client.taskrouter.v1
      .workspaces(process.env.TWILIO_WORKSPACE_SID)
      .fetch()
      .then((workspace) => {
        valor.info = workspace;
      });
    return res.json({ valor });
  },

  async allWorkspaces(req, res) {
    const data = { info: "" };
    await client.taskrouter.v1.workspaces
      .list({ limit: 20 })
      .then((workspaces) => workspaces.forEach((w) => (data.info = w)));
    return res.json({ data });
  },

  async update(req, res) {
    const data = { info: "" };
    await client.taskrouter.v1
      .workspaces(process.env.TWILIO_WORKSPACE_SID)
      .update({
        friendlyName: "NewWorkspaceName",
        eventCallbackUrl: "https://new-workspace-callback.free.beeceptor.com",
      })
      .then((workspace) => {
        data.info = workspace;
      });
    return res.json({ data });
  },

  async delete(req, res) {
    await client.taskrouter.v1
      .workspaces(process.env.TWILIO_WORKSPACE_SID)
      .remove()
      .then(() => {
        console.log("Workspace deleted");
      })
      .catch((err) => {
        console.log(err);
      });
  },
};
