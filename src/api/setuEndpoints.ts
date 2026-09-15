import axios from "axios";
import type {
  HealthResponse,
  Project,
  Milestone,
  Task,
  Assignment,
} from "@/types/setu";

const SETU_BASE_URL = import.meta.env.VITE_SETU_URL || "";

export const setuClient = axios.create({
  baseURL: SETU_BASE_URL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
    "ngrok-skip-browser-warning": "true"
  },
});

export async function getHealth(): Promise<HealthResponse> {
  try {
    const { data } = await setuClient.get<HealthResponse>("/api/setu/health");
    return data;
  } catch {
    try {
      const { data } = await setuClient.get<HealthResponse>("/api/health");
      return data;
    } catch {
      const { data } = await setuClient.get<HealthResponse>("/health");
      return data;
    }
  }
}

export async function getProjects(): Promise<Project[]> {
  try {
    let data;
    try {
      const res = await setuClient.get<any>("/api/setu/projects");
      data = res.data;
    } catch {
      const res = await setuClient.get<any>("/projects");
      data = res.data;
    }
    if (Array.isArray(data)) return data;
    if (Array.isArray(data?.projects)) return data.projects;
    if (Array.isArray(data?.data)) return data.data;
    return [];
  } catch {
    return [];
  }
}

export async function getProject(projectId: string): Promise<Project> {
  try {
    const { data } = await setuClient.get<Project>(`/api/setu/projects/${projectId}`);
    return data;
  } catch {
    const { data } = await setuClient.get<Project>(`/projects/${projectId}`);
    return data;
  }
}

export async function getProjectMilestones(projectId: string): Promise<Milestone[]> {
  try {
    let data;
    try {
      const res = await setuClient.get<any>(`/api/setu/projects/${projectId}/milestones`);
      data = res.data;
    } catch {
      const res = await setuClient.get<any>(`/projects/${projectId}/milestones`);
      data = res.data;
    }
    if (Array.isArray(data)) return data;
    if (Array.isArray(data?.milestones)) return data.milestones;
    if (Array.isArray(data?.data)) return data.data;
    return [];
  } catch {
    return [];
  }
}

export async function getTask(taskId: string): Promise<Task> {
  try {
    const { data } = await setuClient.get<Task>(`/api/setu/tasks/${taskId}`);
    return data;
  } catch {
    const { data } = await setuClient.get<Task>(`/tasks/${taskId}`);
    return data;
  }
}

export async function getTaskAssignments(taskId: string): Promise<Assignment[]> {
  try {
    let data;
    try {
      const res = await setuClient.get<any>(`/api/setu/tasks/${taskId}/assignments`);
      data = res.data;
    } catch {
      const res = await setuClient.get<any>(`/tasks/${taskId}/assignments`);
      data = res.data;
    }
    if (Array.isArray(data)) return data;
    if (Array.isArray(data?.assignments)) return data.assignments;
    if (Array.isArray(data?.data)) return data.data;
    return [];
  } catch {
    return [];
  }
}

