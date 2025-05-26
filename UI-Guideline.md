# 🎨 Proposly — UI Guidelines

## 🧠 Design Psychology

When designing Proposly’s UI, follow these psychological principles to optimize trust, ease-of-use, and engagement:

- **Clarity First**: Keep interfaces clean, minimal, and distraction-free to reduce cognitive load.
- **Visual Hierarchy**: Use size, contrast, and spacing to guide attention from primary to secondary actions.
- **Trust through Design**:
  - Use soft shadows and rounded elements to feel friendly and secure.
  - Display testimonials, reviews, and user counts on the landing page.
- **Frictionless Flow**: Guide users with a step-by-step experience to reduce overwhelm (e.g. paste job → generate → customize → export).
- **Micro-Interactions**: Use subtle animations and hover effects (via Framer Motion) to make the app feel modern and responsive.

---

## 🌈 Color Scheme

### 🎨 Brand Colors
| Purpose            | Color Name      | Hex Code     | Tailwind Class |
|--------------------|------------------|--------------|----------------|
| Primary            | Forest Green     | `#059669`    | `bg-emerald-600` |
| Primary Hover      | Dark Green       | `#047857`    | `hover:bg-emerald-700` |
| Accent             | Teal Green       | `#14B8A6`    | `bg-teal-500`     |
| Background (Light) | White Gray       | `#F9FAFB`    | `bg-gray-50`     |
| Text Primary       | Gray-900         | `#111827`    | `text-gray-900` |
| Text Secondary     | Gray-600         | `#4B5563`    | `text-gray-600` |
| Border/Divider     | Gray-300         | `#D1D5DB`    | `border-gray-300` |

> ⚠️ Avoid harsh reds or neons; they reduce trust in productivity tools.

---

## 🔤 Fonts

### 🌟 Primary Font
- **Font**: `Inter`
- **Fallbacks**: `-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif`

### 📐 Typography Rules
| Element       | Font Size     | Tailwind Class |
|---------------|---------------|----------------|
| Heading 1     | 2.25rem       | `text-4xl`     |
| Heading 2     | 1.875rem      | `text-3xl`     |
| Heading 3     | 1.5rem        | `text-2xl`     |
| Paragraph     | 1rem          | `text-base`    |
| Caption/Note  | 0.875rem      | `text-sm`      |

> Use larger fonts for proposals and call-to-action to enhance readability and confidence.

---

## 📐 Component Design Guidelines

### 🔘 Buttons
- Use primary green (`bg-emerald-600`) for CTAs.
- Rounded (`rounded-xl`) and padded (`px-4 py-2`).
- Disabled state: `bg-indigo-200 text-white cursor-not-allowed`.

### 📥 Inputs & Textareas
- Full width by default
- Rounded corners (`rounded-lg`), subtle border
- On focus: highlight with `ring-2 ring-emerald-500`

### 💬 Proposal Box
- Monospaced or light serif font optional for the proposal body
- Allow copy, download, and edit with accessible buttons
- Highlight keywords via `text-emerald-600 font-medium`

---

## ⚙️ Motion & Interaction

- Use **Framer Motion** for:
  - Page transitions (`fadeIn`, `slideUp`)
  - Button hover pop (`scale(1.05)`)
  - Proposal generation loading shimmer
- Never block UX with modals unless user input is essential

---

## 📱 Responsiveness

- Mobile-first design
- Use Tailwind’s responsive classes (`sm:`, `md:`, `lg:`)
- Collapse proposal history and nav into a drawer on mobile

---

## 🧩 UI Component Suggestions

| Component         | Purpose                             |
|------------------|--------------------------------------|
| `<CTASection />`  | Landing page call to action         |
| `<ProposalCard />`| Display saved/generated proposals   |
| `<PlanCard />`    | Subscription and billing info       |
| `<UserAvatar />`  | Profile and auth navigation         |
| `<JobInputForm />`| Job post entry form                 |
| `<ToneSelector />`| Dropdown or chips for tone/style    |

---

## ✅ Accessibility (A11y)

- All buttons and inputs must have `aria-label`s
- Use `role="alert"` for error messages
- Ensure color contrast ratios pass WCAG 2.1 (AA or better)

---

## 📄 Example Tailwind Utility Stack

```jsx
<button className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold px-4 py-2 rounded-xl shadow-sm transition-all duration-200">
  Generate Proposal
</button>
