import React, { useState, useEffect } from 'react';
import { Bell, Plus, CheckCircle2, Circle, Trash2 } from 'lucide-react';
import { useStore } from '../js/store/useStore';

/**
 * RemindersView (v4.0.0) - React Edition
 * Gestor de avisos y tareas con interfaz táctil fluida.
 */
export default function RemindersView() {
  const [tasks, setTasks] = useState([]);
  const [input, setInput] = useState('');

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem('mqa_reminders') || '[]');
    setTasks(stored);
  }, []);

  const addTask = () => {
    if (!input.trim()) return;
    const newTask = {
      id: Date.now(),
      text: input.trim(),
      completed: false,
      date: new Date().toISOString()
    };
    const updated = [...tasks, newTask];
    setTasks(updated);
    save(updated);
    setInput('');
    if (window.navigator?.vibrate) window.navigator.vibrate(10);
  };

  const toggleTask = (id) => {
    const updated = tasks.map(t => t.id === id ? { ...t, completed: !t.completed } : t);
    setTasks(updated);
    save(updated);
    if (window.navigator?.vibrate) window.navigator.vibrate([5, 10]);
  };

  const removeTask = (id) => {
    const updated = tasks.filter(t => t.id !== id);
    setTasks(updated);
    save(updated);
  };

  const save = (data) => {
    localStorage.setItem('mqa_reminders', JSON.stringify(data));
  };

  return (
    <div className="flex flex-col gap-6 animate-in fade-in slide-in-from-bottom-5 duration-700">
      <header className="space-y-1">
        <h1 className="text-2xl font-bold text-white flex items-center gap-3">
          Próximos Avisos <Bell className="text-primary" size={24} />
        </h1>
        <p className="text-xs text-neutral-500 font-bold uppercase tracking-widest pl-1">Organización Neuronal</p>
      </header>

      <div className="bg-white/5 backdrop-blur-[20px] border border-white/10 rounded-[28px] p-2 pr-6 flex items-center gap-2">
        <input 
          type="text" 
          className="flex-1 bg-transparent border-none px-6 py-4 text-white focus:outline-none placeholder:text-neutral-600 font-medium"
          placeholder="¿Qué debo recordarte?"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && addTask()}
        />
        <button 
          onClick={addTask}
          className="bg-primary p-3 rounded-2xl text-black shadow-lg shadow-primary/20 hover:brightness-110 active:scale-90 transition-all"
        >
          <Plus size={24} />
        </button>
      </div>

      <div className="space-y-4">
        {tasks.length > 0 ? (
          <div className="grid gap-3">
            {tasks.map(task => (
              <div 
                key={task.id}
                onClick={() => toggleTask(task.id)}
                className={`bg-white/5 backdrop-blur-[20px] border border-white/10 rounded-[24px] p-5 flex items-center gap-4 transition-all active:scale-[0.98] cursor-pointer ${task.completed ? 'opacity-40 grayscale-[0.5]' : ''}`}
              >
                <div className="flex-shrink-0">
                  {task.completed ? <CheckCircle2 className="text-primary" /> : <Circle className="text-neutral-600" />}
                </div>
                <span className={`flex-1 text-[15px] font-medium text-white ${task.completed ? 'line-through decoration-primary/50' : ''}`}>
                  {task.text}
                </span>
                <button 
                  onClick={(e) => { e.stopPropagation(); removeTask(task.id); }}
                  className="p-2 text-neutral-600 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white/2 backdrop-blur-md rounded-[32px] border border-white/5 border-dashed p-12 flex flex-col items-center justify-center gap-4">
            <Bell size={40} className="text-neutral-800" />
            <p className="text-sm text-neutral-600 font-medium text-center">No tienes avisos pendientes.<br/>Disfruta la calma.</p>
          </div>
        )}
      </div>
    </div>
  );
}
