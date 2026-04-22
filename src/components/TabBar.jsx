import React from 'react';
import { LayoutDashboard, Activity, Bell, BookOpen, MessageSquare } from 'lucide-react';
import { useStore } from '../js/store/useStore';

/**
 * TabBar (v4.0.0) - React Edition
 * Navegación inferior principal.
 */
export default function TabBar() {
  const { activeView, setView } = useStore();

  const tabs = [
    { id: 'inicio', label: 'Inicio', icon: LayoutDashboard },
    { id: 'ejercicio', label: 'Salud', icon: Activity },
    { id: 'avisos', label: 'Avisos', icon: Bell },
    { id: 'diario', label: 'Diario', icon: BookOpen },
    { id: 'mensajes', label: 'Conversar', icon: MessageSquare },
  ];

  return (
    <nav id="tab-bar">
      {tabs.map((tab) => {
        const Icon = tab.icon;
        const isActive = activeView === tab.id;
        return (
          <button
            key={tab.id}
            className={`tab-item ${isActive ? 'active' : ''}`}
            onClick={() => setView(tab.id)}
            aria-label={tab.label}
          >
            <Icon className="icon" size={24} />
            <span className="label">{tab.label}</span>
          </button>
        );
      })}
    </nav>
  );
}
