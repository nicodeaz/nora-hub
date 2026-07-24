import React, { useState } from 'react';
import { QuickNoteItem } from '../types';
import { Sparkle } from './Sparkle';
import { X, Plus, Trash2, Tag, BookOpen, Clock, Copy, Check } from 'lucide-react';

interface QuickNotesModalProps {
  isOpen: boolean;
  onClose: () => void;
  notes: QuickNoteItem[];
  onSaveNote: (note: QuickNoteItem) => void;
  onDeleteNote: (id: string) => void;
}

export const QuickNotesModal: React.FC<QuickNotesModalProps> = ({
  isOpen,
  onClose,
  notes,
  onSaveNote,
  onDeleteNote,
}) => {
  const [activeTab, setActiveTab] = useState<'list' | 'edit'>('list');
  const [editingNote, setEditingNote] = useState<Partial<QuickNoteItem>>({
    title: '',
    content: '',
    category: 'idea',
    colorTag: 'pink',
  });
  const [copiedId, setCopiedId] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleCreateNew = () => {
    setEditingNote({
      id: Date.now().toString(),
      title: '',
      content: '',
      category: 'idea',
      colorTag: 'pink',
    });
    setActiveTab('edit');
  };

  const handleEditNote = (note: QuickNoteItem) => {
    setEditingNote(note);
    setActiveTab('edit');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingNote.title || !editingNote.content) return;

    const fullNote: QuickNoteItem = {
      id: editingNote.id || Date.now().toString(),
      title: editingNote.title,
      content: editingNote.content,
      category: editingNote.category || 'idea',
      createdAt: editingNote.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      colorTag: editingNote.colorTag || 'pink',
    };

    onSaveNote(fullNote);
    setActiveTab('list');
  };

  const handleCopyNote = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const colorTagStyles = {
    pink: 'border-[#F5D3C6] bg-[#F5D3C6]/30 text-[#171512]',
    teal: 'border-[#7BA8A0] bg-[#7BA8A0]/20 text-[#171512]',
    gold: 'border-[#E8B34E] bg-[#E8B34E]/20 text-[#171512]',
    red: 'border-[#B72A32] bg-[#B72A32]/10 text-[#B72A32]',
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-[#171512]/60 backdrop-blur-xs animate-fade-in">
      <div className="relative w-full max-w-2xl bg-[#F7EFE6] rounded-t-3xl sm:rounded-3xl border border-[#171512]/20 shadow-2xl overflow-hidden flex flex-col h-[90vh] sm:h-auto sm:max-h-[90vh]">
        
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-[#171512]/10 bg-[#F7EFE6]">
          <div className="flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-[#B72A32]" />
            <h2 className="font-label text-base uppercase tracking-wider font-bold text-[#171512]">
              Cuaderno de Notas & Ideas
            </h2>
            <Sparkle color="gold" size={14} />
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-[#171512]/50 hover:text-[#B72A32] hover:bg-[#171512]/5 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Action Bar */}
        <div className="p-4 border-b border-[#171512]/10 bg-[#F7EFE6]/50 flex items-center justify-between gap-2">
          <div className="flex gap-2">
            <button
              onClick={() => setActiveTab('list')}
              className={`py-1.5 px-3 rounded-xl font-label text-xs uppercase tracking-wider font-semibold cursor-pointer ${
                activeTab === 'list'
                  ? 'bg-[#B72A32] text-[#F7EFE6]'
                  : 'bg-[#F7EFE6] text-[#171512]/60 hover:text-[#171512]'
              }`}
            >
              Mis Notas ({notes.length})
            </button>
            <button
              onClick={handleCreateNew}
              className={`py-1.5 px-3 rounded-xl font-label text-xs uppercase tracking-wider font-semibold cursor-pointer flex items-center gap-1 ${
                activeTab === 'edit'
                  ? 'bg-[#B72A32] text-[#F7EFE6]'
                  : 'bg-[#F7EFE6] text-[#171512]/60 hover:text-[#171512]'
              }`}
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Escribir Nota</span>
            </button>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto flex-1 space-y-4">
          {activeTab === 'list' ? (
            notes.length === 0 ? (
              <div className="text-center py-12 text-[#171512]/50 space-y-3 font-body">
                <BookOpen className="w-10 h-10 text-[#B72A32]/40 mx-auto" />
                <p>Tu cuaderno está vacío. ¡Empieza escribiendo tu primera idea de clown o recordatorio!</p>
                <button
                  onClick={handleCreateNew}
                  className="py-2 px-4 rounded-xl bg-[#B72A32] text-[#F7EFE6] font-label text-xs uppercase tracking-wider font-semibold cursor-pointer"
                >
                  Escribir Primera Nota
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {notes.map((note) => (
                  <div
                    key={note.id}
                    className={`p-4 rounded-2xl border ${
                      colorTagStyles[note.colorTag || 'pink']
                    } shadow-xs space-y-2 flex flex-col justify-between`}
                  >
                    <div>
                      <div className="flex items-start justify-between gap-2 mb-1">
                        <span className="font-label text-[10px] uppercase tracking-widest font-bold opacity-75">
                          {note.category}
                        </span>
                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => handleCopyNote(`${note.title}\n\n${note.content}`, note.id)}
                            className="p-1 rounded hover:bg-black/10 transition-colors text-[#171512]/60 cursor-pointer"
                            title="Copiar nota"
                          >
                            {copiedId === note.id ? (
                              <Check className="w-3.5 h-3.5 text-green-700" />
                            ) : (
                              <Copy className="w-3.5 h-3.5" />
                            )}
                          </button>
                          <button
                            onClick={() => onDeleteNote(note.id)}
                            className="p-1 rounded hover:bg-red-500/10 text-red-700 transition-colors cursor-pointer"
                            title="Eliminar"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>

                      <h4
                        onClick={() => handleEditNote(note)}
                        className="font-label text-sm font-bold text-[#171512] hover:text-[#B72A32] cursor-pointer"
                      >
                        {note.title}
                      </h4>
                      <p className="font-body text-xs text-[#171512]/85 mt-1 whitespace-pre-wrap">
                        {note.content}
                      </p>
                    </div>

                    <div className="pt-2 border-t border-[#171512]/10 flex items-center justify-between text-[10px] font-label text-[#171512]/50">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {new Date(note.updatedAt).toLocaleDateString('es-ES')}
                      </span>
                      <button
                        onClick={() => handleEditNote(note)}
                        className="text-[#B72A32] font-semibold hover:underline cursor-pointer"
                      >
                        Editar →
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4 font-body">
              <div>
                <label className="block font-label text-xs uppercase tracking-wider text-[#171512] font-bold mb-1">
                  Título de la Nota
                </label>
                <input
                  type="text"
                  required
                  value={editingNote.title || ''}
                  onChange={(e) => setEditingNote({ ...editingNote, title: e.target.value })}
                  placeholder="Ej: Idea de ejercicio de impulso escénico..."
                  className="w-full p-3 rounded-xl bg-[#F7EFE6] border border-[#171512]/20 text-xs font-body text-[#171512] focus:outline-none focus:border-[#B72A32]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-label text-xs uppercase tracking-wider text-[#171512] font-bold mb-1">
                    Categoría
                  </label>
                  <select
                    value={editingNote.category || 'idea'}
                    onChange={(e) =>
                      setEditingNote({
                        ...editingNote,
                        category: e.target.value as QuickNoteItem['category'],
                      })
                    }
                    className="w-full p-2.5 rounded-xl bg-[#F7EFE6] border border-[#171512]/20 text-xs font-body text-[#171512]"
                  >
                    <option value="idea">Idea Creativa</option>
                    <option value="clown">Clown & Juego</option>
                    <option value="docencia">Docencia & Taller</option>
                    <option value="produccion">Producción</option>
                    <option value="recordatorio">Recordatorio</option>
                  </select>
                </div>

                <div>
                  <label className="block font-label text-xs uppercase tracking-wider text-[#171512] font-bold mb-1">
                    Color Acento
                  </label>
                  <select
                    value={editingNote.colorTag || 'pink'}
                    onChange={(e) =>
                      setEditingNote({
                        ...editingNote,
                        colorTag: e.target.value as QuickNoteItem['colorTag'],
                      })
                    }
                    className="w-full p-2.5 rounded-xl bg-[#F7EFE6] border border-[#171512]/20 text-xs font-body text-[#171512]"
                  >
                    <option value="pink">Rosa Acuarela</option>
                    <option value="teal">Verde Azulado</option>
                    <option value="gold">Dorado</option>
                    <option value="red">Rojo Bermellón</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-label text-xs uppercase tracking-wider text-[#171512] font-bold mb-1">
                  Contenido
                </label>
                <textarea
                  required
                  rows={6}
                  value={editingNote.content || ''}
                  onChange={(e) => setEditingNote({ ...editingNote, content: e.target.value })}
                  placeholder="Escribe aquí tus ideas, apuntes de ensayo o textos..."
                  className="w-full p-3 rounded-xl bg-[#F7EFE6] border border-[#171512]/20 text-xs font-body text-[#171512] focus:outline-none focus:border-[#B72A32]"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setActiveTab('list')}
                  className="py-2 px-4 rounded-xl border border-[#171512]/20 font-label text-xs uppercase tracking-wider text-[#171512] cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="py-2 px-5 rounded-xl bg-[#B72A32] text-[#F7EFE6] font-label text-xs uppercase tracking-wider font-semibold cursor-pointer shadow-sm"
                >
                  Guardar Nota
                </button>
              </div>
            </form>
          )}
        </div>

      </div>
    </div>
  );
};
