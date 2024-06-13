// doc
import Document from '@/plugins/editor-collab/document';
import EditorBlock from '@/plugins/editor-collab/editor-block';
import Text from '@tiptap/extension-text';

// blocks
import Paragraph from '@/plugins/editor-collab/paragraph';
import Blockquote from '@/plugins/editor-collab/blockquote';
import EditorComment from '@/plugins/editor-collab/editor-comment';
import HelpComment from '@/plugins/editor-collab/help-comment';
import Heading from '@tiptap/extension-heading';

// lists
import BulletList from '@tiptap/extension-bullet-list';
import OrderedList from '@tiptap/extension-ordered-list';
import ListItem from '@/plugins/editor-collab/list-item';

// table
import Table from '@tiptap/extension-table';
import TableRow from '@tiptap/extension-table-row';
import TableHeader from '@/plugins/editor-collab/table-header';
import TableCell from '@/plugins/editor-collab/table-cell';

// inline
import Bold from '@/plugins/editor-collab/bold';
import Italic from '@tiptap/extension-italic';
import DirectSpeech from '@/plugins/editor-collab/direct-speech';
import Link from '@/plugins/editor-collab/link';

export const Extensions = [
  Document,
  EditorBlock,
  Text,

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