//import Paragraph from '@/plugins/tiptap/plugins/extension-paragraph';
import Paragraph from '@tiptap/extension-paragraph';
import {Text} from '@tiptap/extension-text';

import {Dropcursor} from '@tiptap/extension-dropcursor';
import EditorBlock from "@/plugins/tiptap/plugins/extension-editor-block";
import Document from "@/plugins/tiptap/plugins/extension-document";


export const Extensions = [
  Document,
  Paragraph,
  Text,
  Dropcursor,
  EditorBlock
];
