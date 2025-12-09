import React, { useRef, useState } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import VideoModal from './VideoModal';
import ImageModal from './ImageModal';
import { Image as ImageIcon, Film } from 'lucide-react';

// Add custom Tailwind styles for Quill editor
const quillStyles = `
  .ql-container {
    @apply font-base;
    font-size: 16px;
  }

  .ql-editor {
    @apply min-h-64 p-4 text-gray-900 dark:text-gray-100;
    background-color: #fff;
  }

  .dark .ql-editor {
    @apply bg-gray-700 text-gray-100;
  }

  .ql-toolbar {
    @apply border-b-2 border-gray-300 dark:border-gray-600 rounded-t-lg bg-gray-50 dark:bg-slate-800;
  }

  .dark .ql-toolbar {
    @apply bg-gray-800;
  }

  .ql-toolbar.ql-snow .ql-picker-label {
    @apply text-gray-700 dark:text-gray-300;
  }

  .ql-toolbar.ql-snow button,
  .ql-toolbar.ql-snow button.ql-active,
  .ql-toolbar.ql-snow .ql-picker-item:hover,
  .ql-toolbar.ql-snow .ql-picker-item.ql-selected {
    @apply text-primary-600;
  }

  .ql-toolbar.ql-snow .ql-stroke {
    @apply stroke-gray-600 dark:stroke-gray-400;
  }

  .ql-toolbar.ql-snow .ql-fill,
  .ql-toolbar.ql-snow .ql-stroke.ql-fill {
    @apply fill-gray-600 dark:fill-gray-400;
  }

  .ql-editor.ql-blank::before {
    @apply text-gray-400 dark:text-gray-500 italic;
  }

  .ql-video {
    @apply rounded-lg;
  }

  .ql-editor h1 { @apply text-3xl font-bold mb-2 mt-4 text-gray-900 dark:text-white; }
  .ql-editor h2 { @apply text-2xl font-bold mb-2 mt-3 text-gray-800 dark:text-gray-200; }
  .ql-editor h3 { @apply text-xl font-bold mb-2 mt-3 text-gray-800 dark:text-gray-200; }
  .ql-editor blockquote { @apply border-l-4 border-primary-600 pl-4 italic text-gray-600 dark:text-gray-400; }
  .ql-editor code-block { @apply bg-gray-900 text-gray-100 rounded p-2; }
`;

// Add styles to document
if (typeof window !== 'undefined') {
  const styleSheet = document.createElement('style');
  styleSheet.textContent = quillStyles;
  document.head.appendChild(styleSheet);
}

const RichTextEditor = ({ value, onChange, placeholder = 'Write article content...' }) => {
  const quillRef = useRef(null);
  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);

  // Handle image insertion - URL only
  const handleImageInsert = () => {
    setIsImageModalOpen(true);
  };

  // Process image URL from modal
  const handleImageUrlSubmit = (url) => {
    const editor = quillRef.current?.getEditor();
    if (editor) {
      const range = editor.getSelection(true);
      editor.insertEmbed(range.index, 'image', url);
      editor.setSelection(range.index + 1);
      setIsImageModalOpen(false);
    }
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
      node.setAttribute('style', 'max-width: 100%; border-radius: 8px; margin: 12px 0;');
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
    <div className="space-y-3">
      <div className="flex gap-2">
        <button 
          type="button" 
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 active:scale-95 transition-all duration-300 font-semibold shadow-md hover:shadow-lg"
          onClick={handleImageInsert}
          title="Add Image"
        >
          <ImageIcon size={18} />
          <span>Add Image</span>
        </button>
        <button 
          type="button" 
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-teal-600 text-white hover:bg-teal-700 active:scale-95 transition-all duration-300 font-semibold shadow-md hover:shadow-lg"
          onClick={handleVideoInsert}
          title="Add YouTube Video"
        >
          <Film size={18} />
          <span>Add Video</span>
        </button>
      </div>
      <div className="border-2 border-gray-300 dark:border-gray-600 rounded-lg overflow-hidden">
        <ReactQuill
          ref={quillRef}
          theme="snow"
          value={value}
          onChange={onChange}
          modules={modules}
          formats={formats}
          placeholder={placeholder}
        />
      </div>
      <VideoModal
        isOpen={isVideoModalOpen}
        onClose={() => setIsVideoModalOpen(false)}
        onSubmit={handleVideoUrlSubmit}
      />
      <ImageModal
        isOpen={isImageModalOpen}
        onClose={() => setIsImageModalOpen(false)}
        onSubmit={handleImageUrlSubmit}
      />
    </div>
  );
};

export default RichTextEditor;
