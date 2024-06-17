import express from 'express';
import jwt from 'jsonwebtoken';
import { fromUint8Array, toUint8Array } from 'js-base64'
import expressWebsockets from 'express-ws';
import { Hocuspocus } from '@hocuspocus/server';
import { Webhook, Events } from "@hocuspocus/extension-webhook";
import { TiptapTransformer } from "@hocuspocus/transformer";
import * as Y from 'yjs'
import { Extensions } from "./extensions/index.js";
import dotenv from 'dotenv'
dotenv.config();
import fetch from "node-fetch";
import _ from 'lodash';

const emptyDoc = {"type":"doc","content":[{"type":"editorBlock","attrs":{"blockId":"b5e4133a74","number":0},"content":[{"type":"paragraph"}]}]};

const server = new Hocuspocus({
  port: 1234,
  async onAuthenticate(data) {
    if (server.getConnectionsCount() >= 4)
      data.connection.readOnly = true;

    let user, editors;

    const { token } = data;

    const response = await fetch(`${process.env.APP_ROOT_API}material/getEditors/${data.documentName}`, {
      headers: {'Content-Type': 'application/json'}
    });
    if (response.ok)
      editors = await response.json();

    jwt.verify(token, process.env.SECRET_TOKEN, (error, decoded) => {
      if (error) return new Error('Not authorized!');

      if (decoded.editorToken === process.env.EDITOR_TOKEN)
        user = jwt.decode(decoded.userToken)
      else return new Error('Not authorized!');
    });

    return {
      user: {
        id: user.id,
        name: user.fullname,
      },
      editors,
    }
  },
  async onStoreDocument(data) {
    const date = Math.floor(Date.now() / 1000);
    const snapshot = Y.snapshot(data.document);

    const content = Buffer.from(
      Y.encodeStateAsUpdate(data.document),
    ).toString('binary');

    const body = {
      editingId: data.documentName,
      userId: data.context.user.id,
      timestamp: date,
      content: content,
      snapshot: Y.encodeSnapshot(snapshot),
    };

    await fetch(`${process.env.APP_ROOT_API}material/saveMaterialContent`, {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify(body)
    });

    if (!(data.context.editors && _.find(data.context.editors, editor => editor.userId === data.context.user.id))) {
      const response = await fetch(`${process.env.APP_ROOT_API}material/editor/${data.documentName}`, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({
          userId: data.context.user.id,
          timestamp: date,
        })
      });
      if (response.ok) {
        const editor = await response.json()
        data.context.editors.push(editor);
      }
    }
  },
  async onLoadDocument(data) {
    const response = await fetch(`${process.env.APP_ROOT_API}material/checkVersion/${data.documentName}`, {
      headers: {'Content-Type': 'application/json'},
    })
    const dataMaterial = await response.json();
    if (dataMaterial.version) {
      const content = JSON.parse(dataMaterial.content);

      Y.applyUpdate(
        data.document,
        Buffer.from(content.content, 'binary')
      );
      return data.document;
    }

    return createYjsDoc(emptyDoc);
  },
});

const { app } = expressWebsockets(express());

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

function createYjsDoc(json) {
  return TiptapTransformer.toYdoc(
    json,
    "default",
    Extensions
  );
}