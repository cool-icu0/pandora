'use client';

import MonacoEditor from 'react-monaco-editor';
import { useEffect, useState } from 'react';
import './index.css';

interface CodeEditorProps {
  value?: string;
  onChange?: (value: string) => void;
  language?: string;
}

const CodeEditor: React.FC<CodeEditorProps> = ({
  value = '',
  onChange = () => {},
  language = 'java'
}) => {
  // 添加主题状态
  const [editorTheme, setEditorTheme] = useState('vs-dark');

  // 监听主题变化
  useEffect(() => {
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.attributeName === 'theme-mode') {
          const theme = document.body.getAttribute('theme-mode');
          setEditorTheme(theme === 'dark' ?  'vs' :'vs-dark' );
        }
      });
    });

    observer.observe(document.body, {
      attributes: true,
      attributeFilter: ['theme-mode'],
    });

    return () => observer.disconnect();
  }, []);

  const options = {
    minimap: { enabled: false },
    fontSize: 14,
    lineNumbers: 'on',
    automaticLayout: true,
    scrollBeyondLastLine: false,
    formatOnPaste: true,
    formatOnType: true,
    autoIndent: 'full',
    tabSize: 4,
    wordWrap: 'on',
    suggest: {
      snippetsPreventQuickSuggestions: false,
    },
    highlightActiveIndentGuide: true,
    renderLineHighlight: 'all',
    matchBrackets: 'always',
    lineDecorationsWidth: 10,
    lineNumbersMinChars: 3,
    fontFamily: 'Consolas, "Courier New", monospace',
    scrollbar: {
        vertical: 'hidden',
        horizontal: 'hidden',
    },
    // 添加以下配置以增强代码高亮效果
    bracketPairColorization: {
      enabled: true,
    },
    renderWhitespace: 'selection',
    colorDecorators: true,
    semanticHighlighting: {
      enabled: true
    },
  };

  return (
    <MonacoEditor className="code-editor-container"
      height="400"
      language={language.toLowerCase()}
      theme="vs-dark"
      value={value}
      onChange={onChange}
      options={options}
    />
  );
};

export default CodeEditor;