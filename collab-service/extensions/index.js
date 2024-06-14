// doc
import Document from 'document';
import EditorBlock from 'editor-block';
import Text from '@tiptap/extension-text';

// blocks
import Dropcursor from '@tiptap/extension-dropcursor';
import Paragraph from 'paragraph';
import Blockquote from 'blockquote';
import EditorComment from 'editor-comment';
import HelpComment from 'help-comment';
import Heading from '@tiptap/extension-heading';

// lists
import BulletList from '@tiptap/extension-bullet-list';
import OrderedList from '@tiptap/extension-ordered-list';
import ListItem from 'list-item';

// table
import Table from '@tiptap/extension-table';
import TableRow from '@tiptap/extension-table-row';
import TableHeader from 'table-header';
import TableCell from 'table-cell';

// inline
import Bold from 'bold';
import Italic from '@tiptap/extension-italic';
import DirectSpeech from 'direct-speech';
import Link from 'link';

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