import type { ComponentType } from "react";
import { ExecutiveTemplate } from "./ExecutiveTemplate";
import { OperationsTemplate } from "./OperationsTemplate";

export interface RegisteredTemplate {
  id: string;
  name: string;
  component: ComponentType<any>;
}

export class TemplateRegistry {
  private templates: Map<string, RegisteredTemplate> = new Map();

  constructor() {
    this.register({ id: "executive", name: "Executive Overview", component: ExecutiveTemplate });
    this.register({ id: "operations", name: "Operations Command", component: OperationsTemplate });
  }

  public register(template: RegisteredTemplate): void {
    this.templates.set(template.id, template);
  }

  public get(id: string): RegisteredTemplate | undefined {
    return this.templates.get(id);
  }

  public getAll(): RegisteredTemplate[] {
    return Array.from(this.templates.values());
  }
}

export const globalTemplateRegistry = new TemplateRegistry();
