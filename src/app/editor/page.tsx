"use client";
import { useState, useRef } from 'react';

export default function EditorPage() {
  const [content, setContent] = useState('');
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Personal');
  const [tags, setTags] = useState('');
  const [summary, setSummary] = useState('');
  
  // AI State Management
  const [isProcessing, setIsProcessing] = useState(false);
  const [aiQuestions, setAiQuestions] = useState<string[]>([]);
  const [showQuestions, setShowQuestions] = useState(false);
  const [lastProcessed, setLastProcessed] = useState('');
  
  // Undo System
  const [contentHistory, setContentHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  
  // Component Menu
  const [showComponentMenu, setShowComponentMenu] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [cursorPosition, setCursorPosition] = useState(0);

  // Undo System
  const saveToHistory = (newContent: string) => {
    const newHistory = contentHistory.slice(0, historyIndex + 1);
    newHistory.push(newContent);
    setContentHistory(newHistory);
    setHistoryIndex(newHistory.length - 1);
  };

  const undoLastAI = () => {
    if (historyIndex > 0) {
      setHistoryIndex(historyIndex - 1);
      setContent(contentHistory[historyIndex - 1]);
      setLastProcessed('⏪ Undid last AI change');
    }
  };

  const redoChange = () => {
    if (historyIndex < contentHistory.length - 1) {
      setHistoryIndex(historyIndex + 1);
      setContent(contentHistory[historyIndex + 1]);
      setLastProcessed('⏩ Redid change');
    }
  };

  // Non-AI MDX Conversion
  const convertToMDX = () => {
    if (!title || !content) {
      alert('Please add a title and content first!');
      return;
    }

    const currentDate = new Date().toISOString().split('T')[0];
    const tagArray = tags ? tags.split(',').map(tag => tag.trim()) : [];
    
    const frontmatter = `---
title: "${title}"
date: "${currentDate}"
category: "${category}"
tags: [${tagArray.map(tag => `"${tag}"`).join(', ')}]
summary: "${summary || `A blog post about ${title}`}"
published: false
---

`;

    const mdxContent = frontmatter + content.replace(/^---[\s\S]*?---\s*/, '');
    saveToHistory(content);
    setContent(mdxContent);
    setLastProcessed('✅ Converted to MDX format (no AI used)');
  };

  // Component Insertion
  const componentTemplates = {
    callout: {
      name: 'Callout',
      template: `<Callout type="info" title="Title Here">
Your content here
</Callout>`,
      description: 'Info box with icon'
    },
    card: {
      name: 'Card',
      template: `<Card>
  <CardHeader>
    <CardTitle>Card Title</CardTitle>
    <CardDescription>Description here</CardDescription>
  </CardHeader>
  <CardContent>
    Your content here
  </CardContent>
</Card>`,
      description: 'Content card with header'
    },
    alert: {
      name: 'Alert',
      template: `<Alert variant="info">
  <AlertTitle>Alert Title</AlertTitle>
  <AlertDescription>
    Your alert message here
  </AlertDescription>
</Alert>`,
      description: 'Alert message box'
    },
    progress: {
      name: 'Progress',
      template: `<Progress value={75} max={100} showValue={true} variant="default" />`,
      description: 'Progress indicator'
    },
    codeblock: {
      name: 'Code Block',
      template: `<CodeBlock language="javascript" title="Example">
\`\`\`
your code here
\`\`\`
</CodeBlock>`,
      description: 'Code with copy button'
    },
    button: {
      name: 'Button',
      template: `<Button variant="default">Click me</Button>`,
      description: 'Interactive button'
    },
    tabs: {
      name: 'Tabs',
      template: `<Tabs defaultValue="tab1">
  <TabsList>
    <TabsTrigger value="tab1">Tab 1</TabsTrigger>
    <TabsTrigger value="tab2">Tab 2</TabsTrigger>
  </TabsList>
  <TabsContent value="tab1">
    Content for tab 1
  </TabsContent>
  <TabsContent value="tab2">
    Content for tab 2
  </TabsContent>
</Tabs>`,
      description: 'Tabbed content'
    },
    accordion: {
      name: 'Accordion',
      template: `<Accordion type="single" collapsible>
  <AccordionItem value="item-1">
    <AccordionTrigger>Section 1</AccordionTrigger>
    <AccordionContent>
      Content for section 1
    </AccordionContent>
  </AccordionItem>
  <AccordionItem value="item-2">
    <AccordionTrigger>Section 2</AccordionTrigger>
    <AccordionContent>
      Content for section 2
    </AccordionContent>
  </AccordionItem>
</Accordion>`,
      description: 'Collapsible sections'
    }
  };

  const insertComponent = (componentKey: string) => {
    const template = componentTemplates[componentKey as keyof typeof componentTemplates];
    if (!template || !textareaRef.current) return;

    const textarea = textareaRef.current;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const newContent = content.substring(0, start) + '\n\n' + template.template + '\n\n' + content.substring(end);
    
    setContent(newContent);
    setShowComponentMenu(false);
    
    // Set cursor after inserted component
    setTimeout(() => {
      const newCursorPos = start + template.template.length + 4;
      textarea.setSelectionRange(newCursorPos, newCursorPos);
      textarea.focus();
    }, 0);
  };

  const handleTextareaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setContent(e.target.value);
    setCursorPosition(e.target.selectionStart);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    // Ctrl+/ or Cmd+/ to open component menu
    if ((e.ctrlKey || e.metaKey) && e.key === '/') {
      e.preventDefault();
      setShowComponentMenu(!showComponentMenu);
    }
    // Ctrl+Z for undo
    if ((e.ctrlKey || e.metaKey) && e.key === 'z' && !e.shiftKey) {
      e.preventDefault();
      undoLastAI();
    }
    // Ctrl+Shift+Z for redo
    if ((e.ctrlKey || e.metaKey) && e.key === 'z' && e.shiftKey) {
      e.preventDefault();
      redoChange();
    }
  };

  // AI Function 1: Generate Discussion Questions
  const generateQuestions = async () => {
    if (!content || content.length < 100) {
      alert('Please write at least 100 characters of content first!');
      return;
    }

    setIsProcessing(true);
    try {
      const response = await fetch('/api/ai-questions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content, title })
      });
      
      const data = await response.json();
      if (data.questions) {
        setAiQuestions(data.questions);
        setShowQuestions(true);
      } else {
        throw new Error(data.error || 'Failed to generate questions');
      }
    } catch (error) {
      console.error('Questions error:', error);
      alert('Failed to generate questions. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  // AI Function 2: Embellish Content
  const embellishContent = async (style = 'engaging') => {
    if (!content || content.length < 50) {
      alert('Please write some content first!');
      return;
    }

    saveToHistory(content); // Save current state before AI change
    setIsProcessing(true);
    try {
      const response = await fetch('/api/ai-embellish', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content, style })
      });
      
      const data = await response.json();
      if (data.embellished_content) {
        setContent(data.embellished_content);
        setLastProcessed(`Enhanced with ${data.enhancement_ratio} more engaging content`);
      } else {
        throw new Error(data.error || 'Failed to embellish content');
      }
    } catch (error) {
      console.error('Embellish error:', error);
      alert('Failed to enhance content. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  // AI Function 3: Generate Metadata
  const generateMetadata = async () => {
    if (!title || !content || content.length < 100) {
      alert('Please add a title and at least 100 characters of content first!');
      return;
    }

    setIsProcessing(true);
    try {
      const response = await fetch('/api/ai-enrich', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, content })
      });
      
      const data = await response.json();
      if (data.summary) {
        setSummary(data.summary);
        setTags(data.tags?.join(', ') || '');
        setCategory(data.category || 'Personal');
        setLastProcessed('Generated metadata: summary, tags, and category');
      } else {
        throw new Error(data.error || 'Failed to generate metadata');
      }
    } catch (error) {
      console.error('Metadata error:', error);
      alert('Failed to generate metadata. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  // AI Function 4: Generate MDX Structure
  const generateMDXStructure = async () => {
    if (!title || !content) {
      alert('Please add a title and some content first!');
      return;
    }

    saveToHistory(content); // Save current state before AI change
    setIsProcessing(true);
    try {
      const response = await fetch('/api/ai-mdx', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          title, 
          content, 
          category, 
          tags, 
          summary,
          action: 'enhance'
        })
      });
      
      const data = await response.json();
      if (data.mdx_content) {
        setContent(data.mdx_content);
        setLastProcessed('Generated proper MDX structure with frontmatter');
      } else {
        throw new Error(data.error || 'Failed to generate MDX');
      }
    } catch (error) {
      console.error('MDX error:', error);
      alert('Failed to generate MDX structure. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  // AI Function 5: Enhance with MDX (Smart Enhancement)
  const enhanceWithMDX = async () => {
    if (!title || !content) {
      alert('Please add a title and some content first!');
      return;
    }

    saveToHistory(content); // Save current state before AI change
    setIsProcessing(true);
    try {
      const response = await fetch('/api/ai-mdx', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          title, 
          content, 
          category, 
          tags, 
          summary
        })
      });
      
      const data = await response.json();
      if (data.mdx_content) {
        setContent(data.mdx_content);
        setLastProcessed('Enhanced content with proper MDX structure and frontmatter');
      } else {
        throw new Error(data.error || 'Failed to enhance with MDX');
      }
    } catch (error) {
      console.error('MDX enhance error:', error);
      alert('Failed to enhance with MDX. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleSave = async () => {
    if (!title || !content) {
      alert('Please add a title and content before saving!');
      return;
    }

    setIsProcessing(true);
    try {
      const response = await fetch('/api/save-post', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          title, 
          content, 
          category, 
          tags, 
          summary, 
          published: false // Save as draft
        })
      });
      
      const data = await response.json();
      if (data.success) {
        setLastProcessed(`✅ Draft saved: ${data.filename}`);
      } else {
        throw new Error(data.error || 'Failed to save draft');
      }
    } catch (error) {
      console.error('Save error:', error);
      alert('Failed to save draft. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handlePublish = async () => {
    if (!title || !content) {
      alert('Please add a title and content before publishing!');
      return;
    }

    // First ensure we have MDX structure
    if (!content.startsWith('---')) {
      const shouldAddMDX = confirm('Content needs MDX frontmatter. Add it automatically?');
      if (shouldAddMDX) {
        await enhanceWithMDX();
        return; // Let user review before publishing
      }
    }

    setIsProcessing(true);
    try {
      const response = await fetch('/api/save-post', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          title, 
          content, 
          category, 
          tags, 
          summary, 
          published: true // Publish live
        })
      });
      
      const data = await response.json();
      if (data.success) {
        setLastProcessed(`🚀 Published: ${data.filename} - Live on your blog!`);
      } else {
        throw new Error(data.error || 'Failed to publish');
      }
    } catch (error) {
      console.error('Publish error:', error);
      alert('Failed to publish. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="max-w-6xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-light text-white">MDX Editor</h1>
          <div className="flex gap-3">
            {/* Undo/Redo Buttons */}
            <div className="flex gap-1">
              <button
                onClick={undoLastAI}
                disabled={historyIndex <= 0}
                className="bg-gray-700 hover:bg-gray-600 disabled:opacity-30 disabled:cursor-not-allowed text-white font-medium px-3 py-2 rounded-lg border border-gray-600 transition-colors text-sm"
                title="Undo last AI change (Ctrl+Z)"
              >
                ⏪ Undo
              </button>
              <button
                onClick={redoChange}
                disabled={historyIndex >= contentHistory.length - 1}
                className="bg-gray-700 hover:bg-gray-600 disabled:opacity-30 disabled:cursor-not-allowed text-white font-medium px-3 py-2 rounded-lg border border-gray-600 transition-colors text-sm"
                title="Redo change (Ctrl+Shift+Z)"
              >
                ⏩ Redo
              </button>
            </div>
            
            <button
              onClick={handleSave}
              disabled={isProcessing}
              className="bg-gray-800 hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-medium px-6 py-2 rounded-lg border border-gray-600 transition-colors"
            >
              {isProcessing ? '⏳ Saving...' : '💾 Save Draft'}
            </button>
            <button
              onClick={handlePublish}
              disabled={isProcessing}
              className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-medium px-6 py-2 rounded-lg transition-colors"
            >
              {isProcessing ? '⏳ Publishing...' : '🚀 Publish Live'}
            </button>
          </div>
        </div>

        {/* Post Metadata */}
        <div className="space-y-4 mb-8">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-4 py-3 bg-gray-900 border border-gray-600 rounded-lg focus:border-blue-500 focus:outline-none text-white placeholder-gray-400 text-lg"
              placeholder="Enter your post title..."
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-4 py-3 bg-gray-900 border border-gray-600 rounded-lg focus:border-blue-500 focus:outline-none text-white"
              >
                <option value="Personal">Personal</option>
                <option value="Tech">Tech</option>
                <option value="Travel">Travel</option>
                <option value="Life">Life</option>
                <option value="Thoughts">Thoughts</option>
                <option value="Projects">Projects</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Tags</label>
              <input
                type="text"
                value={tags}
                onChange={(e) => setTags(e.target.value)}
                className="w-full px-4 py-3 bg-gray-900 border border-gray-600 rounded-lg focus:border-blue-500 focus:outline-none text-white placeholder-gray-400"
                placeholder="tag1, tag2, tag3"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Summary</label>
            <textarea
              value={summary}
              onChange={(e) => setSummary(e.target.value)}
              rows={3}
              className="w-full px-4 py-3 bg-gray-900 border border-gray-600 rounded-lg focus:border-blue-500 focus:outline-none text-white placeholder-gray-400 resize-none"
              placeholder="Brief description for your post..."
            />
          </div>
        </div>

        {/* AI Enhancement Buttons */}
        <div className="space-y-4 mb-6">
          {/* Status Display */}
          {lastProcessed && (
            <div className="bg-green-900/30 border border-green-600 rounded-lg px-4 py-2 text-green-200 text-sm">
              ✅ {lastProcessed}
            </div>
          )}
          
          {/* AI Action Buttons */}
          <div className="flex flex-wrap gap-3">
            <button 
              onClick={() => embellishContent('engaging')}
              disabled={isProcessing}
              className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-medium px-4 py-2 rounded-lg text-sm transition-all transform hover:scale-105"
            >
              {isProcessing ? '⏳ Processing...' : '✨ Embellish Content'}
            </button>
            
            <button 
              onClick={generateQuestions}
              disabled={isProcessing}
              className="bg-gradient-to-r from-green-600 to-teal-600 hover:from-green-700 hover:to-teal-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-medium px-4 py-2 rounded-lg text-sm transition-all transform hover:scale-105"
            >
              {isProcessing ? '⏳ Processing...' : '🤔 Generate Questions'}
            </button>
            
            <button 
              onClick={generateMetadata}
              disabled={isProcessing}
              className="bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-medium px-4 py-2 rounded-lg text-sm transition-all transform hover:scale-105"
            >
              {isProcessing ? '⏳ Processing...' : '🏷️ Generate Metadata'}
            </button>

            <button 
              onClick={enhanceWithMDX}
              disabled={isProcessing}
              className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-medium px-4 py-2 rounded-lg text-sm transition-all transform hover:scale-105"
            >
              {isProcessing ? '⏳ Processing...' : '� Enhance with MDX'}
            </button>
          </div>
          
          {/* Enhancement Style Options */}
          <div className="flex flex-wrap gap-2">
            <span className="text-xs text-gray-400">Embellish styles:</span>
            {['engaging', 'vivid', 'conversational', 'professional', 'creative'].map(style => (
              <button
                key={style}
                onClick={() => embellishContent(style)}
                disabled={isProcessing}
                className="text-xs bg-gray-700 hover:bg-gray-600 disabled:opacity-50 text-white px-2 py-1 rounded border border-gray-600 transition-colors"
              >
                {style}
              </button>
            ))}
          </div>
        </div>

        {/* Generated Questions Display */}
        {showQuestions && aiQuestions.length > 0 && (
          <div className="bg-blue-900/20 border border-blue-600 rounded-lg p-4 mb-6">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-lg font-medium text-blue-200">💭 Discussion Questions</h3>
              <button
                onClick={() => setShowQuestions(false)}
                className="text-blue-400 hover:text-blue-300 text-sm"
              >
                ✕ Close
              </button>
            </div>
            <div className="space-y-2">
              {aiQuestions.map((question, index) => (
                <div key={index} className="bg-blue-900/30 rounded px-3 py-2">
                  <p className="text-blue-100">{question}</p>
                  <button
                    onClick={() => navigator.clipboard.writeText(question)}
                    className="text-xs text-blue-400 hover:text-blue-300 mt-1"
                  >
                    📋 Copy
                  </button>
                </div>
              ))}
            </div>
            <p className="text-xs text-blue-300 mt-3">
              💡 These questions can be added to your post or used for social media engagement
            </p>
          </div>
        )}

        {/* Component Menu */}
        {showComponentMenu && (
          <div className="bg-gray-900 border border-gray-600 rounded-lg p-4 mb-6">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-lg font-medium text-gray-200">🧩 Insert Component</h3>
              <button
                onClick={() => setShowComponentMenu(false)}
                className="text-gray-400 hover:text-gray-300 text-sm"
              >
                ✕ Close
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {Object.entries(componentTemplates).map(([key, template]) => (
                <button
                  key={key}
                  onClick={() => insertComponent(key)}
                  className="bg-gray-800 hover:bg-gray-700 border border-gray-600 rounded-lg p-3 text-left transition-colors"
                >
                  <div className="font-medium text-white text-sm">{template.name}</div>
                  <div className="text-xs text-gray-400 mt-1">{template.description}</div>
                </button>
              ))}
            </div>
            <p className="text-xs text-gray-400 mt-3">
              💡 Press Ctrl+/ anywhere in the editor to toggle this menu
            </p>
          </div>
        )}

        {/* Non-AI Actions */}
        <div className="flex flex-wrap gap-3 mb-6">
          <span className="text-sm text-gray-400 flex items-center">Quick Actions:</span>
          <button 
            onClick={convertToMDX}
            className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium px-4 py-2 rounded-lg text-sm transition-all"
          >
            📝 Convert to MDX (No AI)
          </button>
          <button 
            onClick={() => setShowComponentMenu(!showComponentMenu)}
            className="bg-purple-600 hover:bg-purple-700 text-white font-medium px-4 py-2 rounded-lg text-sm transition-all"
          >
            🧩 Insert Component (Ctrl+/)
          </button>
        </div>

        {/* Main Editor Area */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Editor */}
          <div className="border border-gray-600 rounded-lg overflow-hidden shadow-xl">
            <div className="bg-gray-800 px-4 py-3 border-b border-gray-600">
              <span className="text-sm font-medium text-gray-200">MDX Content</span>
            </div>
            <div className="p-4 bg-gray-900">
              <textarea
                ref={textareaRef}
                value={content}
                onChange={handleTextareaChange}
                onKeyDown={handleKeyDown}
                className="w-full h-96 bg-gray-800 text-white p-4 rounded border border-gray-600 focus:border-blue-500 focus:outline-none font-mono text-sm resize-none"
                placeholder="Write your MDX content here...

Keyboard Shortcuts:
• Ctrl+/ - Insert component menu
• Ctrl+Z - Undo last AI change
• Ctrl+Shift+Z - Redo change

Example:
---
title: My Post
date: 2025-01-20
---

# Hello World

This is **markdown** with React components!

<Callout type='info'>
This is a custom component
</Callout>

## Features
- Markdown syntax
- React components
- Frontmatter metadata"
              />
            </div>
          </div>

          {/* Preview */}
          <div className="border border-gray-600 rounded-lg overflow-hidden shadow-xl">
            <div className="bg-gray-800 px-4 py-3 border-b border-gray-600">
              <span className="text-sm font-medium text-gray-200">Raw Preview</span>
            </div>
            <div className="p-4 bg-gray-900 h-96 overflow-y-auto">
              <div className="prose prose-invert max-w-none">
                {content ? (
                  <pre className="text-sm text-gray-300 whitespace-pre-wrap font-mono">{content}</pre>
                ) : (
                  <p className="text-gray-500 italic">Preview will appear here as you type...</p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* MDX Help */}
        <div className="mt-8 bg-gray-900/50 border border-gray-700 rounded-lg p-6">
          <h3 className="text-lg font-medium text-gray-200 mb-4">📚 MDX Quick Reference</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
            <div>
              <h4 className="font-medium text-gray-300 mb-2">Frontmatter (YAML)</h4>
              <pre className="bg-gray-800 p-3 rounded text-xs text-gray-400">
{`---
title: "Your Post Title"
date: "2025-01-20"
category: "Tech"
tags: ["react", "mdx"]
summary: "Brief description"
---`}
              </pre>
            </div>
            <div>
              <h4 className="font-medium text-gray-300 mb-2">Components</h4>
              <pre className="bg-gray-800 p-3 rounded text-xs text-gray-400">
{`<Callout type="info">
  Important information
</Callout>

<InteractiveChart data={chartData} />

{/* Standard markdown works too */}
## Heading
**Bold** and *italic* text`}
              </pre>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
