require("dotenv").config();

const express = require("express");
const router = require("./routes");
const app = express();

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const client = require("twilio")(accountSid, authToken);

app.use(express.json());
app.use(router);

//todo Nome de cada Agente
app.get("/router1", (_, res) => {
  try {
    const arr = [];

    async function taskRouter() {
      await client.taskrouter.v1
        .workspaces(process.env.TWILIO_WORKSPACE_SID)
        .workers.list({ limit: 20 })
        .then((workers) => {
          workers.forEach((w) => {
            console.log(w);
            arr.push(JSON.parse(w.attributes));
          });
        });
      return res.json({ clients: arr });
    }
    taskRouter();
  } catch (error) {
    return res.status(500).json({ error });
  }
});

//todo Lista das filas
app.get("/router2", (_, res) => {
  const arr = [];
  async function tasRouter() {
    await client.taskrouter.v1
      .workspaces(process.env.TWILIO_WORKSPACE_SID)
      .taskQueues.list({ limit: 20 })
      .then((taskQueues) =>
        taskQueues.forEach((t) => arr.push(t.friendlyName))
      );
    return res.json({ client: arr });
  }
  tasRouter();
});

app.get("/test", (_, res) => {
  client.chat.v1
    .services("IS978e6e7be5d846d98600829417b03ca5")
    .channels.list()
    .then((channels) => channels.forEach((c) => console.log(c)));

  return res.json({ msg: "the end test" });
});

app.get("/worker", async (_, res) => {
  const worker_sid = await client.taskrouter.v1
    .workspaces(process.env.TWILIO_WORKSPACE_SID)
    .workers(process.env.TWILIO_WORKER_2)
    .reservations.list({ limit: 20 })
    .then((reservations) => reservations.forEach((r) => console.log(r)));
  console.log(worker_sid);
  return res.json({ msg: "the end" });
});

app.get("/worker_fetch", (_, res) => {
  const worker_sid = client.taskrouter.v1
    .workspaces(process.env.TWILIO_WORKSPACE_SID)
    .workers("WKabce19d1f20ebb0262381065dbbd0be5")
    .fetch()
    .then((worker) => console.log(worker));
  console.log(worker_sid);
  return res.json({ msg: "the end" });
});

app.get("/channel", (_, res) => {
  const channel = client.taskrouter.v1
    .workspaces(process.env.TWILIO_WORKSPACE_SID)
    .workers("WKabce19d1f20ebb0262381065dbbd0be5")
    .workerChannels("WCb2e18a49a321d5a8cca8dcdf3325fb4f")
    .fetch()
    .then((worker_channel) => console.log(worker_channel));
  console.log(channel);
  return res.json({ msg: "the end" });
});

app.get("/event", (_, res) => {
  const event = client.taskrouter.v1
    .workspaces(process.env.TWILIO_WORKSPACE_SID)
    .events.list({ limit: 20 })
    .then((events) => events.forEach((e) => console.log(e)));
  console.log(event);
  return res.json({ msg: "the end" });
});

app.post("/msg", (req, res) => {
  try {
    const { name } = req.body;
    const arr = [];

    async function taskRouter() {
      await client.taskrouter.v1
        .workspaces(process.env.TWILIO_WORKSPACE_SID)
        .workers.list({ limit: 20 })
        .then((workers) => {
          workers.forEach((w) => {
            const wkr = JSON.parse(w.attributes);
            if (wkr.full_name == name) {
              arr.push(JSON.parse(w.attributes).sid);
            }
          });
        });
      console.log(arr);
    }
    taskRouter();
    return res.json({ clients: arr });
  } catch (error) {
    return res.status(500).json({ error });
  }
});

