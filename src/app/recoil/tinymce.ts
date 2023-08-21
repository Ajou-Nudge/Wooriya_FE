import { atom } from 'recoil';
import { Editor } from 'tinymce';

export const tinymceEditorState = atom<Editor | null>({
  key: 'tinymceEditor',
  default: null,
  dangerouslyAllowMutability: true,
});
