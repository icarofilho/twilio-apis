const router = require("express").Router();

const workerRouter = require("./workers.routers");
const workspaceRouter = require("./workspaces.router");

router.get("/worker/fetch", workerRouter.fetch);
router.post("/worker/create", workerRouter.create);

router.get("/workspace/fetch", workspaceRouter.fetch);
router.get("/workspace/allworkspaces", workspaceRouter.allWorkspaces);
router.patch("/workspace/update", workspaceRouter.update);
router.delete("/workspace/delete", workspaceRouter.delete);

module.exports = router;
