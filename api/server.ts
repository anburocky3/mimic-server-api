const jsonServer = require("json-server");
import fs from "fs";
import path from "path";

const server = jsonServer.create();

const filePath = path.join("db.json");
const data = fs.readFileSync(filePath, "utf-8");

const db = JSON.parse(data);
const router = jsonServer.router(db);

const middlewares = jsonServer.defaults();

server.use(middlewares);
server.use(
  jsonServer.rewriter({
    "/api/*": "/$1",
    "/blog/:resource/:id/show": "/:resource/:id",
  })
);
server.use(router);
server.listen(3000, () => {
  console.log(`JSON Server is running: http://localhost:3000`);
});

export default server;
