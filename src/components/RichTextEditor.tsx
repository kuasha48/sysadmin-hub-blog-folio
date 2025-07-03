
import React from 'react';
import { Textarea } from '@/components/ui/textarea';

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

const RichTextEditor: React.FC<RichTextEditorProps> = ({
  value,
  onChange,
  placeholder = "Write your content here...",
  className = ""
}) => {
  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
        <span>💡 Tip: You can use Markdown formatting</span>
      </div>
      <Textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className={`min-h-[400px] font-mono text-sm leading-relaxed ${className}`}
        style={{
          direction: 'ltr',
          textAlign: 'left',
          unicodeBidi: 'normal',
          writingMode: 'horizontal-tb',
          lineHeight: '1.6'
        }}
      />
      <div className="text-xs text-gray-500">
        Supports basic Markdown: **bold**, *italic*, `code`, # headers, - lists
      </div>
    </div>
  );
};

export default RichTextEditor;
