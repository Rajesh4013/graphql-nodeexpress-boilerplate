import { ApolloServer } from "apollo-server-express";
import express from "express";

import { schema } from "./schema.js";
import { createContext } from "./context.js";

const PORT = 5000;
const app = express();

app.use("/greet", (req, res) => {
  res.send({ msg: "Hello World!" });
});

const server = new ApolloServer({
  schema,
  context: createContext,
});

async function startServer() {
  await server.start();
  server.applyMiddleware({ app });

  app.listen(PORT, () => {
    console.log(
      `Server running at http://localhost:${PORT}${server.graphqlPath}`
    );
  });
}

startServer();