//todo Alterar status
app.post("/update", async (req, res) => {
  const { status, worker, newDate } = req.body;
  console.log(`status: ${status} | worker: ${worker}`);

  // ActivityList
  const activities = {
    offline: "WA9b6c6f86d043a93e9068b987e7d6df95",
    available: "WA0350e42d7a63a274ad8239b9c6d84dc9",
    prePausa: "WAf1e54c5b08b0ceb979798a547b2e6c26",
  };

  const date = new Date().toLocaleTimeString();
  console.log(date);

  const newDateArr = newDate.split(":");
  const dateArr = date.split(":");

  const hour = parseInt(dateArr[0]) - parseInt(newDateArr[0]);
  const minute = parseInt(dateArr[1]) - parseInt(newDateArr[1]);
  const second = parseInt(dateArr[2]) - parseInt(newDateArr[2]);

  console.log(`${hour}:${minute}:${second}`);
  if (hour == 0 && minute >= 0 && minute <= 4) {
    await client.taskrouter.v1
      .workspaces(process.env.TWILIO_WORKSPACE_SID)
      .workers(worker)
      .update({
        activitySid: activities[status],
      })
      .then((worker) => console.log(worker.activityName));
    return res.json({ msg: `status alterado para ${status}` });
  } else {
    console.log("maior que 5 minutos");
    return res.json({ msg: "maior que 5 minutos" });
  }
});

/* app.get("/fetch", (_, res) => {
  client.taskrouter.v1
    .workspaces(process.env.TWILIO_WORKSPACE_SID)
    .activities("WAf1e54c5b08b0ceb979798a547b2e6c26")
    .fetch()
    .then((activity) => console.log(activity));
  return res.json({ msg: "the end" });
}); */

app.get("/activity", (_, res) => {
  // retorna os status e seus Sids
  client.taskrouter.v1
    .workspaces(process.env.TWILIO_WORKSPACE_SID)
    .activities.list({ limit: 20 })
    .then((activities) => activities.forEach((a, i) => console.log(a)));
  return res.json({ msg: "the end" });
});

app.get("/worker-create", async (req, res) => {
  const worker = { name: "", sid: "" };
  await client.taskrouter.v1
    .workspaces(process.env.TWILIO_WORKSPACE_SID)
    .workers.create({ friendlyName: "Joe hoe" })
    .then((w) => {
      worker.sid = w.sid;
      worker.name = w.friendlyName;
      console.log(w);
    });
  return res.json({ worker });
});

app.get("/worker-fetch", async (_, res) => {
  await client.taskrouter.v1
    .workspaces(process.env.TWILIO_WORKSPACE_SID)
    .workers(process.env.TWILIO_WORKER_1)
    .fetch()
    .then((worker) => console.log(worker));
  return res.json({ msg: "the end" });
});

app.get("/worker-list", async (_, res) => {
  // retorna todos os workers em determinada fila
  await client.taskrouter.v1
    .workspaces(process.env.TWILIO_WORKSPACE_SID)
    .workers.list({ taskQueueSid: "WQ3c1559d67b8123d545b6f0c21f4532e6" })
    .then((workers) => workers.forEach((w) => console.log(w)));
  return res.json({ msg: "the end" });
});

app.get("/send-not", async (req, res) => {
  try {
    const obj = { info: "" };
    await client.chat
      .services(process.env.TWILIO_CHAT_SID)
      .update({
        "notifications.addedToChannel.enabled": true,
        "notifications.addedToChannel.sound": "default",
        "notifications.addedToChannel.template":
          "A New message in ${CHANNEL} from ${USER}: ${MESSAGE}",
      })
      .then((service) => {
        obj.info = service;
        console.log(service);
      });
    return res.json({ msg: obj.name });
  } catch (error) {
    return res.status(500).json({ error });
  }
});

app.get("/service", async (req, res) => {
  const obj = { info: "" };
  await client.chat.v2
    .services(process.env.TWILIO_CHAT_SID)
    .fetch()
    .then((service) => {
      obj.info = service;
      console.log(service.friendlyName);
    });
  return res.json({ msg: obj.info });
});

app.listen(3333, () => console.log("Server started on port 3333"));
