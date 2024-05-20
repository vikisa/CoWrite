import Paragraph from "@/plugins/tiptap-collab/plugins/extension-paragraph";
import {Text} from '@tiptap/extension-text';

import {Dropcursor} from '@tiptap/extension-dropcursor';
import EditorBlock from "@/plugins/tiptap-collab/plugins/extension-editor-block";
import Document from "@/plugins/tiptap-collab/plugins/extension-document";
import Bold from "@/plugins/tiptap-collab/plugins/extension-bold";
import {Italic} from '@tiptap/extension-italic';
import DirectSpeech from "@/plugins/tiptap-collab/plugins/extension-direct-speech";
import Link from "@/plugins/tiptap-collab/plugins/extension-link";
import Heading from '@tiptap/extension-heading'
import Blockquote from '@tiptap/extension-blockquote';
import HelpComment from "@/plugins/tiptap-collab/plugins/extension-help-comment";
import EditorComment from "@/plugins/tiptap-collab/plugins/extension-editor-comment";
import {BulletList} from "@tiptap/extension-bullet-list";
import {OrderedList} from "@tiptap/extension-ordered-list";
import {ListItem} from "@tiptap/extension-list-item";
import {Table} from "@tiptap/extension-table";
import {TableRow} from "@tiptap/extension-table-row";
import {TableHeader} from "@tiptap/extension-table-header";
import {TableCell} from "@tiptap/extension-table-cell";

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
];
