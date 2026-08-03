import { useQuery, keepPreviousData } from "@tanstack/react-query";
import {
  getHealth,
  getReady,
  getProjects,
  getProject,
  getProjectMilestones,
  getTask,
  getTaskAssignments,
} from "@/api/setuEndpoints";

export const useSetuHealth = () =>
  useQuery({
    queryKey: ["setu-health"],
    queryFn: getHealth,
    refetchInterval: 10_000,
    placeholderData: keepPreviousData,
    retry: 1,
  });

export const useSetuReady = () =>
  useQuery({
    queryKey: ["setu-ready"],
    queryFn: getReady,
    refetchInterval: 10_000,
    placeholderData: keepPreviousData,
    retry: 1,
  });

export const useSetuProjects = () =>
  useQuery({
    queryKey: ["setu-projects"],
    queryFn: getProjects,
    refetchInterval: 10_000,
    placeholderData: keepPreviousData,
    retry: 1,
  });

export const useSetuProject = (projectId: string) =>
  useQuery({
    queryKey: ["setu-project", projectId],
    queryFn: () => getProject(projectId),
    refetchInterval: 10_000,
    placeholderData: keepPreviousData,
    enabled: !!projectId,
    retry: 1,
  });

export const useSetuProjectMilestones = (projectId: string) =>
  useQuery({
    queryKey: ["setu-project-milestones", projectId],
    queryFn: () => getProjectMilestones(projectId),
    refetchInterval: 10_000,
    placeholderData: keepPreviousData,
    enabled: !!projectId,
    retry: 1,
  });

export const useSetuTask = (taskId: string) =>
  useQuery({
    queryKey: ["setu-task", taskId],
    queryFn: () => getTask(taskId),
    refetchInterval: 10_000,
    placeholderData: keepPreviousData,
    enabled: !!taskId,
    retry: 1,
  });

export const useSetuTaskAssignments = (taskId: string) =>
  useQuery({
    queryKey: ["setu-task-assignments", taskId],
    queryFn: () => getTaskAssignments(taskId),
    refetchInterval: 10_000,
    placeholderData: keepPreviousData,
    enabled: !!taskId,
    retry: 1,
  });
