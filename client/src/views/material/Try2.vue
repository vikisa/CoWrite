<template>
  <div v-if="editor">
    <EditorContent :editor="editor" />
  </div>
</template>

<script setup>
import * as Y from 'yjs';
import { useEditor, EditorContent } from "@tiptap/vue-3";
import Document from '@tiptap/extension-document'
import Paragraph from '@/plugins/tiptap/plugins/extension-paragraph'
import Text from '@tiptap/extension-text'
import Collaboration from "@tiptap/extension-collaboration";
import CollaborationCursor from "@tiptap/extension-collaboration-cursor";
import Dropcursor from '@tiptap/extension-dropcursor';
import { WebrtcProvider } from "y-webrtc";
import {useStore} from "vuex";
import {computed} from "vue";
const ydoc = new Y.Doc();
const provider = new WebrtcProvider("tiptap-test-1", ydoc);
const store = useStore();
const userFullName = computed(() => store.getters.userFullName);
const getColour = computed(() => store.getters.getColour);
import  { Extensions } from '@/plugins/tiptap-collab';

const editor = useEditor({
  content: "<p>Hello world!</p><p>Hello world!</p><p>Hello world!</p>",
  extensions: [
    ...Extensions,
    Collaboration.configure({
      document: ydoc,
    }),
    CollaborationCursor.configure({
      provider: provider,
      user: {
        name: userFullName.value,
        color: getColour.value
      }
    })
  ]
});

</script>

<style lang="scss">
.ProseMirror {
  //font-size: 1.5rem;
  border-radius: 0.5rem;
  padding: 0.7rem;
  border: 2px solid #dcdfe6;
}

/* Give a remote user a caret */
.collaboration-cursor__caret {
  position: relative;
  margin-left: -1px;
  margin-right: -1px;
  border-left: 1px solid #0D0D0D;
  border-right: 1px solid #0D0D0D;
  word-break: normal;
  pointer-events: none;
}

/* Render the username above the caret */
.collaboration-cursor__label {
  position: absolute;
  top: -1.4em;
  left: -1px;
  font-size: 12px;
  font-style: normal;
  font-weight: 600;
  line-height: normal;
  user-select: none;
  color: #0D0D0D;
  padding: 0.1rem 0.3rem;
  border-radius: 3px 3px 3px 0;
  white-space: nowrap;
}
</style>