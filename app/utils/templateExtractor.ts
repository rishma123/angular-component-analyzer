export function extractTemplate(code: string): string | null {
  // Extract template from @Component decorator
  const templateMatch = code.match(/template:\s*`([^`]*)`/s);
  if (templateMatch) {
    return templateMatch[1].trim();
  }

  // Extract templateUrl reference (we can't fetch it, but return null to skip preview)
  const templateUrlMatch = code.match(/templateUrl:\s*['"]([^'"]+)['"]/);
  if (templateUrlMatch) {
    // Return null instead of comment - component uses external template
    return null;
  }

  return null;
}

export function extractStyles(code: string): string | null {
  // Extract styles from @Component decorator
  const stylesMatch = code.match(/styles:\s*\[`([^`]*)`\]/s);
  if (stylesMatch) {
    return stylesMatch[1].trim();
  }

  // Extract single style string
  const styleMatch = code.match(/styles:\s*`([^`]*)`/s);
  if (styleMatch) {
    return styleMatch[1].trim();
  }

  return null;
}

export function extractSelector(code: string): string | null {
  const selectorMatch = code.match(/selector:\s*['"]([^'"]+)['"]/);
  return selectorMatch ? selectorMatch[1] : null;
}

export function parseAngularTemplate(template: string, inputs: Record<string, any>): string {
  let html = template;

  // Replace Angular interpolation {{ value }} with actual values
  html = html.replace(/\{\{\s*([^}]+)\s*\}\}/g, (match, expr) => {
    const trimmed = expr.trim();
    // Handle simple property access
    if (inputs[trimmed] !== undefined) {
      return String(inputs[trimmed]);
    }
    // Handle property || fallback
    const orMatch = trimmed.match(/(\w+)\s*\|\|\s*(\w+)/);
    if (orMatch) {
      const [, prop1, prop2] = orMatch;
      return String(inputs[prop1] || inputs[prop2] || '');
    }
    return match;
  });

  // Collect all inline styles first
  const inlineStyles: Record<string, string> = {};

  // Replace [style.xxx] bindings
  html = html.replace(/\[style\.([^\]]+)\]="([^"]+)"/g, (match, styleProp, expr) => {
    // Simple ternary evaluation
    const ternaryMatch = expr.match(/(\w+)\s*===\s*'([^']+)'\s*\?\s*'([^']+)'\s*:\s*(.+)/);
    if (ternaryMatch) {
      const [, varName, checkValue, trueValue, falseExpr] = ternaryMatch;

      // Handle nested ternaries
      const nested = falseExpr.match(/(\w+)\s*===\s*'([^']+)'\s*\?\s*'([^']+)'\s*:\s*'([^']+)'/);
      if (nested) {
        const [, var2, check2, true2, false2] = nested;
        let result;
        if (inputs[varName] === checkValue) {
          result = trueValue;
        } else if (inputs[var2] === check2) {
          result = true2;
        } else {
          result = false2;
        }
        inlineStyles[styleProp] = result;
        return ''; // Remove from HTML, will add consolidated style later
      }

      const result = inputs[varName] === checkValue ? trueValue : falseExpr.replace(/'/g, '');
      inlineStyles[styleProp] = result;
      return '';
    }

    // Simple string value
    const simpleValue = expr.replace(/'/g, '');
    inlineStyles[styleProp] = simpleValue;
    return '';
  });

  // Consolidate all inline styles into a single style attribute
  if (Object.keys(inlineStyles).length > 0) {
    const styleString = Object.entries(inlineStyles)
      .map(([prop, value]) => `${prop}: ${value}`)
      .join('; ');

    // Add or merge with existing style attribute
    html = html.replace(/(<[^>]+?)(\s*>)/, `$1 style="${styleString}"$2`);
  }

  // Replace [class] bindings
  html = html.replace(/\[class\]="([^"]+)"/g, (match, expr) => {
    const evaluated = expr.replace(/(\w+)/g, (m: string) => {
      return inputs[m] !== undefined ? `'${inputs[m]}'` : m;
    });
    try {
      const result = evaluated.replace(/'/g, '');
      return `class="${result}"`;
    } catch {
      return match;
    }
  });

  // Replace [attr] bindings
  html = html.replace(/\[([^\]]+)\]="'([^']+)'"/g, '$1="$2"');

  // Remove Angular event bindings like (click)="..."
  html = html.replace(/\(click\)="[^"]*"/g, '');
  html = html.replace(/\(change\)="[^"]*"/g, '');
  html = html.replace(/\([^)]+\)="[^"]*"/g, '');

  return html;
}
