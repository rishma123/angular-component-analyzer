interface AnalysisResult {
  score: number;
  breakdown: Array<{
    category: string;
    status: 'pass' | 'warning' | 'info';
    message: string;
  }>;
  suggestions: Array<{
    title: string;
    description: string;
    impact: 'high' | 'medium' | 'low';
  }>;
  strengths: string[];
}

export function analyzeComponent(code: string, result: any): AnalysisResult {
  let score = 5; // Start at 5 (baseline for having a working component)
  const suggestions = [];
  const strengths = [];
  const breakdown = [];

  // Basic component structure
  if (code.includes('@Component')) {
    score += 1;
    strengths.push('Valid Angular component structure');
    breakdown.push({
      category: 'Component Structure',
      status: 'pass' as const,
      message: 'Valid @Component decorator found',
    });
  }

  // Has inputs
  if (result.inputs?.length > 0) {
    score += 1;
    strengths.push(`Has ${result.inputs.length} input properties`);
    breakdown.push({
      category: 'Input Properties',
      status: 'pass' as const,
      message: `${result.inputs.length} @Input properties defined`,
    });
  } else {
    breakdown.push({
      category: 'Input Properties',
      status: 'info' as const,
      message: 'No @Input properties detected',
    });
  }

  // Check for EventEmitters
  const hasOutputs = result.outputs?.length > 0;
  if (hasOutputs) {
    score += 1;
    strengths.push('Has EventEmitter outputs for parent communication');
    breakdown.push({
      category: 'Output Events',
      status: 'pass' as const,
      message: `${result.outputs.length} @Output EventEmitters defined`,
    });
  } else {
    const hasClickHandler = code.includes('onClick') || code.includes('(click)');
    if (hasClickHandler) {
      breakdown.push({
        category: 'Output Events',
        status: 'warning' as const,
        message: 'Click handlers found but no @Output EventEmitters',
      });
      suggestions.push({
        title: 'Add EventEmitter for user interactions',
        description: 'Component handles click events but does not emit events to parent. Consider adding an @Output() EventEmitter to allow parent components to respond to user interactions.',
        impact: 'medium' as const,
      });
    } else {
      breakdown.push({
        category: 'Output Events',
        status: 'info' as const,
        message: 'No @Output EventEmitters detected',
      });
    }
  }

  // Check for explicit types
  const hasAnyType = code.includes(': any');
  if (!hasAnyType && result.inputs?.length > 0) {
    score += 1;
    strengths.push('Uses explicit TypeScript types');
    breakdown.push({
      category: 'Type Safety',
      status: 'pass' as const,
      message: 'Strong typing on all inputs',
    });
  } else if (hasAnyType) {
    score -= 0.5;
    breakdown.push({
      category: 'Type Safety',
      status: 'warning' as const,
      message: 'Uses "any" type which reduces type safety',
    });
    suggestions.push({
      title: 'Replace "any" with specific types',
      description: 'Using "any" reduces type safety and IDE support. Define proper TypeScript interfaces or use specific types for better documentation and autocomplete.',
      impact: 'low' as const,
    });
  } else {
    breakdown.push({
      category: 'Type Safety',
      status: 'info' as const,
      message: 'No inputs to evaluate for typing',
    });
  }

  // Check for default values
  const inputsWithDefaults = result.inputs?.filter((i: any) => i.default && i.default !== '—').length || 0;
  const totalInputs = result.inputs?.length || 0;
  if (totalInputs > 0 && inputsWithDefaults > 0) {
    score += 0.5;
    strengths.push(`${inputsWithDefaults} input(s) have default values`);
    breakdown.push({
      category: 'Default Values',
      status: 'pass' as const,
      message: `${inputsWithDefaults} of ${totalInputs} inputs have defaults`,
    });
  } else if (totalInputs > 0) {
    breakdown.push({
      category: 'Default Values',
      status: 'warning' as const,
      message: 'No default values provided for inputs',
    });
    suggestions.push({
      title: 'Add default values to inputs',
      description: 'Providing default values makes your component more flexible and prevents undefined behavior when inputs are not provided by parent components.',
      impact: 'low' as const,
    });
  }

  // Check for JSDoc comments
  const hasJSDoc = code.includes('/**') || code.includes('* @');
  if (hasJSDoc) {
    score += 1;
    strengths.push('Has JSDoc documentation comments');
    breakdown.push({
      category: 'Documentation',
      status: 'pass' as const,
      message: 'JSDoc comments found',
    });
  } else {
    breakdown.push({
      category: 'Documentation',
      status: 'warning' as const,
      message: 'No JSDoc comments detected',
    });
    suggestions.push({
      title: 'Add JSDoc documentation',
      description: 'Add JSDoc comments above @Input and @Output properties to improve IDE intellisense and help other developers understand how to use your component.',
      impact: 'medium' as const,
    });
  }

  // Check for Signals (Angular 16+) - bonus, not penalty
  const usesSignals = code.includes('signal(') || code.includes('input(') || code.includes('output(');
  if (usesSignals) {
    score += 1;
    strengths.push('Uses modern Angular Signals');
    breakdown.push({
      category: 'Modern Features',
      status: 'pass' as const,
      message: 'Uses Angular Signals API',
    });
  } else {
    breakdown.push({
      category: 'Modern Features',
      status: 'info' as const,
      message: 'Not using Signals (optional)',
    });
  }

  // Check for accessibility - bonus, not always required
  const hasAriaLabels = code.includes('aria-') || code.includes('role=');
  if (hasAriaLabels) {
    score += 0.5;
    strengths.push('Includes accessibility attributes');
    breakdown.push({
      category: 'Accessibility',
      status: 'pass' as const,
      message: 'ARIA attributes detected',
    });
  } else {
    breakdown.push({
      category: 'Accessibility',
      status: 'info' as const,
      message: 'No ARIA attributes detected',
    });
  }

  // Check for inline template vs templateUrl
  const hasInlineTemplate = code.includes('template:');
  if (hasInlineTemplate) {
    breakdown.push({
      category: 'Template',
      status: 'info' as const,
      message: 'Uses inline template (preview available)',
    });
  } else {
    breakdown.push({
      category: 'Template',
      status: 'info' as const,
      message: 'Uses templateUrl (external file)',
    });
  }

  // Cap score at 10
  score = Math.min(Math.round(score), 10);

  return { score, breakdown, suggestions, strengths };
}
