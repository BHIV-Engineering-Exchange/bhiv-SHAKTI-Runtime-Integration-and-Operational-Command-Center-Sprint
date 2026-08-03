export interface HealthResponse {
  status: string;
  version: string;
}

export interface Project {
  id: string;
  name: string;
  description?: string;
  created_at: string;
}

export interface Milestone {
  id: string;
  name: string;
  project_id: string;
  description?: string;
  status: string;
}

export interface Task {
  id: string;
  name: string;
  project_id: string;
  milestone_id?: string;
  description?: string;
  dependencies: string[];
  state: string;
  created_at: string;
  updated_at: string;
}

export interface Assignment {
  id: string;
  task_id: string;
  resource_id: string;
  assigned_at: string;
}
