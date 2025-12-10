import React, { useState, useRef } from 'react';
import { X, Upload } from 'lucide-react';
import toast from 'react-hot-toast';
import axios from 'axios';

const ImageModal = ({ isOpen, onClose, onSubmit }) => {
  const [imageUrl, setImageUrl] = useState('');
  const [error, setError] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [activeTab, setActiveTab] = useState('url'); // 'url' or 'upload'
  const fileInputRef = useRef(null);

  const handleSubmit = async () => {
    setError('');

    if (activeTab === 'url') {
      // Reject base64 URLs
      if (imageUrl.includes('data:image') || imageUrl.includes('base64')) {
        setError('❌ Base64 images are not allowed! Use external image URLs (http/https)');
        return;
      }

      // Validate URL format
      if (!imageUrl.match(/^https?:\/\//i)) {
        setError('❌ Invalid image URL! Must start with http:// or https://');
        return;
      }

      // Validate URL is actually accessible
      setIsUploading(true);
      try {
        const response = await fetch(imageUrl.trim(), { 
          method: 'HEAD',
          mode: 'no-cors'
        });
        
        // URL is accessible
        onSubmit(imageUrl.trim());
        setImageUrl('');
        setError('');
        setIsUploading(false);
      } catch (err) {
        setIsUploading(false);
        setError('❌ Cannot access this image URL. Check if URL is correct and accessible.');
      }
    }
  };

  // Handle file upload
  const handleFileUpload = async (file) => {
    if (!file) return;

    // Validate file
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      setError('❌ Invalid file type! Only JPG, PNG, GIF, WebP allowed');
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      setError('❌ File too large! Maximum 10 MB');
      return;
    }

    setIsUploading(true);
    setError('');
    setUploadProgress(0);

    const formData = new FormData();
    formData.append('image', file);

    try {
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Upload failed');
      }

      const data = await response.json();
      
      // Build full URL
      const baseUrl = axios.defaults.baseURL || window.location.origin;
      const fullUrl = `${baseUrl}${data.imageUrl}`;
      
      // Show compression stats
      toast.success(
        `✅ Image uploaded!\n${data.originalSize} → ${data.compressedSize} (${data.compressionRatio}% smaller)`,
        { duration: 4 }
      );

      onSubmit(fullUrl);
      setActiveTab('url');
      setImageUrl('');
      setError('');
    } catch (err) {
      console.error('Upload error:', err);
      setError(`❌ Upload failed: ${err.message}`);
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
    }
  };

  const handleDragDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    const file = e.dataTransfer.files[0];
    if (file) {
      handleFileUpload(file);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full mx-4 p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">Add Image</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
          >
            <X size={24} />
          </button>
        </div>

        {/* Tab buttons */}
        <div className="flex gap-2 mb-4 border-b border-gray-200 dark:border-gray-600">
          <button
            onClick={() => setActiveTab('url')}
            className={`px-4 py-2 font-medium transition-colors ${
              activeTab === 'url'
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-300'
            }`}
          >
            Paste URL
          </button>
          <button
            onClick={() => setActiveTab('upload')}
            className={`px-4 py-2 font-medium transition-colors ${
              activeTab === 'upload'
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-300'
            }`}
          >
            Upload File
          </button>
        </div>

        <div className="space-y-4">
          {/* URL Tab */}
          {activeTab === 'url' && (
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Image URL
                </label>
                <input
                  type="text"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  placeholder="https://example.com/image.jpg"
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  onKeyPress={(e) => e.key === 'Enter' && handleSubmit()}
                  disabled={isUploading}
                />
              </div>

              {/* Guidance for stable sources */}
              <div className="bg-amber-50 dark:bg-amber-900/20 p-3 rounded text-sm text-amber-800 dark:text-amber-300">
                <strong>💡 Tips for stable image URLs:</strong>
                <ul className="mt-2 ml-4 list-disc text-xs space-y-1">
                  <li>Use images from established news websites (TOI, BBC, Reuters)</li>
                  <li>Avoid personal/temporary image hosting services</li>
                  <li>Ensure URLs don't contain tracking parameters</li>
                  <li>Test URL in browser before pasting here</li>
                </ul>
              </div>
            </div>
          )}

          {/* Upload Tab */}
          {activeTab === 'upload' && (
            <div
              onDragOver={(e) => e.preventDefault()}
              onDrop={handleDragDrop}
              className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-6 text-center hover:border-blue-500 transition-colors cursor-pointer"
              onClick={() => fileInputRef.current?.click()}
            >
              <Upload size={32} className="mx-auto mb-2 text-gray-400" />
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                Drag & drop image or click to select
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-500">
                Max 10 MB • JPG, PNG, GIF, WebP
              </p>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={(e) => handleFileUpload(e.target.files?.[0])}
                disabled={isUploading}
                className="hidden"
              />
            </div>
          )}

          {/* Upload Progress */}
          {isUploading && (
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600 dark:text-gray-400">Uploading...</span>
                <span className="text-gray-600 dark:text-gray-400">{uploadProgress}%</span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                <div
                  className="bg-blue-600 h-2 rounded-full transition-all"
                  style={{ width: `${uploadProgress}%` }}
                />
              </div>
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="text-red-600 dark:text-red-400 text-sm bg-red-50 dark:bg-red-900/20 p-3 rounded">
              {error}
            </div>
          )}

          {/* Info Box */}
          <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded text-sm text-blue-700 dark:text-blue-300">
            Images are automatically compressed and converted to WebP format for faster loading
          </div>

          {/* Buttons */}
          <div className="flex gap-3 pt-4">
            <button
              onClick={onClose}
              disabled={isUploading}
              className="flex-1 px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors font-medium disabled:opacity-50"
            >
              Cancel
            </button>
            {activeTab === 'url' && (
              <button
                onClick={handleSubmit}
                disabled={isUploading}
                className="flex-1 px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 active:scale-95 transition-all font-medium disabled:opacity-50"
              >
                {isUploading ? 'Uploading...' : 'Add Image'}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ImageModal;
