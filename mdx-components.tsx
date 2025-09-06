import type { MDXComponents } from 'mdx/types';
import { 
  Callout,
  Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter,
  Button,
  CodeBlock,
  Progress,
  Alert, AlertTitle, AlertDescription,
  Tabs, TabsList, TabsTrigger, TabsContent,
  Accordion, AccordionItem, AccordionTrigger, AccordionContent,
  InteractiveChart
} from '@/components/mdx';

export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    // Custom components
    Callout,
    Card,
    CardHeader,
    CardTitle, 
    CardDescription,
    CardContent,
    CardFooter,
    Button,
    CodeBlock,
    Progress,
    Alert,
    AlertTitle,
    AlertDescription,
    Tabs,
    TabsList,
    TabsTrigger,
    TabsContent,
    Accordion,
    AccordionItem,
    AccordionTrigger,
    AccordionContent,
    InteractiveChart,
    // Default HTML elements with custom styling
    h1: ({ children }) => <h1 className="text-3xl font-bold mt-8 mb-4">{children}</h1>,
    h2: ({ children }) => <h2 className="text-2xl font-semibold mt-6 mb-3">{children}</h2>,
    h3: ({ children }) => <h3 className="text-xl font-medium mt-4 mb-2">{children}</h3>,
    p: ({ children }) => <p className="mb-4 leading-relaxed">{children}</p>,
    ul: ({ children }) => <ul className="list-disc pl-6 mb-4 space-y-1">{children}</ul>,
    ol: ({ children }) => <ol className="list-decimal pl-6 mb-4 space-y-1">{children}</ol>,
    li: ({ children }) => <li className="leading-relaxed">{children}</li>,
    blockquote: ({ children }) => (
      <blockquote className="border-l-4 border-gray-300 pl-4 italic my-4 text-gray-600">
        {children}
      </blockquote>
    ),
    code: ({ children }) => (
      <code className="bg-gray-100 px-2 py-1 rounded text-sm font-mono">{children}</code>
    ),
    pre: ({ children }) => (
      <pre className="bg-gray-900 text-white p-4 rounded-lg overflow-x-auto my-4">
        {children}
      </pre>
    ),
    // Allow overrides from props
    ...components,
  };
}
