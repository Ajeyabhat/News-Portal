import React, { useRef, useState } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import VideoModal from './VideoModal';
import './RichTextEditor.css';

// Suppress react-quill findDOMNode warning (known issue with react-quill 2.x)
const originalError = console.error;
console.error = function(...args) {
  if (args[0]?.includes?.('findDOMNode')) {
    return;
  }
  originalError.apply(console, args);
};

const RichTextEditor = ({ value, onChange, placeholder = 'Write article content...' }) => {
  const quillRef = useRef(null);
  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);

  // Handle image insertion
  const handleImageInsert = () => {
    const input = document.createElement('input');
    input.setAttribute('type', 'file');
    input.setAttribute('accept', 'image/*');
    
    input.onchange = () => {
      const file = input.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
          const editor = quillRef.current?.getEditor();
          if (editor) {
            const range = editor.getSelection(true);
            editor.insertEmbed(range.index, 'image', e.target.result);
            editor.setSelection(range.index + 1);
          }
        };
        reader.readAsDataURL(file);
      }
    };
    input.click();
  };

  // Handle video insertion (YouTube or URL)
  const handleVideoInsert = () => {
    setIsVideoModalOpen(true);
  };

  // Process video URL from modal
  const handleVideoUrlSubmit = (url) => {
    let embedUrl = url;
    
    // Handle YouTube URLs and convert to embed format
    if (url.includes('youtube.com/watch')) {
      const videoId = url.split('v=')[1]?.split('&')[0];
      if (videoId) {
        embedUrl = `https://www.youtube.com/embed/${videoId}`;
      }
    } else if (url.includes('youtu.be/')) {
      const videoId = url.split('youtu.be/')[1]?.split('?')[0];
      if (videoId) {
        embedUrl = `https://www.youtube.com/embed/${videoId}`;
      }
    } else if (!url.includes('youtube.com/embed/')) {
      // If it's not already an embed URL, assume it's a YouTube watch URL
      const videoId = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([a-zA-Z0-9_-]+)/)?.[1];
      if (videoId) {
        embedUrl = `https://www.youtube.com/embed/${videoId}`;
      }
    }

    try {
      const editor = quillRef.current?.getEditor();
      if (!editor) {
        console.error('Editor not found');
        return;
      }

      // Create an iframe HTML element for the video
      const iframeHTML = `<iframe 
        width="560" 
        height="315" 
        src="${embedUrl}" 
        frameborder="0" 
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
        allowfullscreen>
      </iframe>`;

      // Get current position or insert at end
      let range = editor.getSelection();
      if (!range) {
        range = { index: editor.getLength() - 1, length: 0 };
      }

      // Insert HTML directly
      editor.insertEmbed(range.index, 'video', embedUrl);
      editor.setSelection(range.index + 1);
      setIsVideoModalOpen(false);
    } catch (err) {
      console.error('Error inserting video:', err);
    }
  };

  const formats = [
    'header',
    'bold', 'italic', 'underline', 'strike',
    'list', 'bullet',
    'blockquote', 'code-block',
    'align',
    'color', 'background',
    'image', 'video', 'link'
  ];

  // Custom video blot for better embed support
  const VideoBlot = ReactQuill.Quill.import('formats/video');
  class CustomVideoBlot extends VideoBlot {
    static create(value) {
      const node = document.createElement('iframe');
      node.setAttribute('src', value);
      node.setAttribute('frameborder', '0');
      node.setAttribute('allow', 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture');
      node.setAttribute('allowfullscreen', 'true');
      node.setAttribute('width', '560');
      node.setAttribute('height', '315');
      node.setAttribute('style', 'max-width: 100%; border-radius: 8px;');
      return node;
    }

    static formats(domNode) {
      return domNode.getAttribute('src');
    }
  }
  CustomVideoBlot.blotName = 'video';
  CustomVideoBlot.tagName = 'iframe';
  CustomVideoBlot.className = 'ql-video';

  // Register the custom video blot
  try {
    ReactQuill.Quill.register(CustomVideoBlot, true);
  } catch (e) {
    // Already registered
  }

  const modules = {
    toolbar: [
      [{ 'header': [1, 2, 3, 4, 5, false] }],
      ['bold', 'italic', 'underline', 'strike'],
      [{ 'list': 'ordered' }, { 'list': 'bullet' }],
      ['blockquote', 'code-block'],
      [{ 'align': [] }],
      [{ 'color': [] }, { 'background': [] }],
      ['link'],
      ['clean']
    ]
  };

  return (
    <div className="rich-editor-container">
      <div className="editor-controls">
        <button 
          type="button" 
          className="editor-btn"
          onClick={handleImageInsert}
          title="Add Image"
        >
          🖼️ Image
        </button>
        <button 
          type="button" 
          className="editor-btn"
          onClick={handleVideoInsert}
          title="Add YouTube Video"
        >
          🎬 Video
        </button>
      </div>
      <ReactQuill
        ref={quillRef}
        theme="snow"
        value={value}
        onChange={onChange}
        modules={modules}
        formats={formats}
        placeholder={placeholder}
      />
      <VideoModal
        isOpen={isVideoModalOpen}
        onClose={() => setIsVideoModalOpen(false)}
        onSubmit={handleVideoUrlSubmit}
      />
    </div>
  );
};

export default RichTextEditor;
