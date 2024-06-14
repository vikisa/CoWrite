// doc
import Document from './document.js';
import EditorBlock from './editor-block.js';
import Text from '@tiptap/extension-text';

// blocks
import Dropcursor from '@tiptap/extension-dropcursor';
import Paragraph from './paragraph.js';
import Blockquote from './blockquote.js';
import EditorComment from './editor-comment.js';
import HelpComment from './help-comment.js';
import Heading from '@tiptap/extension-heading';

// lists
import BulletList from '@tiptap/extension-bullet-list';
import OrderedList from '@tiptap/extension-ordered-list';
import ListItem from './list-item.js';

// table
import Table from '@tiptap/extension-table';
import TableRow from '@tiptap/extension-table-row';
import TableHeader from './table-header.js';
import TableCell from './table-cell.js';

// inline
import Bold from './bold.js';
import Italic from '@tiptap/extension-italic';
import DirectSpeech from './direct-speech.js';
import Link from './link.js';

export const Extensions = [
  Document,
  EditorBlock,
  Text,

  Dropcursor,
  Paragraph,
  Blockquote,
  EditorComment,
  HelpComment,
  Heading.configure({
    levels: [3],
  }),

  BulletList,
  OrderedList,
  ListItem,

  Table,
  TableRow,
  TableHeader,
  TableCell,

  Bold,
  Italic,
  DirectSpeech,
  Link,
];