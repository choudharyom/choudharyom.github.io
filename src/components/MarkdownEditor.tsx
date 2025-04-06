import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';

interface MarkdownEditorProps {
  initialValue?: string;
  onChange?: (value: string) => void;
}

const MarkdownEditor: React.FC<MarkdownEditorProps> = ({ initialValue = '', onChange }) => {
  const [content, setContent] = useState(initialValue);
  const [isPreviewMode, setIsPreviewMode] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newContent = e.target.value;
    setContent(newContent);
    onChange?.(newContent);
  };

  return (
    <div className="border dark:border-gray-700 rounded-lg overflow-hidden">
      <div className="bg-gray-100 dark:bg-gray-800 px-4 py-2 flex justify-between items-center">
        <h3 className="text-gray-700 dark:text-gray-300 font-medium">
          {isPreviewMode ? 'Preview' : 'Editor'}
        </h3>
        <button
          onClick={() => setIsPreviewMode(!isPreviewMode)}
          className="px-3 py-1 text-sm bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded border dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors"
        >
          {isPreviewMode ? 'Edit' : 'Preview'}
        </button>
      </div>
      
      <div className="p-4">
        {isPreviewMode ? (
          <div className="prose dark:prose-invert max-w-none">
            <ReactMarkdown>{content}</ReactMarkdown>
          </div>
        ) : (
          <textarea
            value={content}
            onChange={handleChange}
            className="w-full h-96 p-4 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 border-0 focus:ring-2 focus:ring-blue-500 rounded-lg resize-none"
            placeholder="Write your post content here using Markdown..."
          />
        )}
      </div>
    </div>
  );
};

export default MarkdownEditor;