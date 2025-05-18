/*
Ce fichier implémente un simple EventBus pour permettre la communication entre composants qui ne sont pas directement liés (parent-enfant), comme la NavBar et la page Admin.

Ajouté pour résoudre le problème de synchronisation d'état entre la NavBar et la page Admin lors des changements de mode admin coloc.
Avant, quand on quittait le mode admin coloc depuis la page Admin,la NavBar ne se mettait pas à jour sans rechargement de page.
*/

type EventCallback = (...args: any[]) => void;

class EventBus {
  private events: Record<string, EventCallback[]> = {};

  public on(event: string, callback: EventCallback) {
    if (!this.events[event]) {
      this.events[event] = [];
    }
    this.events[event].push(callback);
  }

  public off(event: string, callback: EventCallback) {
    if (this.events[event]) {
      this.events[event] = this.events[event].filter(cb => cb !== callback);
    }
  }

  public emit(event: string, ...args: any[]) {
    if (this.events[event]) {
      this.events[event].forEach(callback => callback(...args));
    }
  }
}

export const eventBus = new EventBus();