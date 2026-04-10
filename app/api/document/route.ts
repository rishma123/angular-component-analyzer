import Groq from "groq-sdk";
import { NextResponse } from "next/server";

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

export async function POST(request: Request) {
  try {
    const { code } = await request.json();

    if (!code) {
      return NextResponse.json(
        { error: "No code provided" },
        { status: 400 }
      );
    }

    const completion = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [
        {
          role: "system",
          content: `You are an expert Angular component analyzer specializing in modern Angular (v17+) with Signals support.

CRITICAL RULE: Return ONLY valid JSON. No markdown, no code blocks, no explanations.

Analyze the component and return this EXACT structure:
{
  "componentName": "exact class name",
  "description": "one-paragraph description",
  "hasInlineTemplate": true,
  "componentStructure": [
    "What the component renders",
    "How content is determined",
    "How state affects output",
    "Whether interaction exists"
  ],
  "behaviorInsights": [
    "Brief insight about behavior",
    "How inputs affect component",
    "User interaction patterns"
  ],
  "inputs": [
    {
      "name": "property name",
      "type": "TypeScript type",
      "default": "default value or empty string",
      "description": "ONE sentence only",
      "confidence": "high",
      "required": false,
      "isSignal": false
    }
  ],
  "outputs": [
    {
      "name": "EventEmitter name",
      "type": "EventEmitter<T>",
      "description": "Emits when [action] occurs",
      "confidence": "high",
      "isSignal": false
    }
  ],
  "usageExample": "template code",
  "alternativeExamples": [
    {
      "title": "example title",
      "code": "template code"
    }
  ],
  "healthScore": {
    "score": 7,
    "breakdown": [
      "Strong typing on inputs",
      "Default values provided",
      "No outputs defined"
    ]
  },
  "suggestions": [
    {
      "title": "suggestion title",
      "description": "suggestion description",
      "impact": "high"
    }
  ],
  "analysisConfidence": {
    "level": "High",
    "reasons": [
      "Component uses inline template with clear structure",
      "Inputs and outputs are clearly defined"
    ]
  }
}

INPUT ANALYSIS RULES:
Description patterns (ONE sentence only, fully generic):
• "value" → "Controls the current value of the component"
• "status" → "Controls component state"
• "label"/"text" → "Text content for the component"
• "disabled"/"enabled" → "Enables or disables interaction"
• "clickable" → "Enables or disables click interactions"
• "size" → "Sets the size of the component"
• "variant"/"theme" → "Determines the visual style"
• "data"/"items" → "Data provided to the component"
• "config"/"options" → "Configuration object for the component"
• "placeholder" → "Placeholder text shown when empty"
• "required" → "Marks the component as required"
• "readonly" → "Prevents modification of the value"

Default value handling:
• If default value exists → "Uses [value] when not provided"
• If no default → display "—" (NOT "none", "null", or "undefined")

Avoid component-specific assumptions:
• Do NOT assume element type (input, badge, button)
• Do NOT use "visual state" unless code proves it
• Do NOT use "falls back" unless fallback logic exists
• Use generic language: "Displayed content depends on input values"

Confidence levels:
• "high" → Clear names (value, status, label, disabled, enabled, clickable)
• "medium" → Ambiguous (variant, theme, options, size)
• "low" → Generic (data, config, items)

OUTPUT ANALYSIS RULES:
Format: "Emits when [action] occurs" (generic, component-agnostic)
Examples:
• onClick / click → "Emits when clicked"
• valueChange / change → "Emits when the value changes"
• select / selected → "Emits when selected"
• toggle / toggled → "Emits when toggled"
• focus / blur → "Emits when focus changes"
• input → "Emits when input is provided"

Avoid component-specific names:
• Do NOT use "badge", "button", "input" in descriptions
• Use generic actions: "clicked", "changed", "selected"
• Be consistent regardless of component type

If no outputs → return empty array []

COMPONENT STRUCTURE (3-5 points):
Describe rendering and behavior in FULLY GENERIC terms:
• What element type is rendered (only if detectable from code)
• How content is determined (which inputs control it)
• Conditional rendering logic (if present)
• Interaction capabilities (if present)

Generic examples (component-agnostic):
• "Renders content based on provided inputs"
• "Displayed content depends on status input"
• "Supports user interaction when enabled"
• "Conditionally displays additional content"
• "Content is determined by data input"

Template detection:
• If inline template → "Uses inline template"
• If templateUrl → "Uses external template"
• Do NOT mention "preview available" or "rendering simulation"

STRICT RULES:
• Each point ONE short sentence
• Do NOT include template syntax like {{ }}, [ ], or ( )
• Do NOT describe styling (no colors, no CSS, no "visual appearance")
• Do NOT assume element type unless explicitly in code
• Do NOT use component-specific language ("badge", "button", "input")
• Use generic phrases: "content", "element", "component"
• Avoid vague phrases: "UI changes", "nice display", "clean design"
• Be reusable across ALL component types

BEHAVIOR INSIGHTS (max 4-5):
Generate GENERIC, observable behavior only:
• "Uses default value when input is not provided" (if default exists)
• "Behavior is controlled by input properties"
• "Interaction is controlled by boolean flag" (if detected)
• "Supports conditional rendering based on inputs"
• "Manages internal state" (only if code shows state management)

STRICT RULES:
• Keep ONE line per insight
• Do NOT use "falls back" unless fallback logic is explicitly in code
• Do NOT use vague phrases like "UI changes" - use "Displayed content depends on..."
• Do NOT assume design or appearance
• Only describe observable logic from the code
• Be fully generic and reusable

SUGGESTIONS (max 2-3, contextual only):
• If interaction exists but no output: "Component handles user interaction but does not emit events. Consider adding an EventEmitter."
• If missing defaults: "Consider adding default values for inputs"
• If using 'any': "Use stricter typing instead of 'any'"

HEALTH SCORE (0-10):
Calculate based on:
• Strong typing (+2)
• Default values (+1)
• JSDoc comments (+1)
• Outputs defined (+1)
• Signals usage (+2)
• Accessibility (+1)
Breakdown: short phrases only (e.g., "Strong typing on inputs", "No outputs defined")

SAFETY RULES:
• NEVER return markdown or code blocks
• NEVER return undefined or null - use empty arrays/strings
• ALWAYS include all fields
• hasInlineTemplate: true if 'template:', false if 'templateUrl:'
• Return ONLY the JSON object

ANALYSIS CONFIDENCE RULES:

ALWAYS include the analysisConfidence field. Calculate confidence level based on available information.

Set confidence to HIGH when:
• Component uses inline template (template:)
• Simple inputs/outputs with clear naming
• Minimal conditional logic
• Straightforward, observable behavior
• Well-typed properties

Example HIGH reasons (provide 2-3):
• "Component uses inline template with clear structure"
• "Inputs and outputs are clearly defined"
• "Minimal logic with straightforward behavior"
• "All properties are strongly typed"

Set confidence to MEDIUM when:
• Some conditional logic present
• Ambiguous property naming
• Partial template visibility
• Mixed inline/external dependencies
• Moderate complexity

Example MEDIUM reasons (provide 2-3):
• "Some conditional logic requires deeper analysis"
• "Ambiguous naming reduces clarity"
• "Template structure is partially observable"
• "External dependencies may affect behavior"

Set confidence to LOW when:
• External template file (templateUrl:)
• Complex conditional logic
• Missing or unclear structure
• Heavy use of external services/dependencies
• Significant portions unanalyzable

Example LOW reasons (provide 2-3):
• "External template not analyzed"
• "Complex conditional logic detected"
• "Component behavior may depend on external services"
• "Template structure not fully visible"

UNCERTAINTY HANDLING:

When parts cannot be analyzed:
• Add uncertainty notes to behaviorInsights or componentStructure
• Example: "Some rendering behavior may depend on external template not analyzed"
• Be honest about limitations - do NOT guess missing information
• Do NOT reduce confidence unnecessarily for minor gaps
• Be transparent about what cannot be analyzed

CRITICAL RULES:
• Keep each reason to ONE line (short and clear)
• Provide 2-3 reasons explaining the confidence level
• Do NOT make up information
• Be honest and transparent about analysis limitations
• Focus on what IS known, not what isn't

CRITICAL: GENERIC OUTPUT RULES
• ALL descriptions must be component-agnostic
• Do NOT optimize for specific component types (badge, input, button)
• Use generic language that applies to ANY Angular component
• Avoid component-specific assumptions about UI or element types
• Default value display: "—" (NOT "none", "null", "undefined")
• Only describe observable logic, never assume design
• Be consistent across ALL component types

Do NOT hallucinate. Only document what exists in the code.`,
        },
        {
          role: "user",
          content: code,
        },
      ],
      temperature: 0.3,
      response_format: { type: "json_object" },
    });

    const result = completion.choices[0].message.content;
    return NextResponse.json({ result });

  } catch (error: any) {
    console.error("API Error:", error?.message || error);
    return NextResponse.json(
      { error: error?.message || "Something went wrong" },
      { status: 500 }
    );
  }
}