# Tauri Kanban

This is a NextJS starter in Firebase Studio.

---

## Development Notes

This project was built iteratively with the help of an AI coding partner. Below are some notes on the process.

### Note on using an AI Assistant (like GitHub Copilot)

The AI assistant was used as an active pair programmer throughout the development of this Kanban board.

**Suggestions & Features:**
-   **Initial Scaffolding**: The AI was prompted to create the initial structure, including the Kanban board layout, columns, and cards.
-   **Component Integration**: It integrated UI components from `shadcn/ui`, such as modals, buttons, and accordions, to build out the interface.
-   **API Integration**: The assistant wrote the service layer to connect to the ClickUp API, handling `fetch` requests for tasks, statuses, comments, and checklists.
-   **UI/UX Enhancements**: It provided suggestions and implemented UI improvements, such as adding a tutorial to the settings page, using icons for better clarity, and applying consistent styling like uppercase headers.

**Bug Fixes:**
-   **React Rendering Error**: The AI initially introduced a `React.Children.only` error by incorrectly composing `AccordionTrigger` and `TooltipTrigger` components. When the error was reported, the AI correctly identified the cause and provided the fix.
-   **Incorrect API Data Fetching**: The "Complete" column was not loading tasks. The AI diagnosed this as a ClickUp API behavior and fixed it by adding the `include_closed=true` parameter to the API call.
-   **State Persistence**: Created labels were not being saved. The AI identified this as a state management issue and implemented a solution using `localStorage` to persist custom labels across sessions.

### What I Learned/Explored

-   **Rapid Prototyping**: Working with an AI dramatically speeds up the development cycle. Ideas can be translated into functional code in minutes.
-   **Composing Complex Components**: Explored the intricacies of composing components from `shadcn/ui`, especially how to correctly layer triggers (`Tooltip`, `Popover`, `Accordion`) to avoid common React rendering errors.
-   **External API Integration**: Gained hands-on experience integrating a third-party API (ClickUp) into a Next.js application, including handling authentication with a personal token and understanding the nuances of API query parameters (like fetching closed tasks).
-   **Client-Side State Persistence**: Learned a practical approach to persisting user-generated data (like custom labels) on the client-side using `localStorage`, providing a better user experience without needing a backend database for this feature.
-   **Iterative Debugging**: The process highlighted the "conversational" nature of modern debugging. Instead of just getting an error, you can present it to the AI, discuss the potential causes, and get a targeted solution.
