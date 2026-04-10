"use client";

import { useState } from "react";
import { analyzeComponent } from "./utils/componentAnalyzer";

export default function Home() {
  const [code, setCode] = useState("");
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);

  const exampleCode = `import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-status-badge',
  standalone: true,
  template: \`
    <span
      class="badge"
      [style.background-color]="status === 'active' ? '#22c55e' : status === 'pending' ? '#eab308' : '#9ca3af'"
      [style.color]="'white'"
      [style.padding]="'8px 16px'"
      [style.border-radius]="'9999px'"
      [style.font-weight]="'600'"
      [style.cursor]="clickable ? 'pointer' : 'default'"
      (click)="onBadgeClick()">
      {{ label || status }}
    </span>
  \`,
  styles: [\`
    .badge {
      display: inline-block;
      font-size: 14px;
      transition: transform 0.2s;
    }
    .badge:hover {
      transform: scale(1.05);
    }
  \`]
})
export class StatusBadgeComponent {
  @Input() status: 'active' | 'inactive' | 'pending' = 'active';
  @Input() label: string = '';
  @Input() clickable: boolean = true;

  onBadgeClick() {
    if (this.clickable) {
      console.log('Badge clicked with status:', this.status);
    }
  }
}`;

  async function handleGenerate() {
    if (!code.trim()) {
      setError("Please paste your Angular component code first!");
      return;
    }
    if (!code.includes("@Component")) {
      setError("This doesn't look like an Angular component. Make sure it includes @Component decorator.");
      return;
    }
    if (!code.includes("export class")) {
      setError("Missing 'export class' — please paste the full component including the class definition.");
      return;
    }

    setLoading(true);
    setError("");
    setResult(null);

    try {
      const response = await fetch("/api/document", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code }),
      });

      if (!response.ok) throw new Error(`Server error: ${response.status}`);

      const data = await response.json();
      if (data.error) throw new Error(data.error);

      let parsed;
      try {
        parsed = JSON.parse(data.result);
      } catch {
        // Try to extract JSON if wrapped in backticks
        const cleaned = data.result
          .replace(/```json/g, "")
          .replace(/```/g, "")
          .trim();
        parsed = JSON.parse(cleaned);
      }
      setResult(parsed);

    } catch (err: any) {
      if (err.message?.includes("JSON")) {
        setError("The AI response was not valid. Please try again — this sometimes happens with complex components.");
      } else if (err.message?.includes("500")) {
        setError("Server error. Please restart the app and try again.");
      } else if (err.message?.includes("fetch")) {
        setError("Network error. Please check your internet connection.");
      } else if (err.message?.includes("401")) {
        setError("API key error. Please check your Groq API key in .env.local.");
      } else {
        setError(err.message || "Something went wrong. Please try again!");
      }
    } finally {
      setLoading(false);
    }
  }

  function handleCopy() {
    if (!result) return;
    const analysis = analyzeComponent(code, result);
    const text = `---
title: ${result.componentName}
description: ${result.description}
---

# ${result.componentName}

${result.description}

${result.componentStructure?.length > 0 ? `## Component Structure

${result.componentStructure.map((item: string) => `- ${item}`).join('\n')}
` : ''}
${result.behaviorInsights?.length > 0 ? `## Behavior Insights

${result.behaviorInsights.map((insight: string) => `- ${insight}`).join('\n')}
` : ''}
${result.analysisConfidence ? `## Analysis Confidence: ${result.analysisConfidence.level}

${result.analysisConfidence.reasons?.map((reason: string) => `- ${reason}`).join('\n')}

` : ''}
## Component Health Score: ${analysis.score}/10

### Score Breakdown

${analysis.breakdown?.map((item: any) => {
  const icon = item.status === 'pass' ? '✓' : item.status === 'warning' ? '⚠' : 'ℹ';
  return `${icon} **${item.category}**: ${item.message}`;
}).join('\n')}

${analysis.suggestions?.length > 0 ? `### Suggestions for Improvement

${analysis.suggestions.map((s: any) => `- **${s.title}** (${s.impact} impact)\n  ${s.description}`).join('\n\n')}
` : ''}
## Inputs

${result.inputs?.length > 0 ? result.inputs.map((i: any) => `- **${i.name}** (\`${i.type}\`)${i.required ? ' *required*' : ''} — default: \`${i.default || "none"}\`${i.isSignal ? ' ⚡ *signal*' : ''}\n  ${i.description || ''}${i.confidence ? ` [confidence: ${i.confidence}]` : ''}`).join('\n') : '*No inputs defined*'}

