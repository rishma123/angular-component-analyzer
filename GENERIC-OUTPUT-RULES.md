# Generic Output Rules - Component-Agnostic Documentation

## Overview
Ensured all generated documentation is **fully generic, accurate, and component-agnostic** to work reliably across ALL Angular components.

---

## 🎯 Core Principle

**Every description, insight, and structural point must be reusable across ANY Angular component type.**

Do NOT optimize for specific components (badge, input, button, table, etc.)

---

## 1. Input Description Rules

### ✅ Generic Patterns (Component-Agnostic)

| Input Name | Description | Confidence |
|------------|-------------|------------|
| `value` | "Controls the current value of the component" | high |
| `status` | "Controls component state" | high |
| `label` / `text` | "Text content for the component" | high |
| `disabled` / `enabled` | "Enables or disables interaction" | high |
| `clickable` | "Enables or disables click interactions" | high |
| `size` | "Sets the size of the component" | medium |
| `variant` / `theme` | "Determines the visual style" | medium |
| `data` / `items` | "Data provided to the component" | low |
| `config` / `options` | "Configuration object for the component" | low |
| `placeholder` | "Placeholder text shown when empty" | high |
| `required` | "Marks the component as required" | high |
| `readonly` | "Prevents modification of the value" | high |

### ❌ What to Avoid

**Before (Component-Specific):**
```
status → "Controls the visual state of the badge"  ❌ Assumes badge
label → "Text displayed inside the input field"    ❌ Assumes input
```

**After (Generic):**
```
status → "Controls component state"                ✅ Generic
label → "Text content for the component"           ✅ Generic
```

### Rules:
- Do NOT assume element type (input, badge, button)
- Do NOT use "visual state" unless code proves it
- Use "Controls component state" instead
- Be reusable across ALL components

---

## 2. Default Value Handling

### Display Rules

| Situation | Display | Example |
|-----------|---------|---------|
| Default value exists | "Uses [value] when not provided" | "Uses 'active' when not provided" |
| No default value | "—" | "—" |
| Empty string default | "Uses '' when not provided" | "Uses '' when not provided" |

### ❌ What NOT to Use

- ❌ "none"
- ❌ "null"
- ❌ "undefined"
- ❌ "N/A"

### ✅ Correct Display

```json
{
  "name": "value",
  "default": "",     // Empty but exists
  "display": "—"     // Show em-dash
}

{
  "name": "status",
  "default": "'active'",
  "display": "Uses 'active' when not provided"
}
```

### Important: "Falls Back" vs "Uses"

**❌ Wrong:**
```
"Falls back to default value when input is not provided"
```
This implies fallback logic. Only use "falls back" if fallback logic is **explicitly** in the code.

**✅ Correct:**
```
"Uses default value when not provided"
```
This is accurate and doesn't assume fallback logic.

---

## 3. Output Description Rules

### Generic Format (Component-Agnostic)

**Pattern:** `"Emits when [action] occurs"`

### ✅ Generic Examples

| EventEmitter | Description | Confidence |
|--------------|-------------|------------|
| `onClick` / `click` | "Emits when clicked" | high |
| `valueChange` / `change` | "Emits when the value changes" | high |
| `select` / `selected` | "Emits when selected" | high |
| `toggle` / `toggled` | "Emits when toggled" | high |
| `focus` / `blur` | "Emits when focus changes" | high |
| `input` | "Emits when input is provided" | high |

### ❌ What to Avoid

**Before (Component-Specific):**
```
badgeClick → "Emits when the badge is clicked"  ❌ Uses "badge"
inputChange → "Emits when input field changes"  ❌ Uses "input field"
buttonClick → "Emits when button is clicked"    ❌ Uses "button"
```

**After (Generic):**
```
badgeClick → "Emits when clicked"               ✅ Generic
inputChange → "Emits when the value changes"    ✅ Generic
buttonClick → "Emits when clicked"              ✅ Generic
```

### Rules:
- Do NOT use component type names ("badge", "button", "input")
- Use generic actions: "clicked", "changed", "selected", "toggled"
- Be consistent regardless of EventEmitter name

---

## 4. Component Structure Rules

### Generic Language (Component-Agnostic)

**Focus on:**
1. What element type is rendered (only if detectable from code)
2. How content is determined (which inputs control it)
3. Conditional rendering logic (if present)
4. Interaction capabilities (if present)

### ✅ Generic Examples

```
✅ "Renders content based on provided inputs"
✅ "Displayed content depends on status input"
✅ "Supports user interaction when enabled"
✅ "Conditionally displays additional content"
✅ "Content is determined by data input"
✅ "Uses inline template"
✅ "Uses external template"
```

### ❌ What to Avoid

```
❌ "Displays a badge element with text content"     (assumes badge)
❌ "Renders an input field with optional label"     (assumes input)
❌ "Shows a button with click functionality"        (assumes button)
❌ "Visual appearance depends on status value"      (assumes visual)
❌ "UI changes based on status"                     (vague)
❌ "Nice display of content"                        (vague)
```

### Template Detection

**Only report template type:**
- If `template:` → "Uses inline template"
- If `templateUrl:` → "Uses external template"

**Do NOT mention:**
- ❌ "Preview available"
- ❌ "Rendering simulation"
- ❌ "Visual preview supported"

---

## 5. Behavior Insights Rules

### Generic, Observable Behavior Only

