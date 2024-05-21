// doc
import Document from "@/plugins/tiptap-collab/plugins/extension-document";
import EditorBlock from "@/plugins/tiptap-collab/plugins/extension-editor-block";
import { Text } from '@tiptap/extension-text';

// blocks
import Paragraph from "@/plugins/tiptap-collab/plugins/extension-paragraph";
import { Dropcursor } from '@tiptap/extension-dropcursor';
import Heading from '@tiptap/extension-heading'
import Blockquote from "@/plugins/tiptap-collab/plugins/extension-blockquote";
import HelpComment from "@/plugins/tiptap-collab/plugins/extension-help-comment";
import EditorComment from "@/plugins/tiptap-collab/plugins/extension-editor-comment";

import { BulletList } from "@tiptap/extension-bullet-list";
import { OrderedList } from "@tiptap/extension-ordered-list";
import ListItem from '@/plugins/tiptap-collab/plugins/extension-list-item'

import { Table } from "@tiptap/extension-table";
import { TableRow } from "@tiptap/extension-table-row";
import TableHeader from '@/plugins/tiptap-collab/plugins/extension-table-header';
import TableCell from '@/plugins/tiptap-collab/plugins/extension-table-cell';

// inline
import Bold from "@/plugins/tiptap-collab/plugins/extension-bold";
import { Italic } from '@tiptap/extension-italic';
import DirectSpeech from "@/plugins/tiptap-collab/plugins/extension-direct-speech";
import Link from "@/plugins/tiptap-collab/plugins/extension-link";

//import UniqueId from "tiptap-unique-id";

import History from '@tiptap/extension-history';

export const Extensions = [
  Document,
  Paragraph,
  Text,
  Dropcursor,
  EditorBlock,
  Bold,
  Italic,
  DirectSpeech,
  Link,
  Heading.configure({
    levels: [3],
  }),
  Blockquote,
  HelpComment,
  EditorComment,
  BulletList,
  OrderedList,
  ListItem,
  Table.configure({
    resizable: true,
  }),
  TableRow,
  TableHeader,
  TableCell,
  /*UniqueId.configure({
    attributeName: "id",
    types: ["editorBlock"],
    createId: () => window.crypto.randomUUID(),
  }),*/
  History
];
