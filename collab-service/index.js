import express from "express";
import expressWebsockets from "express-ws";
import { Hocuspocus } from "@hocuspocus/server";

const server = new Hocuspocus({
  port: 1234,
});

const { app } = expressWebsockets(express());

app.get("/", (request, response) => {
  response.send("Hello World!");
});

app.ws("/collaboration", (websocket, request) => {
  const context = {
    user: {
      id: 1234,
      name: "Jane",
    },
  };

  server.handleConnection(websocket, request, context);
});

app.listen(1234, () => console.log("Listening on http://127.0.0.1:1234"));
