const router = require("express").Router();

const workerRouter = require("./workers.routers");
const workspaceRouter = require("./workspaces.router");

router.use("/worker/fetch", workerRouter.fetch);
router.use("/worker/create", workerRouter.create);

router.use("/workspace/fetch", workspaceRouter.fetch);
router.use("/workspace/allworkspaces", workspaceRouter.allWorkspaces);
router.use("/workspace/update", workspaceRouter.update);
router.use("/workspace/delete", workspaceRouter.delete);

module.exports = router;
