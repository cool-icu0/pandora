'use client';

import MonacoEditor from 'react-monaco-editor';

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
  };

  return (
    <MonacoEditor
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