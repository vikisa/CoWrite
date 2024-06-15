import Document from '@/plugins/editor-comment/document';
import Paragraph from '@/plugins/editor-comment/paragraph';
import Text from '@tiptap/extension-text';
import Placeholder from '@tiptap/extension-placeholder';

export const CommentExtensions = [
  Document,
  Paragraph,
  Text,
  Placeholder.configure({
    placeholder: 'Добавьте комментарий...',
  })
]