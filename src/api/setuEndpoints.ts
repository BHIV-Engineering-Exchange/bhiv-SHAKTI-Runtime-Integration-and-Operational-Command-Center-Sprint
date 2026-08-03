import axios from "axios";
import type {
  HealthResponse,
  Project,
  Milestone,
  Task,
  Assignment,
} from "@/types/setu";

const SETU_BASE_URL = import.meta.env.VITE_SETU_URL || "http://localhost:8000";

export const setuClient = axios.create({
  baseURL: `${SETU_BASE_URL.replace(/\/$/, "")}/api/v1`,
  timeout: 10000,
  headers: { "Content-Type": "application/json" },
});

export async function getHealth(): Promise<HealthResponse> {
  const { data } = await setuClient.get<HealthResponse>("/health");
  return data;
}

export async function getReady(): Promise<HealthResponse> {
  const { data } = await setuClient.get<HealthResponse>("/ready");
  return data;
}

export async function getProjects(): Promise<Project[]> {
  const { data } = await setuClient.get<Project[]>("/projects");
  return data;
}

export async function getProject(projectId: string): Promise<Project> {
  const { data } = await setuClient.get<Project>(`/projects/${projectId}`);
  return data;
}

export async function getProjectMilestones(projectId: string): Promise<Milestone[]> {
  const { data } = await setuClient.get<Milestone[]>(`/projects/${projectId}/milestones`);
  return data;
}

export async function getTask(taskId: string): Promise<Task> {
  const { data } = await setuClient.get<Task>(`/tasks/${taskId}`);
  return data;
}

export async function getTaskAssignments(taskId: string): Promise<Assignment[]> {
  const { data } = await setuClient.get<Assignment[]>(`/tasks/${taskId}/assignments`);
  return data;
}
