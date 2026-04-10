# 🚀 Angular Component Analyzer

Analyze, document, and improve Angular components with structured, AI-driven insights.

---

## ✨ Overview

Angular Component Analyzer is a developer tool that parses Angular components and generates clear, structured documentation along with useful insights.

It focuses on analyzing component inputs, outputs, and behavior to provide reliable and developer-friendly output.

---

## 🔍 Features

* Detects `@Input()` properties with types and default values
* Detects `@Output()` EventEmitters with inferred descriptions
* Generates behavior insights based on component logic
* Provides component structure summaries
* Calculates a transparent component health score
* Suggests improvements based on best practices
* Exports clean MDX documentation
* Includes analysis confidence to indicate reliability

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

* Node.js 18+ installed
* A Groq API key (free tier available)

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

**Important:**
- The API key is required for AI-powered analysis features
- Never commit `.env.local` or any file containing secrets to git
- Use `.env.example` as a template (already included in the repository)

### Run the App

```bash
npm run dev
```

Then open http://localhost:3000 in your browser.

---

## 📌 Use Cases

* Design system documentation
* Component auditing and review
* Developer onboarding
* Documentation generation

---

## 🧠 Future Improvements

* Test case generation
* External template analysis (`templateUrl`)
* Custom developer annotations (`@doc`)
* Accessibility checks

---

## 🤝 Contributing

Contributions are welcome. Feel free to open issues or submit pull requests.

---

## 📄 License

MIT License

---

## 👤 Author

Rishma Merkaje Nanaiah

