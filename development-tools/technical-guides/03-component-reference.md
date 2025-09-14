# Technical Guide: Component Reference

This document provides a reference for key reusable UI components in the Maxwell Vantage application.

---

### `<Card>`

-   **File**: `components/ui/Card.tsx`
-   **Description**: The primary wrapper component for most content blocks in the UI. It provides a consistent container with a white background, padding, shadow, and border.
-   **Props**:
    -   `children: React.ReactNode`: The content to be rendered inside the card.
    -   `className?: string`: Optional additional Tailwind CSS classes to apply to the card container.
    -   `title?: string`: If provided, renders a styled `<h3>` tag at the top of the card.
-   **Usage Example**:
    ```tsx
    import Card from './components/ui/Card';

    const MyComponent = () => (
      <Card title="My Section" className="mt-4">
        <p>This is the content inside the card.</p>
      </Card>
    );
    ```

---

### `<StatCard>`

-   **File**: `components/dashboard/StatCard.tsx`
-   **Description**: A specialized card used on the Dashboard to display a key metric (KPI).
-   **Props**:
    -   `title: string`: The title of the metric (e.g., "Active Projects").
    -   `value: string`: The main value to be displayed in a large font.
    -   `change?: string`: An optional string describing the change over time (e.g., "+2 this week").
    -   `positive?: boolean`: If `change` is provided, this determines the color of the text. `true` is green, `false` is red.
-   **Usage Example**:
    ```tsx
    import StatCard from './components/dashboard/StatCard';

    const Dashboard = () => (
      <StatCard
        title="Projects at Risk"
        value="3"
        change="+1 this week"
        positive={false}
      />
    );
    ```

---

### Icons

-   **File**: `constants.tsx`
-   **Description**: All SVG icons are defined as functional React components within `constants.tsx`. This allows them to be easily imported and used throughout the application, and their properties (like `className`) can be customized via props.
-   **Props**:
    -   `className?: string`: Allows passing Tailwind CSS classes to control size, color, etc.
-   **Usage Example**:
    ```tsx
    import { ZapIcon } from './constants';

    const MyButton = () => (
      <button>
        <ZapIcon className="w-5 h-5 mr-2" />
        Execute
      </button>
    );
    ```
