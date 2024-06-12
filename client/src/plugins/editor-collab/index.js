// doc
import Document from '@/plugins/editor-collab/document';
import EditorBlock from '@/plugins/editor-collab/editor-block';
import { Text } from '@tiptap/extension-text';
import Paragraph from '@/plugins/editor-collab/paragraph';

export const Extensions = [
  Document,
  Paragraph,
  Text,
  EditorBlock
];