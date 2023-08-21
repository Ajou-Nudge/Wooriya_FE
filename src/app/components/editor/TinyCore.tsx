"use client"
import React, { useRef, useState } from 'react';
import { Editor } from '@tinymce/tinymce-react';

const TinyCore = () => {
  const editorRef = useRef<any>(null);
  const [savedContent, setSavedContent] = useState<string>('');

  const handleSave = () => {
    if (editorRef.current) {
      const content = editorRef.current.getContent({ save: true }); // save 옵션 추가
      setSavedContent(content);
      console.log('저장된 내용:', content);
    }
  };

  const tinymcePlugins = [
  "advlist",
  "autolink",
  "lists",
  "link",
  "image",
  "charmap",
  "preview",
  "anchor",
  "searchreplace",
  "visualblocks",
  "code",
  "fullscreen",
  "insertdatetime",
  "media",
  "table",
  "code",
  "help",
  "wordcount",
];

  const tinymceToolbar =
    "undo redo | blocks | " +
    "bold italic forecolor | alignleft aligncenter " +
    "alignright alignjustify | bullist numlist outdent indent | " +
    "removeformat | help" +
    'blocks fontfamily |' +
    'bold italic underline strikethrough forecolor backcolor |' +
    'alignleft aligncenter alignright alignjustify |' +
    'bullist numlist blockquote link |' +
    'save image';
// 서버에 이미지를 업로드하고 URL을 받아오는 함수 예시
  const uploadImageToServer = async (file: File) => {
    const formData = new FormData();
    formData.append('image', file);

    try {
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        const result = await response.json();
        return result.imageUrl; // 업로드된 이미지의 URL 반환
      } else {
        console.error('Image upload failed');
      }
    } catch (error) {
      console.error('Error uploading image', error);
    }

    return null;
  };

  // handleFilePicker 함수 수정
  const handleFilePicker = async (callback: any, value: any, meta: any) => {
    const input = document.createElement('input');
    input.setAttribute('type', 'file');
    input.setAttribute('accept', meta.filetype);

    input.onchange = async (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        const imageUrl = await uploadImageToServer(file);
        if (imageUrl) {
          callback(file.name, { src: imageUrl }); // 서버에서 받은 이미지 URL로 설정
        }
      }
    };

    input.click();
  };

  return (
    <div>
      <Editor
        tinymceScriptSrc={"/assets/libs/tinymce/tinymce.min.js"}
        onInit={(e, editor) => (editorRef.current = editor)}
        init={{
          language: "ko_KR",
          plugins: tinymcePlugins.join(' '),
          toolbar: tinymceToolbar,
          min_height: 500,
          menubar: true,
          branding: false,
          statusbar: false,
          image_title: true,
          automatic_uploads: true,
          file_picker_types: 'image',
          block_formats: '제목1=h2;제목2=h3;제목3=h4;본문=p;인용문=blockquote;',
          file_picker_callback: handleFilePicker, // 업로드 콜백 함수 지정
        }}
      />
      <button onClick={handleSave}>저장</button>
      <div>
        <h2>저장된 내용</h2>
        <div dangerouslySetInnerHTML={{ __html: savedContent }}></div>
      </div>
    </div>
  );
};

export default TinyCore;
