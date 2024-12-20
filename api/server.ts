import jsonServer from "json-server";

const server = jsonServer.create();

// Uncomment to allow write operations
const fs = require("fs");
const path = require("path");
const filePath = path.join("db.json");
const data = fs.readFileSync(filePath, "utf-8");

const db = JSON.parse(data);
const router = jsonServer.router(db);

// Comment out to allow write operations
// const router = jsonServer.router("db.json");

const middlewares = jsonServer.defaults();

// console.log(router.db.getState());

// server.get("/db", (req, res) => {
//   res.json(router.db.getState());
// });

server.use(middlewares);
// Add this before server.use(router)
server.use(
  jsonServer.rewriter({
    "/api/*": "/$1",
    "/blog/:resource/:id/show": "/:resource/:id",
  })
);
server.use(router);
server.listen(3000, () => {
  console.log(`JSON Server is running: http://localhost:${3000}`);
});

// Export the Server API
export default server;