### ✅ Generic Examples

```
✅ "Uses default value when input is not provided"
✅ "Behavior is controlled by input properties"
✅ "Interaction is controlled by boolean flag"
✅ "Supports conditional rendering based on inputs"
✅ "Manages internal state"
✅ "Displayed content depends on input values"
```

### ❌ What to Avoid

```
❌ "Falls back to default value when input is not provided"  (use "Uses" instead)
❌ "UI changes based on status input"                        (vague - use "Displayed content depends on...")
❌ "Nice visual feedback on interaction"                     (assumes design)
❌ "Badge updates when status changes"                       (component-specific)
```

### Rules:
- Do NOT use "falls back" unless fallback logic is explicitly in code
- Do NOT use vague phrases like "UI changes"
- Use "Displayed content depends on..." instead
- Do NOT assume design or appearance
- Only describe observable logic from the code

---

## 6. Consistency Across Component Types

### Example: Same Rules for Different Components

**Badge Component:**
```json
{
  "componentStructure": [
    "Renders content based on provided inputs",
    "Displayed content depends on status input",
    "Supports user interaction when enabled"
  ]
}
```

**Input Component:**
```json
{
  "componentStructure": [
    "Renders content based on provided inputs",
    "Displayed content depends on value input",
    "Supports user interaction when enabled"
  ]
}
```

**Button Component:**
```json
{
  "componentStructure": [
    "Renders content based on provided inputs",
    "Displayed content depends on label input",
    "Supports user interaction when enabled"
  ]
}
```

**Notice:** Same generic language, different input names. Fully reusable!

---

## 7. Complete Example: Generic Output

### InputFieldComponent (Using Generic Rules)

```json
{
  "componentName": "InputFieldComponent",
  "description": "An input component with configurable properties",

  "componentStructure": [
    "Renders content based on provided inputs",
    "Displayed content depends on value input",
    "Supports user interaction when enabled",
    "Uses inline template"
  ],

  "behaviorInsights": [
    "Behavior is controlled by input properties",
    "Interaction is controlled by disabled flag",
    "Uses default value when input is not provided"
  ],

  "inputs": [
    {
      "name": "value",
      "type": "string",
      "default": "—",
      "description": "Controls the current value of the component",
      "confidence": "high"
    },
    {
      "name": "label",
      "type": "string",
      "default": "—",
      "description": "Text content for the component",
      "confidence": "high"
    },
    {
      "name": "disabled",
      "type": "boolean",
      "default": "Uses false when not provided",
      "description": "Enables or disables interaction",
      "confidence": "high"
    }
  ],

  "outputs": [
    {
      "name": "valueChange",
      "type": "EventEmitter<string>",
      "description": "Emits when the value changes",
      "confidence": "high"
    }
  ]
}
```

---

## 8. Quality Checklist

Before generating documentation, verify:

### ✅ Generic Language
- [ ] No component-specific words (badge, button, input, table)
- [ ] No assumptions about element type
- [ ] No visual/styling descriptions
- [ ] Reusable across ALL Angular components

### ✅ Accurate Default Values
- [ ] "—" for no default (NOT "none", "null", "undefined")
- [ ] "Uses [value] when not provided" if default exists
- [ ] Never use "falls back" without explicit fallback logic

### ✅ Clear Descriptions
- [ ] ONE sentence per description
- [ ] No vague phrases ("UI changes", "nice display")
- [ ] Use "Displayed content depends on..." instead
- [ ] Observable logic only, no assumptions

### ✅ Consistent Format
- [ ] Outputs: "Emits when [action] occurs"
- [ ] No component type names in descriptions
- [ ] Generic actions: "clicked", "changed", "selected"

---

## 9. Benefits

### Before (Component-Specific)
```
❌ Different descriptions for similar inputs across components
❌ Assumptions about UI and element types
❌ Vague phrases like "UI changes"
❌ Component-specific language
❌ Inconsistent default value handling
```

### After (Generic)
```
✅ Consistent descriptions across ALL components
✅ No assumptions about UI or element types
✅ Clear, precise language
✅ Fully reusable patterns
✅ Standardized default value display
✅ Works for badge, input, button, table, etc.
```

---

## 10. Implementation

### Files Modified

**[app/api/document/route.ts](app/api/document/route.ts)**

Added strict generic output rules:
- Input description patterns (fully generic)
- Default value handling rules
- Component-agnostic output descriptions
- Generic component structure examples
- Generic behavior insights patterns
- Global consistency requirements

---

## Summary

### Core Rules Enforced:

1. **Generic Language** - No component-specific words
2. **Default Values** - "—" or "Uses [value] when not provided"
3. **No Assumptions** - Only observable logic
4. **Consistent Format** - Same rules for ALL components
5. **Clear Descriptions** - No vague phrases
6. **Component-Agnostic** - Reusable across ANY Angular component

### Result:

The Angular Component Analyzer now generates **fully generic, accurate, and component-agnostic** documentation that works reliably for:
- Badges
- Inputs
- Buttons
- Tables
- Toggles
- Forms
- Dialogs
- **ANY Angular component**

🎉 **100% generic, 100% consistent, 100% reusable!**

---

**Status:** ✅ Complete
**Files Changed:** [app/api/document/route.ts](app/api/document/route.ts)
**Documentation:** [GENERIC-OUTPUT-RULES.md](GENERIC-OUTPUT-RULES.md) (this file)
