# The Notebook - Markdown Editor

**Deployment URL:** https://the-notebook-assessment.vercel.app/  
**GitHub Repository:** https://github.com/thammw21/The-Notebook-assessment

## 1. Project Choice
I chose **Idea 1: The "Notebook" - Multi-File Markdown Editor**. I selected this project because it provided a great opportunity to showcase clean UI design, robust client-side state management using React hooks, and real-time text parsing. To elevate the user experience beyond the basic requirements, I also implemented real-time word counting, reading time estimation, and a feature to export/download individual notes as `.md` files.

## 2. Justification of Tools
* **React (via Vite):** React's component-based architecture and state management (`useState`, `useEffect`) are ideal for managing the isolated UI states (sidebar, editor, preview) and syncing data flawlessly with `localStorage`. Vite was chosen for its extremely fast local development environment.
* **react-markdown & remark-gfm:** Instead of writing a custom Markdown parser from scratch, I utilized these robust libraries to safely and accurately render GitHub-flavored Markdown (including tables and code blocks) directly into React elements.
* **Custom CSS:** While I initially experimented with Tailwind CSS, I ultimately pivoted to a custom CSS approach. This allowed me to implement a highly refined, retro-styled typography and a seamless Dark/Light theme toggle using CSS variables, giving the app a premium, distraction-free feel.
* **AI Assistants (Claude & Gemini):** I used AI as a pair programmer. I leveraged Claude to brainstorm the initial aesthetic and CSS structure for a vanilla web layout, and Gemini 3.1 Pro to architect the React `useNotes` hook and refactor the static design into a dynamic, state-driven React application.

## 3. High-Level Approach
My strategy relied on a **chained prompting and component integration** approach:
1.  **Data Layer First:** I first prompted the AI to establish the data models and a custom `useNotes` hook to handle all CRUD operations and `localStorage` hydration independently of the UI.
2.  **UI & Aesthetic Generation:** I generated a visually appealing static HTML/CSS layout focusing on typography, theme toggling, and a three-panel flexbox design.
3.  **Refactoring & Integration:** The core task was refactoring the AI-generated Vanilla JS DOM manipulation into declarative React state. I mapped the static UI to my `useNotes` hook and replaced the raw text rendering with `react-markdown`.
4.  **UX Enhancements:** As a final iteration, I implemented local file downloading (`Blob` API) and reading time calculations to polish the product.

## 4. Final Prompts
Here are the key prompts used to engineer this application:

**Prompt 1: Initializing the Data Structure (The Hook)**
> "Act as an expert React developer. I am building a client-side Markdown note-taking app. Define a TypeScript interface for a `Note` object. Create a custom React hook called `useNotes` that manages an array of `Note` objects using `localStorage`. The hook should return the `notes` array, an `activeNoteId` state, and functions to: create, update, and delete notes. Ensure the hook handles initial hydration gracefully (if `localStorage` is empty, initialize with one beautifully formatted Markdown welcome note that showcases tables, code blocks, and lists)."

**Prompt 2: The Core Layout & Logic Integration**
> "Now, I have a custom CSS file that defines a beautiful dark/light theme for a three-panel Markdown editor. I need to refactor a vanilla JS layout into a React component. Create the main `App.tsx` that utilizes the `useNotes` hook. It must include a sidebar mapping over the notes, a textarea for the active note, and a preview panel using `react-markdown` and `remark-gfm`. Include state for toggling the settings drawer (theme, font, font-size) and sync those preferences to the DOM via `useEffect`."

## 5. Instructions
To run this project on your local machine:

1. Clone the repository: 
   `git clone [your-repo-url]`
2. Navigate to the project directory: 
   `cd notebook-app`
3. Install the dependencies: 
   `npm install`
4. Start the development server: 
   `npm run dev`
5. Open your browser and navigate to the local URL provided in the terminal (usually `http://localhost:5173`).

## 6. Challenges & Iterations
* **Challenge 1: Styling Framework Conflicts.** I initially attempted to use Tailwind CSS v4 for the layout. However, I encountered configuration conflicts between the newly released `@tailwindcss/vite` plugin and the existing PostCSS setup. 
    * *Iteration:* Rather than spending excessive time debugging beta framework configurations, I recognized that the core requirement was a "clean interface." I pivoted my prompt to generate custom, scoped CSS variables instead. This resolved the build issues instantly and resulted in a more personalized, elegant theme.
* **Challenge 2: Integrating Vanilla JS output into React.** One AI model generated a beautiful UI but used imperative DOM manipulation (e.g., `document.getElementById().addEventListener`). 
    * *Iteration:* I had to carefully engineer a follow-up prompt (and write custom logic) to strip out the imperative Vanilla JS and replace it with declarative React `useState` and `useEffect` hooks, ensuring the theme and font preferences still applied correctly to the `document.body` without breaking React's lifecycle.
