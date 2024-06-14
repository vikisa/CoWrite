import express from "express";
import expressWebsockets from "express-ws";
import { Hocuspocus } from "@hocuspocus/server";
import { Webhook, Events } from "@hocuspocus/extension-webhook";
import { TiptapTransformer } from "@hocuspocus/transformer";
import { Doc } from "yjs";
import { Extensions } from "./extensions/index.js";

import { IncomingMessage } from 'http'

const secret = '459824aaffa928e05f5b1caec411ae5f';

const server = new Hocuspocus({
  port: 1234,
  async onAuthenticate({ token }) {
    console.log('onAuthenticate')
    // Example test if a user is authenticated
    if (token !== '459824aaffa928e05f5b1caec411ae5f') {
      throw new Error('Not authorized!')
    }

    // You can set contextual data to use it in other hooks
    return {
      user: {
        id: 1234,
        name: 'John',
      },
    }
  },
  async onStoreDocument(data) {
    //console.log('onStoreDocument document',data.document)
    console.log('onStoreDocument documentName',data.documentName)
    console.log('onStoreDocument context',data.context)
    const prosemirrorJSON = TiptapTransformer.fromYdoc(data.document);
    console.log('prosemirrorJSON',prosemirrorJSON)
    //console.log('onStoreDocument document',data.document)
  },
  async onLoadDocument(data) {
    console.log('onLoadDocument',)
    //return loadFromDatabase(data.documentName) || createInitialDocTemplate();
  },
  /*extensions: [
    new Webhook({
      // [required] url of your application
      url: 'http://localhost:8000/api/collaborative/test',

      // [required] a random string that will be used to verify the request signature
      secret: '459824aaffa928e05f5b1caec411ae5f',

      // [required] a transformer for your document
      transformer: TiptapTransformer,

      // [optional] array of events that will trigger a webhook
      // defaults to [ Events.onChange ]
      events: [Events.onConnect, Events.onCreate, Events.onChange, Events.onDisconnect],

      // [optional] time in ms the change event should be debounced,
      // defaults to 2000
      debounce: 2000,

      // [optional] time in ms after that the webhook will be sent
      // regardless of the configured debouncing, defaults to 10000
      debounceMaxWait: 10000,
    }),
  ]*/
});

const { app } = expressWebsockets(express());

app.get("/", (request, response) => {
  response.send("Hello World!");
});

app.post("/test", (request, response) => {
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


function createInitialDocTemplate(json) {
  const ydoc = TiptapTransformer.toYdoc(
    // the actual JSON
    json,
    // the `field` you’re using in Tiptap. If you don’t know what that is, use 'default'.
    "default",
    // The Tiptap extensions you’re using. Those are important to create a valid schema.
    Extensions
  );
  console.log('ydoc',ydoc)
  return ydoc;
}