import type { ComponentType } from "react";

export interface RegisteredWidget {
  id: string;
  name: string;
  category: string;
  component: ComponentType<any>;
}

export class WidgetRegistry {
  private registry: Map<string, RegisteredWidget> = new Map();

  public register(widget: RegisteredWidget): void {
    this.registry.set(widget.id, widget);
  }

  public unregister(id: string): void {
    this.registry.delete(id);
  }

  public get(id: string): RegisteredWidget | undefined {
    return this.registry.get(id);
  }

  public getAll(): RegisteredWidget[] {
    return Array.from(this.registry.values());
  }

  public getByCategory(category: string): RegisteredWidget[] {
    return this.getAll().filter((w) => w.category === category);
  }
}

export const globalWidgetRegistry = new WidgetRegistry();
