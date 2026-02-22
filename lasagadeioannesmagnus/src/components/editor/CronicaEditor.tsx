import * as React from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import {
    Bold,
    Italic,
    List,
    ListOrdered,
    Quote,
    Heading2,
    Undo,
    Redo,
} from 'lucide-react';

interface CronicaEditorProps {
    content: string;
    onChange: (content: string) => void;
}

export const CronicaEditor: React.FC<CronicaEditorProps> = ({ content, onChange }) => {
    const editor = useEditor({
        extensions: [StarterKit],
        content,
        onUpdate: ({ editor: e }) => {
            onChange(e.getHTML());
        },
    });

    if (!editor) return null;

    const btnStyle = (active: boolean): React.CSSProperties => ({
        width: 34,
        height: 34,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: active ? 'var(--accent-gold-glow)' : 'transparent',
        border: 'none',
        borderRadius: 'var(--radius-sm)',
        color: active ? 'var(--accent-gold)' : 'var(--text-muted)',
        cursor: 'pointer',
        transition: 'all 0.15s ease',
    });

    return (
        <div>
            <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: 2,
                marginBottom: 16,
                padding: '4px 6px',
                background: 'var(--bg-elevated)',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--border-subtle)',
                width: 'fit-content',
            }}>
                <button onClick={() => editor.chain().focus().toggleBold().run()} style={btnStyle(editor.isActive('bold'))}>
                    <Bold size={16} />
                </button>
                <button onClick={() => editor.chain().focus().toggleItalic().run()} style={btnStyle(editor.isActive('italic'))}>
                    <Italic size={16} />
                </button>
                <button onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} style={btnStyle(editor.isActive('heading', { level: 2 }))}>
                    <Heading2 size={16} />
                </button>
                <div style={{ width: 1, height: 20, background: 'var(--border-subtle)', margin: '0 4px' }} />
                <button onClick={() => editor.chain().focus().toggleBulletList().run()} style={btnStyle(editor.isActive('bulletList'))}>
                    <List size={16} />
                </button>
                <button onClick={() => editor.chain().focus().toggleOrderedList().run()} style={btnStyle(editor.isActive('orderedList'))}>
                    <ListOrdered size={16} />
                </button>
                <button onClick={() => editor.chain().focus().toggleBlockquote().run()} style={btnStyle(editor.isActive('blockquote'))}>
                    <Quote size={16} />
                </button>
                <div style={{ width: 1, height: 20, background: 'var(--border-subtle)', margin: '0 4px' }} />
                <button onClick={() => editor.chain().focus().undo().run()} style={btnStyle(false)}>
                    <Undo size={16} />
                </button>
                <button onClick={() => editor.chain().focus().redo().run()} style={btnStyle(false)}>
                    <Redo size={16} />
                </button>
            </div>

            <style>{`
                .ProseMirror {
                    min-height: 240px;
                    outline: none;
                    font-family: 'Inter', sans-serif;
                    font-size: 16px;
                    line-height: 1.7;
                    color: var(--text-primary);
                }
                .ProseMirror p {
                    margin-bottom: 12px;
                }
                .ProseMirror h2 {
                    font-family: 'Cinzel', serif;
                    font-size: 20px;
                    font-weight: 600;
                    color: var(--text-primary);
                    margin: 20px 0 8px;
                    letter-spacing: 0.02em;
                }
                .ProseMirror blockquote {
                    border-left: 3px solid var(--accent-gold);
                    padding-left: 16px;
                    margin: 12px 0;
                    font-family: 'Playfair Display', serif;
                    font-style: italic;
                    color: var(--text-secondary);
                }
                .ProseMirror ul, .ProseMirror ol {
                    padding-left: 24px;
                    margin-bottom: 12px;
                }
                .ProseMirror li {
                    margin-bottom: 4px;
                }
                .ProseMirror p.is-editor-empty:first-child::before {
                    color: var(--text-muted);
                    content: 'Empieza a escribir...';
                    float: left;
                    height: 0;
                    pointer-events: none;
                    opacity: 0.5;
                }
            `}</style>

            <EditorContent editor={editor} />
        </div>
    );
};
