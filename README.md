# 🚀 Angular Component Analyzer

**AI-powered documentation for Angular components — without the fake UI previews.**

Most AI tools try to render your components and fail. This one analyzes structure, inputs, outputs, and behavior — then gives you **accurate, actionable insights**.

**What you get:**
- Automatic `@Input` and `@Output` detection
- Behavior insights from component logic
- Health scoring with actionable suggestions
- **Confidence indicators** showing analysis reliability
- Clean MDX exports for design systems

No guesswork. No misleading mockups. Just reliable developer documentation

---

## 🔍 Features

* 📥 Detects `@Input()` properties with types and default values
* 📤 Detects `@Output()` EventEmitters with inferred descriptions
* 🧠 Generates **behavior insights** based on component logic
* 🧩 Provides **component structure** (no fake UI rendering)
* 📊 Calculates a transparent **component health score**
* 💡 Suggests improvements based on best practices
* 📄 Exports clean **MDX documentation**
* 🎯 Includes **analysis confidence** to indicate reliability

---

## 🎯 Why This Tool?

Most AI-based tools generate UI previews that quickly become inaccurate for real-world components.

This tool takes a different approach:

> ❌ No visual mockups  
> ✅ Clear, reliable, developer-focused insights

---

## 🧠 Analysis Confidence (Wow Feature)

Each analysis includes a confidence level to indicate reliability:

```text
Analysis Confidence: Medium

Reasons:
- External template not analyzed
- Conditional logic detected
```

This ensures developers understand **when to trust the output and when to review manually**.

---

## 🛠 Example Output

```text
Component Structure:
- Displays dynamic content based on input values
- Supports user interaction through events

Behavior Insights:
- Updates internal state based on user interaction
- Emits events when state changes
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ installed
- A [Groq API key](https://console.groq.com/keys) (free tier available)

### Installation

```bash
git clone https://github.com/rishma123/angular-component-analyzer
cd angular-component-analyzer
npm install
```

### Environment Setup

Create a `.env.local` file in the root directory:

```bash
GROQ_API_KEY=your_groq_api_key_here
```

### Run the App

```bash
npm run dev
```

Then open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 📌 Use Cases

* Design system documentation
* Component auditing and review
* Developer onboarding
* Rapid documentation generation

---

## 🧠 Future Improvements

* Test case generation
* External template analysis (`templateUrl`)
* Custom developer annotations (`@doc`)
* Advanced accessibility checks

---

## 🤝 Contributing

Contributions are welcome! Feel free to open issues or submit pull requests.

---

## 📄 License

MIT License

---

## 👤 Author

Built by Rishma Merkaje Nanaiah

---

## ⭐ If you find this useful, consider giving it a star!
