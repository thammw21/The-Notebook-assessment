import { useState, useEffect } from 'react';

export interface Note {
  id: string;
  title: string;
  content: string;
  createdAt: number;
  lastModified: number;
}

// The default welcome note content
const DEFAULT_NOTE: Note = {
  id: crypto.randomUUID(),
  title: 'welcome',
  content: `# Welcome to Notebook

## What is this?

A lightweight, browser-based Markdown editor. Everything you write is saved **automatically** in your browser.

## Features

- Create and manage multiple Markdown files
- Live preview as you type
- Data persists across sessions (localStorage)
- Clean, distraction-free interface

## Markdown Quick Reference

| Syntax | Result |
|--------|--------|
| \`# Heading\` | Large heading |
| \`**bold**\` | **bold** |
| \`*italic*\` | *italic* |
| \`[link](url)\` | Hyperlink |
| \`\`\`code\`\`\` | Code block |

> Start writing in the editor panel on the left.
`,
  createdAt: Date.now(),
  lastModified: Date.now(),
};

export function useNotes() {
  const [notes, setNotes] = useState<Note[]>(() => {
    const savedNotes = localStorage.getItem('notebook-data');
    if (savedNotes) {
      try {
        const parsed = JSON.parse(savedNotes);
        // If localStorage has valid data, use it; otherwise fallback to default
        if (parsed && parsed.length > 0) return parsed;
      } catch (e) {
        console.error('Failed to parse notes from local storage');
      }
    }
    return [DEFAULT_NOTE];
  });

  const [activeNoteId, setActiveNoteId] = useState<string | null>(notes[0]?.id || null);

  useEffect(() => {
    localStorage.setItem('notebook-data', JSON.stringify(notes));
  }, [notes]);

  const createNote = () => {
    const newNote: Note = {
      id: crypto.randomUUID(),
      title: 'untitled',
      content: '',
      createdAt: Date.now(),
      lastModified: Date.now(),
    };
    
    setNotes((prevNotes) => [newNote, ...prevNotes]);
    setActiveNoteId(newNote.id);
  };

  const updateNote = (id: string, newContent: string) => {
    setNotes((prevNotes) =>
      prevNotes.map((note) => {
        if (note.id === id) {
          // Automatically extract the first non-empty line as the title
          const firstLine = newContent.split('\n')[0].replace(/^#+\s*/, '').trim();
          const title = firstLine || 'untitled';

          return {
            ...note,
            title,
            content: newContent,
            lastModified: Date.now(),
          };
        }
        return note;
      })
    );
  };

  const deleteNote = (id: string) => {
    setNotes((prevNotes) => {
      const filteredNotes = prevNotes.filter((note) => note.id !== id);
      
      if (id === activeNoteId) {
        setActiveNoteId(filteredNotes.length > 0 ? filteredNotes[0].id : null);
      }
      
      return filteredNotes;
    });
  };

  const setActiveNote = (id: string) => {
    setActiveNoteId(id);
  };

  return {
    notes,
    activeNoteId,
    createNote,
    updateNote,
    deleteNote,
    setActiveNote,
  };
}