import { useState, useEffect } from 'react';
import { Navigation } from '../components/Navigation';
import { SupportFooter } from '../components/SupportFooter';
import { Button } from '../components/ui/button';
import { Textarea } from '../components/ui/textarea';
import { Input } from '../components/ui/input';
import { BookOpen, Plus, Trash2, Save, Edit3, Mic, MicOff } from 'lucide-react';
import { useRef } from 'react';

interface Note {
  id: string;
  title: string;
  content: string;
  lastEdited: string;
}

export function Notepad() {
  const [notes, setNotes] = useState<Note[]>(() => {
    const saved = localStorage.getItem('seniorNotes');
    return saved ? JSON.parse(saved) : [];
  });
  
  const [currentNote, setCurrentNote] = useState<Note | null>(
    notes.length > 0 ? notes[0] : null
  );
  
  const [isListening, setIsListening] = useState(false);
  const recognitionRef = useRef<any>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    // Initialize speech recognition
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = true;
      recognitionRef.current.interimResults = true;
      recognitionRef.current.lang = 'en-US';

      recognitionRef.current.onresult = (event: any) => {
        let finalTranscript = '';
        let interimTranscript = '';

        for (let i = event.resultIndex; i < event.results.length; i++) {
          const transcript = event.results[i][0].transcript;
          if (event.results[i].isFinal) {
            finalTranscript += transcript + ' ';
          } else {
            interimTranscript += transcript;
          }
        }

        if (finalTranscript && currentNote) {
          setCurrentNote({
            ...currentNote,
            content: currentNote.content + finalTranscript,
          });
        }
      };

      recognitionRef.current.onerror = () => {
        setIsListening(false);
      };

      recognitionRef.current.onend = () => {
        setIsListening(false);
      };
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, [currentNote]);

  useEffect(() => {
    localStorage.setItem('seniorNotes', JSON.stringify(notes));
  }, [notes]);

  const createNewNote = () => {
    const newNote: Note = {
      id: Date.now().toString(),
      title: 'New Note',
      content: '',
      lastEdited: new Date().toLocaleString(),
    };
    setNotes([newNote, ...notes]);
    setCurrentNote(newNote);
  };

  const updateCurrentNote = (updates: Partial<Note>) => {
    if (!currentNote) return;

    const updatedNote = {
      ...currentNote,
      ...updates,
      lastEdited: new Date().toLocaleString(),
    };

    setCurrentNote(updatedNote);
    setNotes(notes.map(note => 
      note.id === currentNote.id ? updatedNote : note
    ));
  };

  const deleteNote = (id: string) => {
    const filteredNotes = notes.filter(note => note.id !== id);
    setNotes(filteredNotes);
    
    if (currentNote?.id === id) {
      setCurrentNote(filteredNotes.length > 0 ? filteredNotes[0] : null);
    }
  };

  const toggleVoiceInput = () => {
    if (!recognitionRef.current) {
      alert('Voice input is not supported in this browser');
      return;
    }

    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    } else {
      if (!currentNote) {
        createNewNote();
      }
      recognitionRef.current.start();
      setIsListening(true);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-teal-50 p-4 sm:p-6">
      <div className="max-w-6xl mx-auto">
        <Navigation />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Notes List Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2">
                  <BookOpen className="w-8 h-8 text-green-500" />
                  <h2 className="text-2xl text-gray-800">My Notes</h2>
                </div>
              </div>

              <Button
                onClick={createNewNote}
                className="w-full h-14 text-lg bg-green-500 hover:bg-green-600 mb-4"
              >
                <Plus className="w-6 h-6 mr-2" />
                New Note
              </Button>

              <div className="space-y-3">
                {notes.length === 0 ? (
                  <div className="text-center py-8">
                    <Edit3 className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                    <p className="text-lg text-gray-500">No notes yet</p>
                    <p className="text-sm text-gray-400">Click "New Note" to start</p>
                  </div>
                ) : (
                  notes.map((note) => (
                    <div
                      key={note.id}
                      onClick={() => setCurrentNote(note)}
                      className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${
                        currentNote?.id === note.id
                          ? 'border-green-500 bg-green-50'
                          : 'border-gray-200 hover:border-green-300 bg-white'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex-1 min-w-0">
                          <p className="text-lg text-gray-800 truncate">
                            {note.title}
                          </p>
                          <p className="text-sm text-gray-500 mt-1">
                            {note.lastEdited}
                          </p>
                          <p className="text-sm text-gray-600 mt-2 line-clamp-2">
                            {note.content || 'Empty note'}
                          </p>
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={(e) => {
                            e.stopPropagation();
                            deleteNote(note.id);
                          }}
                          className="flex-shrink-0 hover:bg-red-50"
                        >
                          <Trash2 className="w-5 h-5 text-red-500" />
                        </Button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

          {/* Note Editor */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-lg p-6">
              {currentNote ? (
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <Input
                      value={currentNote.title}
                      onChange={(e) => updateCurrentNote({ title: e.target.value })}
                      className="text-2xl sm:text-3xl h-16 border-0 border-b-2 border-gray-200 rounded-none focus-visible:ring-0 focus-visible:border-green-500 px-0"
                      placeholder="Note Title"
                    />
                    <div className="flex gap-2 ml-4">
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={toggleVoiceInput}
                        className={`h-14 w-14 flex-shrink-0 ${isListening ? 'bg-red-50 border-red-300' : ''}`}
                      >
                        {isListening ? (
                          <MicOff className="w-6 h-6 text-red-500" />
                        ) : (
                          <Mic className="w-6 h-6 text-green-500" />
                        )}
                      </Button>
                    </div>
                  </div>

                  {isListening && (
                    <div className="bg-red-50 border-2 border-red-200 rounded-xl p-4">
                      <p className="text-lg text-red-700 text-center">
                        🎤 Recording... Speak to add text
                      </p>
                    </div>
                  )}

                  <div className="relative">
                    <Textarea
                      ref={textareaRef}
                      value={currentNote.content}
                      onChange={(e) => updateCurrentNote({ content: e.target.value })}
                      placeholder="Start writing your thoughts here..."
                      className="min-h-[500px] text-xl leading-relaxed resize-none border-2 focus-visible:ring-0 focus-visible:border-green-500"
                    />
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t-2 border-gray-100">
                    <p className="text-sm text-gray-500">
                      Last edited: {currentNote.lastEdited}
                    </p>
                    <div className="flex items-center gap-2 text-sm text-green-600">
                      <Save className="w-4 h-4" />
                      <span>Auto-saved</span>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-20">
                  <Edit3 className="w-20 h-20 text-gray-300 mb-6" />
                  <h3 className="text-2xl text-gray-600 mb-3">No note selected</h3>
                  <p className="text-lg text-gray-500 mb-6">
                    Create a new note or select one from the list
                  </p>
                  <Button
                    onClick={createNewNote}
                    className="h-16 text-xl px-8 bg-green-500 hover:bg-green-600"
                  >
                    <Plus className="w-6 h-6 mr-2" />
                    Create First Note
                  </Button>
                </div>
              )}
            </div>

            {/* Tips Card */}
            <div className="bg-gradient-to-br from-green-100 to-teal-100 rounded-2xl shadow-lg p-6 mt-6">
              <h3 className="text-xl text-gray-800 mb-3 flex items-center gap-2">
                <Mic className="w-6 h-6 text-green-600" />
                Voice Typing Tip
              </h3>
              <p className="text-lg text-gray-700">
                Click the microphone button to use voice typing. You can speak naturally, 
                and your words will be converted to text automatically. Perfect for longer notes!
              </p>
            </div>
          </div>
        </div>
      </div>
      <SupportFooter />
    </div>
  );
}