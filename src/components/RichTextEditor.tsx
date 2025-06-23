
import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { 
  Bold, 
  Italic, 
  Underline, 
  Code, 
  List, 
  ListOrdered, 
  Quote,
  Heading1,
  Heading2,
  Heading3,
  Link,
  Image
} from 'lucide-react';

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

const RichTextEditor = ({ value, onChange, placeholder }: RichTextEditorProps) => {
  const editorRef = useRef<HTMLDivElement>(null);

  const formatText = (command: string, value?: string) => {
    document.execCommand(command, false, value);
    if (editorRef.current) {
      onChange(editorRef.current.innerHTML);
    }
  };

  const insertCodeBlock = () => {
    const selection = window.getSelection();
    if (selection && selection.rangeCount > 0) {
      const range = selection.getRangeAt(0);
      const codeBlock = document.createElement('pre');
      codeBlock.style.backgroundColor = '#1a1a1a';
      codeBlock.style.color = '#00ff00';
      codeBlock.style.padding = '16px';
      codeBlock.style.borderRadius = '8px';
      codeBlock.style.fontFamily = 'Monaco, Consolas, "Courier New", monospace';
      codeBlock.style.fontSize = '14px';
      codeBlock.style.overflow = 'auto';
      codeBlock.style.marginTop = '16px';
      codeBlock.style.marginBottom = '16px';
      
      const code = document.createElement('code');
      code.textContent = selection.toString() || 'Your code here...';
      codeBlock.appendChild(code);
      
      range.deleteContents();
      range.insertNode(codeBlock);
      
      if (editorRef.current) {
        onChange(editorRef.current.innerHTML);
      }
    }
  };

  const handleInput = () => {
    if (editorRef.current) {
      onChange(editorRef.current.innerHTML);
    }
  };

  return (
    <div className="border rounded-lg">
      <div className="border-b p-2 flex flex-wrap gap-1">
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => formatText('bold')}
        >
          <Bold className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => formatText('italic')}
        >
          <Italic className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => formatText('underline')}
        >
          <Underline className="h-4 w-4" />
        </Button>
        <div className="border-l mx-1"></div>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => formatText('formatBlock', 'h1')}
        >
          <Heading1 className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => formatText('formatBlock', 'h2')}
        >
          <Heading2 className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => formatText('formatBlock', 'h3')}
        >
          <Heading3 className="h-4 w-4" />
        </Button>
        <div className="border-l mx-1"></div>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => formatText('insertUnorderedList')}
        >
          <List className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => formatText('insertOrderedList')}
        >
          <ListOrdered className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => formatText('formatBlock', 'blockquote')}
        >
          <Quote className="h-4 w-4" />
        </Button>
        <div className="border-l mx-1"></div>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={insertCodeBlock}
        >
          <Code className="h-4 w-4" />
        </Button>
      </div>
      <div
        ref={editorRef}
        contentEditable
        className="min-h-[300px] p-4 focus:outline-none"
        onInput={handleInput}
        dangerouslySetInnerHTML={{ __html: value }}
        style={{ wordBreak: 'break-word' }}
      />
    </div>
  );
};

export default RichTextEditor;
