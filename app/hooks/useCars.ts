"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  fetchCars,
  fetchCar,
  fetchFeaturedCars,
  fetchBrands,
  fetchSimilarCars,
  createCar,
  updateCar,
  deleteCar,
} from "@/app/utils/api";
import { CarFilters } from "@/app/types";
import toast from "react-hot-toast";

export function useCars(filters?: CarFilters) {
  return useQuery({
    queryKey: ["cars", filters],
    queryFn: () => fetchCars(filters),
  });
}

export function useCar(id: string) {
  return useQuery({
    queryKey: ["car", id],
    queryFn: () => fetchCar(id),
    enabled: !!id,
  });
}

export function useFeaturedCars() {
  return useQuery({
    queryKey: ["featured-cars"],
    queryFn: fetchFeaturedCars,
  });
}

export function useBrands() {
  return useQuery({
    queryKey: ["brands"],
    queryFn: fetchBrands,
  });
}

export function useSimilarCars(id: string) {
  return useQuery({
    queryKey: ["similar-cars", id],
    queryFn: () => fetchSimilarCars(id),
    enabled: !!id,
  });
}

export function useCreateCar() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createCar,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cars"] });
      queryClient.invalidateQueries({ queryKey: ["featured-cars"] });
      toast.success("Car created successfully!");
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });
}

export function useUpdateCar() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: unknown }) => updateCar(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["cars"] });
      queryClient.invalidateQueries({ queryKey: ["car", variables.id] });
      queryClient.invalidateQueries({ queryKey: ["featured-cars"] });
      toast.success("Car updated successfully!");
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });
}

export function useDeleteCar() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteCar,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cars"] });
      queryClient.invalidateQueries({ queryKey: ["featured-cars"] });
      toast.success("Car deleted successfully!");
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });
}
