import React, { useRef, useState, useContext, useEffect } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import VideoModal from './VideoModal';
import ImageModal from './ImageModal';
import { Image as ImageIcon, Film } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

// Add custom Tailwind styles for Quill editor
const quillStyles = `
  .ql-container {
    @apply font-base;
    font-size: 16px;
  }

  .ql-editor {
    @apply min-h-64 p-4 text-gray-900;
    background-color: #fff;
  }

  .ql-editor.dark-mode {
    background-color: #374151 !important;
    color: #f3f4f6 !important;
  }

  .ql-editor.dark-mode p,
  .ql-editor.dark-mode div,
  .ql-editor.dark-mode span {
    color: #f3f4f6 !important;
  }

  .ql-editor.dark-mode h1,
  .ql-editor.dark-mode h2,
  .ql-editor.dark-mode h3,
  .ql-editor.dark-mode h4,
  .ql-editor.dark-mode h5,
  .ql-editor.dark-mode h6 {
    color: #f3f4f6 !important;
  }

  .ql-toolbar {
    @apply border-b-2 border-gray-300 rounded-t-lg bg-gray-50;
  }

  .ql-toolbar.dark-mode {
    background-color: #1f2937 !important;
    border-color: #4b5563 !important;
  }

  .ql-toolbar.ql-snow .ql-picker-label {
    @apply text-gray-700;
  }

  .ql-toolbar.dark-mode .ql-picker-label {
    color: #d1d5db !important;
  }

  .ql-toolbar.ql-snow button,
  .ql-toolbar.ql-snow button.ql-active,
  .ql-toolbar.ql-snow .ql-picker-item:hover,
  .ql-toolbar.ql-snow .ql-picker-item.ql-selected {
    @apply text-primary-600;
  }

  .ql-toolbar.ql-snow .ql-stroke {
    @apply stroke-gray-600;
  }

  .ql-toolbar.dark-mode .ql-stroke {
    stroke: #9ca3af !important;
  }

  .ql-toolbar.ql-snow .ql-fill,
  .ql-toolbar.ql-snow .ql-stroke.ql-fill {
    @apply fill-gray-600;
  }

  .ql-toolbar.dark-mode .ql-fill,
  .ql-toolbar.dark-mode .ql-stroke.ql-fill {
    fill: #9ca3af !important;
  }

  .ql-editor.ql-blank::before {
    @apply text-gray-400;
  }

  .ql-editor.dark-mode.ql-blank::before {
    color: #6b7280 !important;
  }

  .ql-video {
    @apply rounded-lg;
  }

  .ql-editor h1 { @apply text-3xl font-bold mb-2 mt-4 text-gray-900; }
  .ql-editor h2 { @apply text-2xl font-bold mb-2 mt-3 text-gray-800; }
  .ql-editor h3 { @apply text-xl font-bold mb-2 mt-3 text-gray-800; }
  .ql-editor blockquote { @apply border-l-4 border-primary-600 pl-4 italic text-gray-600; }
  .ql-editor code-block { @apply bg-gray-900 text-gray-100 rounded p-2; }
`;

// Add styles to document
if (typeof window !== 'undefined') {
  const styleSheet = document.createElement('style');
  styleSheet.textContent = quillStyles;
  document.head.appendChild(styleSheet);
}

const RichTextEditor = ({ value, onChange, placeholder = 'Write article content...' }) => {
  const containerRef = useRef(null);
  const editorRef = useRef(null);
  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);
  const { theme } = useTheme();

  // Update Quill styling when theme changes
  useEffect(() => {
    if (containerRef.current) {
      const editor = containerRef.current.querySelector('.ql-editor');
      const toolbar = containerRef.current.querySelector('.ql-toolbar');
      
      if (theme === 'dark') {
        editor?.classList.add('dark-mode');
        toolbar?.classList.add('dark-mode');
      } else {
        editor?.classList.remove('dark-mode');
        toolbar?.classList.remove('dark-mode');
      }
    }
  }, [theme]);

  // Handle image insertion - URL only
  const handleImageInsert = () => {
    setIsImageModalOpen(true);
  };

  // Process image URL from modal
  const handleImageUrlSubmit = (url) => {
    const editor = editorRef.current?.getEditor();
    if (editor) {
      const range = editor.getSelection(true);
      editor.insertEmbed(range.index, 'image', url);
      editor.setSelection(range.index + 1);
      setIsImageModalOpen(false);
    }
  };

  // Handle video insertion (Google Drive)
  const handleVideoInsert = () => {
    setIsVideoModalOpen(true);
  };

  // Process video URL from modal
  const handleVideoUrlSubmit = (url) => {
    let embedUrl = url;
    
    // Convert Google Drive share link to embed format
    if (url.includes('drive.google.com/file/d/')) {
      // Extract file ID from: https://drive.google.com/file/d/FILE_ID/view
      const fileId = url.split('/d/')[1]?.split('/')[0];
      if (fileId) {
        embedUrl = `https://drive.google.com/file/d/${fileId}/preview`;
      }
    } else if (url.includes('youtube.com/watch')) {
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
      const editor = editorRef.current?.getEditor();
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
          title="Add Google Drive Video"
        >
          <Film size={18} />
          <span>Add Video</span>
        </button>
      </div>
      <div ref={containerRef} className="border-2 border-gray-300 dark:border-gray-600 rounded-lg overflow-hidden">
        <ReactQuill
          ref={editorRef}
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
