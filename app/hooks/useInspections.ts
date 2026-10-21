"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  fetchInspections,
  fetchInspection,
  createInspection,
  updateInspection,
  deleteInspection,
} from "@/app/utils/api";
import toast from "react-hot-toast";

interface InspectionFilters {
  car?: string;
  type?: "video" | "image";
  limit?: number;
  page?: number;
}

/** Published inspection media for the homepage strip and car pages. */
export function useInspections(filters?: InspectionFilters) {
  return useQuery({
    queryKey: ["inspections", filters],
    queryFn: () => fetchInspections(filters),
  });
}

export function useInspection(id: string) {
  return useQuery({
    queryKey: ["inspection", id],
    queryFn: () => fetchInspection(id),
    enabled: !!id,
  });
}

export function useCreateInspection() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createInspection,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["inspections"] });
      toast.success("Inspection media added");
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });
}

export function useUpdateInspection() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: unknown }) =>
      updateInspection(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["inspections"] });
      queryClient.invalidateQueries({ queryKey: ["inspection", variables.id] });
      toast.success("Inspection media updated");
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });
}

export function useDeleteInspection() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteInspection,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["inspections"] });
      toast.success("Inspection media deleted");
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });
}