## Outputs

${result.outputs?.length > 0 ? result.outputs.map((o: any) => `- **${o.name}** (\`${o.type}\`)${o.isSignal ? ' ⚡ *signal*' : ''}\n  ${o.description || ''}${o.confidence ? ` [confidence: ${o.confidence}]` : ''}`).join('\n') : '*No outputs defined*'}

## Usage Example

\`\`\`html
${result.usageExample}
\`\`\`

${result.alternativeExamples?.length > 0 ? `## More Examples

${result.alternativeExamples.map((ex: any) => `### ${ex.title}

\`\`\`html
${ex.code}
\`\`\`
`).join('\n')}` : ''}
${result.notes ? `## Notes

${result.notes}` : ''}

---
*Generated with [Angular Component Analyzer](https://github.com/rishma123)*
`.trim();

    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <main className="min-h-screen bg-gray-50 flex flex-col">

      {/* Header */}
      <div className="bg-[#0f172a] px-8 py-4 flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-white">Angular Component <span className="text-blue-400">Analyzer</span></h1>
          <p className="text-xs text-gray-400">Analyze, document, and improve Angular components with AI-driven insights</p>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-xs bg-blue-900 text-blue-300 px-3 py-1 rounded-full border border-blue-800">
            Powered by Groq AI
          </span>
          <a href="https://github.com/rishma123" target="_blank" className="text-xs text-gray-400 hover:text-white transition-colors">
            GitHub →
          </a>
        </div>
      </div>

      {/* Tagline */}
      <div className="bg-white border-b border-gray-100 px-8 py-3 flex items-center justify-between">
        <p className="text-sm text-gray-500">
          Paste any Angular component → get instant developer-ready documentation with Signals support and missing EventEmitter suggestions
        </p>
        <button
          onClick={() => setCode(exampleCode)}
          className="text-xs text-blue-600 border border-blue-200 px-3 py-1.5 rounded-lg hover:bg-blue-50 transition-colors whitespace-nowrap ml-4"
        >
          Try an example
        </button>
      </div>

      {/* Main */}
      <div className="flex-1 grid grid-cols-2 gap-0">

        {/* Left — Input */}
        <div className="flex flex-col border-r border-gray-200 p-6 gap-4">
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium text-gray-700">Your Angular component</label>
            {code && (
              <button
                onClick={() => { setCode(""); setResult(null); setError(""); }}
                className="text-xs text-gray-400 hover:text-red-500 transition-colors"
              >
                Clear ✕
              </button>
            )}
          </div>
          <textarea
            className="flex-1 min-h-[500px] p-4 font-mono text-sm bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-50 resize-none"
            placeholder={`@Component({
  selector: 'app-example',
  template: \`...\`
})
export class ExampleComponent {
  @Input() value: string;
  @Output() onChange = new EventEmitter();
}`}
            value={code}
            onChange={(e) => setCode(e.target.value)}
          />
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-start gap-3">
              <span className="text-red-500 text-lg">⚠️</span>
              <div>
                <p className="text-red-700 text-sm font-medium">Something went wrong</p>
                <p className="text-red-500 text-xs mt-1">{error}</p>
              </div>
            </div>
          )}
          <button
            onClick={handleGenerate}
            disabled={loading}
            className="w-full py-3 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Analysing component..." : "Generate Documentation"}
          </button>
        </div>

        {/* Right — Output */}
        <div className="flex flex-col p-6 gap-4">
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium text-gray-700">Generated documentation</label>
            {result && (
              <div className="flex items-center gap-2">
                <button
                  onClick={handleCopy}
                  className="text-xs text-blue-600 border border-blue-200 px-3 py-1 rounded-lg hover:bg-blue-50 transition-colors"
                >
                  {copied ? "✓ Copied!" : "Copy"}
                </button>
<button
                  onClick={() => {
                    const analysis = analyzeComponent(code, result);
                    const mdContent = `---
title: ${result.componentName}
description: ${result.description}
---

# ${result.componentName}

${result.description}

${result.componentStructure?.length > 0 ? `## Component Structure

${result.componentStructure.map((item: string) => `- ${item}`).join('\n')}
` : ''}
${result.behaviorInsights?.length > 0 ? `## Behavior Insights

${result.behaviorInsights.map((insight: string) => `- ${insight}`).join('\n')}
` : ''}
${result.analysisConfidence ? `## Analysis Confidence: ${result.analysisConfidence.level}

${result.analysisConfidence.reasons?.map((reason: string) => `- ${reason}`).join('\n')}

` : ''}
## Component Health Score: ${analysis.score}/10

### Score Breakdown

${analysis.breakdown?.map((item: any) => {
  const icon = item.status === 'pass' ? '✓' : item.status === 'warning' ? '⚠' : 'ℹ';
  return `${icon} **${item.category}**: ${item.message}`;
}).join('\n')}

${analysis.suggestions?.length > 0 ? `### Suggestions for Improvement

${analysis.suggestions.map((s: any) => `- **${s.title}** (${s.impact} impact)\n  ${s.description}`).join('\n\n')}
` : ''}
## Inputs

${result.inputs?.length > 0 ? result.inputs.map((i: any) => `- **${i.name}** (\`${i.type}\`)${i.required ? ' *required*' : ''} — default: \`${i.default || "none"}\`${i.isSignal ? ' ⚡ *signal*' : ''}\n  ${i.description || ''}${i.confidence ? ` [confidence: ${i.confidence}]` : ''}`).join('\n') : '*No inputs defined*'}

## Outputs

${result.outputs?.length > 0 ? result.outputs.map((o: any) => `- **${o.name}** (\`${o.type}\`)${o.isSignal ? ' ⚡ *signal*' : ''}\n  ${o.description || ''}${o.confidence ? ` [confidence: ${o.confidence}]` : ''}`).join('\n') : '*No outputs defined*'}

## Usage Example

\`\`\`html
${result.usageExample}
\`\`\`

${result.alternativeExamples?.length > 0 ? `## More Examples

${result.alternativeExamples.map((ex: any) => `### ${ex.title}

\`\`\`html
${ex.code}
\`\`\`
`).join('\n')}` : ''}
${result.notes ? `## Notes

${result.notes}` : ''}

---
*Generated with [Angular Component Analyzer](https://github.com/rishma123)*
`;
                    const blob = new Blob([mdContent], { type: 'text/markdown' });
                    const url = URL.createObjectURL(blob);
                    const a = document.createElement('a');
                    a.href = url;
                    a.download = `${result.componentName.replace(/Component$/, '')}-docs.mdx`;
                    a.click();
                    URL.revokeObjectURL(url);
                  }}
                  className="text-xs text-green-600 border border-green-200 px-3 py-1 rounded-lg hover:bg-green-50 transition-colors font-medium"
                >
                  Download MDX
                </button>
              </div>
            )}
          </div>

          {!result && !loading && (
            <div className="flex-1 min-h-[500px] bg-gray-50 border border-dashed border-gray-200 rounded-xl flex flex-col items-center justify-center text-gray-400">
              <p className="text-sm">Documentation will appear here</p>
              <p className="text-xs mt-1">Paste a component and click Generate</p>
            </div>
          )}

          {loading && (
            <div className="flex-1 min-h-[500px] bg-gray-50 border border-gray-200 rounded-xl flex flex-col items-center justify-center text-blue-500">
              <div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mb-3"></div>
              <p className="text-sm">Analysing your component...</p>
            </div>
          )}

          {result && (() => {
            // Prefer AI-generated health score, fallback to local analysis
            const localAnalysis = analyzeComponent(code, result);
            const analysis = result.healthScore ? {
              score: result.healthScore.score,
              breakdown: result.healthScore.breakdown.map((item: string | { category: string; status: string; message: string }) =>
                typeof item === 'string'
                  ? { category: '', status: 'info', message: item }
                  : item
              ),
              suggestions: result.suggestions || localAnalysis.suggestions,
              strengths: localAnalysis.strengths
            } : localAnalysis;

            const scoreColor = analysis.score >= 8 ? 'text-green-600' : analysis.score >= 5 ? 'text-yellow-600' : 'text-red-600';
            const scoreBg = analysis.score >= 8 ? 'bg-green-50 border-green-200' : analysis.score >= 5 ? 'bg-yellow-50 border-yellow-200' : 'bg-red-50 border-red-200';

            return (
            <div className="space-y-3 overflow-y-auto max-h-[calc(100vh-200px)] pr-1">

              {/* Description */}
              <div className="bg-white border border-gray-200 rounded-xl p-4">
                <h3 className="font-mono text-blue-600 font-medium mb-2 text-sm">{result.componentName}</h3>
                <p className="text-sm text-gray-600 leading-relaxed">{result.description}</p>
              </div>

              {/* Component Structure */}
              {result.componentStructure && result.componentStructure.length > 0 && (
                <div className="bg-purple-50 border border-purple-200 rounded-xl p-4">
                  <h3 className="text-xs font-semibold text-purple-700 uppercase tracking-wide mb-3 flex items-center gap-2">
                    <span>🏗️</span> Component Structure
                  </h3>
                  <div className="space-y-2">
                    {result.componentStructure.map((item: string, i: number) => (
                      <p key={i} className="text-xs text-purple-900 leading-relaxed flex items-start gap-2">
                        <span className="text-purple-400 mt-0.5">•</span>
                        <span className="flex-1">{item}</span>
                      </p>
                    ))}
                  </div>
                </div>
              )}

              {/* Behavior Insights */}
              {result.behaviorInsights && result.behaviorInsights.length > 0 && (
                <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                  <h3 className="text-xs font-semibold text-blue-700 uppercase tracking-wide mb-3 flex items-center gap-2">
                    <span>💡</span> Behavior Insights
                  </h3>
                  <div className="space-y-2">
                    {result.behaviorInsights.map((insight: string, i: number) => (
                      <p key={i} className="text-xs text-blue-900 leading-relaxed flex items-start gap-2">
                        <span className="text-blue-400 mt-0.5">•</span>
                        <span className="flex-1">{insight}</span>
                      </p>
                    ))}
                  </div>
                </div>
              )}

              {/* Component Health Score */}
              <div className={`border rounded-xl p-5 ${scoreBg}`}>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xs font-semibold text-gray-700 uppercase tracking-wide flex items-center gap-2">
                    <span>📊</span> Component Health Score
                  </h3>
                  <div className="flex items-center gap-2">
                    <span className={`text-3xl font-bold ${scoreColor}`}>{analysis.score}</span>
                    <span className="text-gray-400 text-sm">/10</span>
                  </div>
                </div>

                {/* Score Breakdown */}
                {analysis.breakdown && analysis.breakdown.length > 0 && (
                  <div className="space-y-1.5 mb-3">
                    {analysis.breakdown.map((item: any, i: number) => (
                      <div key={i} className="flex items-start gap-2 text-xs">
                        <span className={`mt-0.5 ${
                          item.status === 'pass' ? 'text-green-500' :
                          item.status === 'warning' ? 'text-yellow-500' :
                          'text-gray-400'
                        }`}>
                          {item.status === 'pass' ? '✓' : item.status === 'warning' ? '⚠' : 'ℹ'}
                        </span>
                        <div className="flex-1">
                          <span className={`font-medium ${
                            item.status === 'pass' ? 'text-green-700' :
                            item.status === 'warning' ? 'text-yellow-700' :
                            'text-gray-500'
                          }`}>
                            {item.category}:
                          </span>
                          <span className="text-gray-600 ml-1">{item.message}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Inputs */}
              {result.inputs?.length > 0 && (
                <div className="bg-white border border-gray-200 rounded-xl p-5">
                  <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-4">Inputs</h3>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm border-separate border-spacing-y-2">
                      <thead>
                        <tr className="text-gray-400 text-xs text-left">
                          <th className="pb-3 font-medium pr-4">Name</th>
                          <th className="pb-3 font-medium pr-4">Type</th>
                          <th className="pb-3 font-medium pr-4">Default</th>
                          <th className="pb-3 font-medium">Description</th>
                        </tr>
                      </thead>
                      <tbody>
                        {result.inputs.map((input: any, i: number) => (
                          <tr key={i} className="border-t border-gray-100">
                            <td className="py-3 pr-4 font-mono text-blue-600 text-xs font-medium whitespace-nowrap">
                              {input.name}
                              {input.isSignal && <span className="ml-1 text-purple-500">⚡</span>}
                              {input.required && <span className="ml-1 text-red-400">*</span>}
                            </td>
                            <td className="py-3 pr-4 text-gray-600 text-xs whitespace-nowrap">{input.type}</td>
                            <td className="py-3 pr-4 text-gray-400 text-xs whitespace-nowrap">{input.default || "—"}</td>
                            <td className="py-3 text-gray-600 text-xs leading-relaxed">
                              {input.description}
                              {input.confidence && (
                                <span className={`ml-2 text-[10px] px-1.5 py-0.5 rounded ${
                                  input.confidence === 'high' ? 'bg-green-100 text-green-600' :
                                  input.confidence === 'medium' ? 'bg-yellow-100 text-yellow-600' :
                                  'bg-gray-100 text-gray-500'
                                }`}>
                                  {input.confidence}
                                </span>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  <p className="text-xs text-gray-400 mt-3 pt-3 border-t border-gray-100">⚡ Signal input &nbsp;|&nbsp; * Required</p>
                </div>
              )}

              {/* Outputs */}
              {result.outputs?.length > 0 && (
                <div className="bg-white border border-gray-200 rounded-xl p-5">
                  <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-4">Outputs</h3>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm border-separate border-spacing-y-2">
                      <thead>
                        <tr className="text-gray-400 text-xs text-left">
                          <th className="pb-3 font-medium pr-4">Name</th>
                          <th className="pb-3 font-medium pr-4">Type</th>
                          <th className="pb-3 font-medium">Description</th>
                        </tr>
                      </thead>
                      <tbody>
                        {result.outputs.map((output: any, i: number) => (
                          <tr key={i} className="border-t border-gray-100">
                            <td className="py-3 pr-4 font-mono text-green-600 text-xs font-medium whitespace-nowrap">
                              {output.name}
                              {output.isSignal && <span className="ml-1 text-purple-500">⚡</span>}
                            </td>
                            <td className="py-3 pr-4 text-gray-600 text-xs whitespace-nowrap">{output.type}</td>
                            <td className="py-3 text-gray-600 text-xs leading-relaxed">
                              {output.description}
                              {output.confidence && (
                                <span className={`ml-2 text-[10px] px-1.5 py-0.5 rounded ${
                                  output.confidence === 'high' ? 'bg-green-100 text-green-600' :
                                  output.confidence === 'medium' ? 'bg-yellow-100 text-yellow-600' :
                                  'bg-gray-100 text-gray-500'
                                }`}>
                                  {output.confidence}
                                </span>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* Usage Example */}
              {result.usageExample && (
                <div className="bg-white border border-gray-200 rounded-xl p-5">
                  <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-4">Basic Usage</h3>
                  <pre className="bg-[#0f172a] text-green-400 text-xs p-4 rounded-lg overflow-x-auto whitespace-pre-wrap leading-relaxed">
                    {result.usageExample}
                  </pre>
                </div>
              )}

              {/* Alternative Examples */}
              {result.alternativeExamples?.length > 0 && (
                <div className="bg-white border border-gray-200 rounded-xl p-5">
                  <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-4">More Examples</h3>
                  <div className="space-y-6">
                    {result.alternativeExamples.map((ex: any, i: number) => (
                      <div key={i} className="border-t border-gray-100 pt-4 first:border-t-0 first:pt-0">
                        <p className="text-xs text-gray-700 mb-3 font-semibold">{ex.title}</p>
                        <pre className="bg-[#0f172a] text-green-400 text-xs p-4 rounded-lg overflow-x-auto whitespace-pre-wrap leading-relaxed">
                          {ex.code}
                        </pre>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Signals Example */}
              {result.signalsExample && (
                <div className="bg-purple-50 border border-purple-100 rounded-xl p-4">
                  <h3 className="text-xs font-semibold text-purple-700 uppercase tracking-wide mb-2">⚡ Angular Signals Example</h3>
                  <pre className="text-purple-700 text-xs overflow-x-auto whitespace-pre-wrap">
                    {result.signalsExample}
                  </pre>
                </div>
              )}

              {/* How to Improve This Component */}
              {analysis.suggestions.length > 0 && (
                <div className="bg-gradient-to-br from-indigo-50 to-blue-50 border border-indigo-200 rounded-xl p-5">
                  <h3 className="text-xs font-semibold text-indigo-700 uppercase tracking-wide mb-3 flex items-center gap-2">
                    <span>💡</span> How to Improve This Component
                  </h3>
                  <div className="space-y-3">
                    {analysis.suggestions.map((suggestion: any, i: number) => {
                      const impactColors: Record<string, string> = {
                        high: 'border-red-200 bg-red-50',
                        medium: 'border-yellow-200 bg-yellow-50',
                        low: 'border-blue-200 bg-blue-50',
                      };
                      const impactBadges: Record<string, string> = {
                        high: 'bg-red-100 text-red-700',
                        medium: 'bg-yellow-100 text-yellow-700',
                        low: 'bg-blue-100 text-blue-700',
                      };

                      return (
                        <div key={i} className={`bg-white rounded-lg p-3 border ${impactColors[suggestion.impact]}`}>
                          <div className="flex items-start justify-between gap-2 mb-1">
                            <p className="text-xs font-medium text-indigo-900">{suggestion.title}</p>
                            <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium uppercase ${impactBadges[suggestion.impact]}`}>
                              {suggestion.impact}
                            </span>
                          </div>
                          <p className="text-xs text-gray-600">{suggestion.description}</p>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Analysis Confidence */}
              {result.analysisConfidence && (
                <div className={`border rounded-xl p-5 ${
                  result.analysisConfidence.level === 'High' ? 'bg-green-50 border-green-200' :
                  result.analysisConfidence.level === 'Medium' ? 'bg-yellow-50 border-yellow-200' :
                  'bg-orange-50 border-orange-200'
                }`}>
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-xs font-semibold text-gray-700 uppercase tracking-wide flex items-center gap-2">
                      <span>🎯</span> Analysis Confidence
                    </h3>
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      result.analysisConfidence.level === 'High' ? 'bg-green-100 text-green-700' :
                      result.analysisConfidence.level === 'Medium' ? 'bg-yellow-100 text-yellow-700' :
                      'bg-orange-100 text-orange-700'
                    }`}>
                      {result.analysisConfidence.level}
                    </span>
                  </div>
                  {result.analysisConfidence.reasons && result.analysisConfidence.reasons.length > 0 && (
                    <div className="space-y-1.5">
                      {result.analysisConfidence.reasons.map((reason: string, i: number) => (
                        <p key={i} className="text-xs text-gray-700 leading-relaxed flex items-start gap-2">
                          <span className={`mt-0.5 ${
                            result.analysisConfidence.level === 'High' ? 'text-green-500' :
                            result.analysisConfidence.level === 'Medium' ? 'text-yellow-500' :
                            'text-orange-500'
                          }`}>•</span>
                          <span className="flex-1">{reason}</span>
                        </p>
                      ))}
                    </div>
                  )}
                </div>
              )}

            </div>
            );
          })()}
        </div>
      </div>
    </main>
  );
}