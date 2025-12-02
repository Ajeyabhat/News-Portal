import React from 'react';
import { InboxIcon } from 'lucide-react';

const EmptyState = ({ message }) => {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4">
      <div className="text-gray-300 dark:text-gray-600 mb-4">
        <InboxIcon size={64} />
      </div>
      <p className="text-lg text-gray-600 dark:text-gray-400 text-center">{message}</p>
    </div>
  );
};

export default EmptyState;