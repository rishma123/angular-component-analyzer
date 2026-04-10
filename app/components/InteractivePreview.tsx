"use client";

import { useState, useEffect } from "react";
import { parseAngularTemplate } from "../utils/templateExtractor";

interface InteractivePreviewProps {
  componentName: string;
  inputs: Array<{
    name: string;
    type: string;
    default: string;
  }>;
  template?: string;
  styles?: string;
}

export default function InteractivePreview({ componentName, inputs, template, styles }: InteractivePreviewProps) {
  const [values, setValues] = useState<Record<string, any>>({});

  // Initialize with default values
  useEffect(() => {
    const defaults: Record<string, any> = {};
    inputs.forEach((input) => {
      defaults[input.name] = input.default || getDefaultForType(input.type);
    });
    setValues(defaults);
  }, [inputs]);

  function getDefaultForType(type: string): any {
    if (type.includes("boolean")) return false;
    if (type.includes("number")) return 0;
    if (type.includes("[]") || type.includes("Array")) return "[]";
    if (type.includes("string")) return "";
    return "";
  }

  function renderControl(input: any) {
    const value = values[input.name] ?? input.default;

    // Boolean input
    if (input.type.includes("boolean")) {
      return (
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={value === "true" || value === true}
            onChange={(e) =>
              setValues({ ...values, [input.name]: e.target.checked })
            }
            className="w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
          />
          <span className="text-xs text-gray-600">
            {value === "true" || value === true ? "true" : "false"}
          </span>
        </label>
      );
    }

    // Union type (like 'active' | 'inactive' | 'pending')
    if (input.type.includes("|")) {
      const options = input.type
        .split("|")
        .map((opt: string) => opt.trim().replace(/'/g, ""));
      return (
        <select
          value={value}
          onChange={(e) =>
            setValues({ ...values, [input.name]: e.target.value })
          }
          className="px-3 py-1.5 text-xs border border-gray-200 rounded-lg focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-50 bg-white"
        >
          {options.map((opt: string) => (
            <option key={opt} value={opt}>
              {opt}
            </option>
          ))}
        </select>
      );
    }

    // Number input
    if (input.type.includes("number")) {
      return (
        <input
          type="number"
          value={value}
          onChange={(e) =>
            setValues({ ...values, [input.name]: e.target.value })
          }
          className="px-3 py-1.5 text-xs border border-gray-200 rounded-lg focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-50 w-full"
        />
      );
    }

    // String input (default)
    return (
      <input
        type="text"
        value={value}
        onChange={(e) =>
          setValues({ ...values, [input.name]: e.target.value })
        }
        placeholder={input.default || ""}
        className="px-3 py-1.5 text-xs border border-gray-200 rounded-lg focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-50 w-full"
      />
    );
  }

  function renderPreview() {
    // If we have the actual Angular template, render it
    if (template) {
      const parsedHtml = parseAngularTemplate(template, values);

      return (
        <div className="flex flex-col items-center justify-center p-10 bg-white rounded-lg min-h-[180px]">
          <style>{styles || ''}</style>
          <div
            dangerouslySetInnerHTML={{ __html: parsedHtml }}
            className="angular-component-preview"
          />
          <div className="text-xs text-gray-500 space-y-1 text-center mt-6 pt-4 border-t border-gray-200 w-full">
            <p className="font-medium text-gray-700 mb-2">Current Values:</p>
            {Object.entries(values).map(([key, val]) => {
              const displayValue = Array.isArray(val)
                ? `[${val.length} items]`
                : typeof val === 'object' && val !== null
                ? JSON.stringify(val)
                : String(val);

              return (
                <p key={key}>
                  <span className="font-mono text-blue-600">{key}</span>:
                  <span className="font-mono font-medium text-gray-700 ml-2">{displayValue}</span>
                </p>
              );
            })}
          </div>
        </div>
      );
    }

    // No template available (uses templateUrl)
    return (
      <div className="flex flex-col items-center justify-center p-10 bg-gray-50 border-2 border-dashed border-gray-300 rounded-lg min-h-[180px]">
        <div className="text-center">
          <svg className="w-12 h-12 mx-auto mb-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <p className="text-sm font-medium text-gray-700 mb-1">Template uses external file</p>
          <p className="text-xs text-gray-500 max-w-xs">
            This component uses <code className="bg-gray-200 px-1 rounded">templateUrl</code> instead of an inline template.
            Visual preview is not available, but you can test the inputs below.
          </p>
        </div>
        <div className="text-xs text-gray-500 space-y-1 text-center mt-6 pt-4 border-t border-gray-200 w-full">
          <p className="font-medium text-gray-700 mb-2">Current Input Values:</p>
          {Object.entries(values).map(([key, val]) => {
            const displayValue = Array.isArray(val)
              ? `[${val.length} items]`
              : typeof val === 'object' && val !== null
              ? JSON.stringify(val)
              : String(val);

            return (
              <p key={key}>
                <span className="font-mono text-blue-600">{key}</span>:
                <span className="font-mono font-medium text-gray-700 ml-2">{displayValue}</span>
              </p>
            );
          })}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-blue-50 to-purple-50 border border-blue-200 rounded-xl p-5">
      <h3 className="text-xs font-semibold text-blue-700 uppercase tracking-wide mb-4 flex items-center gap-2">
        <span>🎨</span> Interactive Preview
      </h3>

      {/* Controls */}
      <div className="space-y-3 mb-4">
        {inputs.map((input, i) => (
          <div key={i} className="bg-white rounded-lg p-3 border border-gray-200">
            <label className="flex items-center justify-between gap-3">
              <span className="text-xs font-mono text-blue-600 font-medium">
                {input.name}
              </span>
              <div className="flex-1 max-w-[200px]">{renderControl(input)}</div>
            </label>
          </div>
        ))}
      </div>

      {/* Preview */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <div className="bg-gray-100 px-3 py-2 border-b border-gray-200">
          <p className="text-xs font-medium text-gray-600">Preview</p>
        </div>
        {renderPreview()}
      </div>

      <p className="text-xs text-gray-500 mt-3 italic">
        💡 This is a visual mockup. Adjust the inputs above to see changes.
      </p>
    </div>
  );
}
