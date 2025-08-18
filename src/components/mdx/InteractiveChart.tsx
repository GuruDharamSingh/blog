"use client";
import { useState } from 'react';

interface ChartProps {
  data: { label: string; value: number }[];
  title?: string;
}

export function InteractiveChart({ data, title }: ChartProps) {
  const [selectedBar, setSelectedBar] = useState<number | null>(null);
  const maxValue = Math.max(...data.map(d => d.value));

  return (
    <div className="my-8 p-6 border rounded-lg bg-gradient-to-br from-blue-50 to-indigo-50">
      {title && <h3 className="text-xl font-semibold mb-4">{title}</h3>}
      <div className="space-y-3">
        {data.map((item, index) => (
          <div 
            key={index}
            className="flex items-center gap-4 cursor-pointer hover:bg-white/50 p-2 rounded transition-colors"
            onClick={() => setSelectedBar(selectedBar === index ? null : index)}
          >
            <span className="w-20 text-sm font-medium">{item.label}</span>
            <div className="flex-1 bg-gray-200 rounded-full h-4 relative overflow-hidden">
              <div 
                className={`h-full rounded-full transition-all duration-500 ${
                  selectedBar === index ? 'bg-indigo-600' : 'bg-blue-500'
                }`}
                style={{ width: `${(item.value / maxValue) * 100}%` }}
              />
            </div>
            <span className="w-12 text-sm text-gray-600">{item.value}</span>
          </div>
        ))}
      </div>
      {selectedBar !== null && (
        <div className="mt-4 p-3 bg-indigo-100 rounded-lg">
          <strong>{data[selectedBar].label}:</strong> {data[selectedBar].value}
        </div>
      )}
    </div>
  );
}
