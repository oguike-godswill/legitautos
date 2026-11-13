"use client";

import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { CarFormData, CarFormInput, carFormSchema } from "@/app/types/car-form";
import { Input } from "@/app/components/ui/Input";
import { Select } from "@/app/components/ui/Select";
import { Textarea } from "@/app/components/ui/Textarea";
import { Checkbox } from "@/app/components/ui/Checkbox";
import { Button } from "@/app/components/ui/Button";
import { ImageUploader } from "./ImageUploader";
import { useCreateCar, useUpdateCar } from "@/app/hooks/useCars";
import { Car } from "@/app/types";
import {
  ArrowLeft,
  Save,
  FileEdit,
  RotateCcw,
  Trash2,
  Clock,
  CheckCircle2,
} from "lucide-react";
import Link from "next/link";

interface CarFormProps {
  car?: Car;
  mode?: "create" | "edit";
}

const LOCAL_CAR_DRAFT_KEY = "legitautos:car-draft:new";

interface StoredCarDraft {
  values: Partial<CarFormInput>;
  images: string[];
  savedAt: string;
}

export function CarForm({ car, mode = "create" }: CarFormProps) {
  const router = useRouter();
  const [uploadedImages, setUploadedImages] = useState<string[]>(car?.images || []);
  const [pendingLocalDraft, setPendingLocalDraft] = useState<StoredCarDraft | null>(null);
  const [lastAutoSavedAt, setLastAutoSavedAt] = useState<string | null>(null);
  const [savingDraft, setSavingDraft] = useState(false);
  const skipNextAutoSave = useRef(true);

  const createCar = useCreateCar();
  const updateCar = useUpdateCar();

  const {
    register,
    handleSubmit,
    watch,
    reset,
    setValue,
    getValues,
    formState: { errors },
  } = useForm<CarFormInput, unknown, CarFormData>({
    resolver: zodResolver(carFormSchema),
    defaultValues: car
      ? {
          title: car.title,
          brand: car.brand,
          model: car.model,
          trim: car.trim || "",
          year: car.year,
          price: car.price,
          originalPrice: car.originalPrice,
          mileage: car.mileage,
          transmission: car.transmission,
          fuelType: car.fuelType,
          bodyType: car.bodyType || "suv",
          drivetrain: car.drivetrain || "awd",
          engineSize: car.engineSize || "",
          color: car.color,
          interiorColor: car.interiorColor || "",
          condition: car.condition,
          customsPaid: car.customsPaid ?? true,
          description: car.description || "",
          features: (car.features || []).join(", "),
          location: car.location || "Lagos, Nigeria",
          status: car.status,
          featured: car.featured,
        }
      : {
          title: "",
          brand: "",
          model: "",
          trim: "",
          color: "",
          description: "",
          location: "Lagos, Nigeria",
          status: "available",
          condition: "foreign-used",
          transmission: "automatic",
          fuelType: "petrol",
          bodyType: "suv",
          drivetrain: "awd",
          customsPaid: true,
          featured: false,
          year: new Date().getFullYear(),
          mileage: 0,
          features: "",
        },
  });

  const currentStatus = watch("status");
  const watchedValues = watch();

  // Check for an existing unsaved local draft in create mode
  useEffect(() => {
    if (mode !== "create") return;
    try {
      const raw = localStorage.getItem(LOCAL_CAR_DRAFT_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as StoredCarDraft;
        const hasContent =
          Boolean(parsed?.values?.title?.trim()) ||
          Boolean(parsed?.values?.brand?.trim()) ||
          Boolean(parsed?.values?.model?.trim()) ||
          Boolean(parsed?.values?.description?.trim()) ||
          (parsed?.images?.length ?? 0) > 0;
        if (hasContent) {
          setPendingLocalDraft(parsed);
        }
      }
    } catch {
      // ignore invalid storage
    } finally {
      skipNextAutoSave.current = false;
    }
  }, [mode]);

  // Auto-save form changes to localStorage in create mode
  useEffect(() => {
    if (mode !== "create" || skipNextAutoSave.current) return;
    const hasContent =
      Boolean(watchedValues.title?.trim()) ||
      Boolean(watchedValues.brand?.trim()) ||
      Boolean(watchedValues.model?.trim()) ||
      Boolean(watchedValues.description?.trim()) ||
      uploadedImages.length > 0;

    if (!hasContent) return;

    const timer = setTimeout(() => {
      try {
        const now = new Date().toISOString();
        const payload: StoredCarDraft = {
          values: watchedValues,
          images: uploadedImages,
          savedAt: now,
        };
        localStorage.setItem(LOCAL_CAR_DRAFT_KEY, JSON.stringify(payload));
        setLastAutoSavedAt(
          new Date(now).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
        );
      } catch {
        // ignore storage quota errors
      }
    }, 600);

    return () => clearTimeout(timer);
  }, [mode, watchedValues, uploadedImages]);

  const handleRestoreLocalDraft = () => {
    if (!pendingLocalDraft) return;
    skipNextAutoSave.current = true;
    reset({
      ...getValues(),
      ...pendingLocalDraft.values,
    });
    if (pendingLocalDraft.images) {
      setUploadedImages(pendingLocalDraft.images);
    }
    setPendingLocalDraft(null);
    setTimeout(() => {
      skipNextAutoSave.current = false;
    }, 100);
  };

  const handleDiscardLocalDraft = () => {
    try {
      localStorage.removeItem(LOCAL_CAR_DRAFT_KEY);
    } catch {
      // ignore
    }
    setPendingLocalDraft(null);
  };

  const clearLocalDraft = () => {
    if (mode === "create") {
      try {
        localStorage.removeItem(LOCAL_CAR_DRAFT_KEY);
      } catch {
        // ignore
      }
    }
  };

  const onSubmit = async (data: CarFormData) => {
    const payload = {
      ...data,
      images: uploadedImages,
    };

    if (mode === "edit" && car) {
      updateCar.mutate(
        { id: car._id, data: payload },
        {
          onSuccess: () => {
            clearLocalDraft();
            router.push("/admin/cars");
          },
        }
      );
    } else {
      createCar.mutate(payload, {
        onSuccess: () => {
          clearLocalDraft();
          router.push("/admin/cars");
        },
      });
    }
  };

  const handleSaveAsDraft = () => {
    setSavingDraft(true);
    const raw = getValues();
    const parsed = carFormSchema.safeParse({ ...raw, status: "draft" });
    const data = parsed.success
      ? parsed.data
      : {
          title: raw.title || "Untitled Vehicle Draft",
          brand: raw.brand || "",
          model: raw.model || "",
          trim: raw.trim || "",
          year: Number(raw.year) || new Date().getFullYear(),
          price: Number(raw.price) || 0,
          originalPrice: raw.originalPrice ? Number(raw.originalPrice) : undefined,
          mileage: Number(raw.mileage) || 0,
          transmission: raw.transmission || "automatic",
          fuelType: raw.fuelType || "petrol",
          bodyType: raw.bodyType || "",
          drivetrain: raw.drivetrain || "",
          engineSize: raw.engineSize || "",
          color: raw.color || "",
          interiorColor: raw.interiorColor || "",
          condition: raw.condition || "foreign-used",
          customsPaid: raw.customsPaid ?? true,
          description: raw.description || "",
          features:
            typeof raw.features === "string"
              ? raw.features.split(",").map((f) => f.trim()).filter(Boolean)
              : [],
          location: raw.location || "Lagos, Nigeria",
          status: "draft" as const,
          featured: Boolean(raw.featured),
        };

    const payload = {
      ...data,
      status: "draft" as const,
      images: uploadedImages,
    };

    if (mode === "edit" && car) {
      updateCar.mutate(
        { id: car._id, data: payload },
        {
          onSuccess: () => {
            clearLocalDraft();
            router.push("/admin/cars");
          },
          onSettled: () => setSavingDraft(false),
        }
      );
    } else {
      createCar.mutate(payload, {
        onSuccess: () => {
          clearLocalDraft();
          router.push("/admin/cars");
        },
        onSettled: () => setSavingDraft(false),
      });
    }
  };

  const handlePublishClick = () => {
    if (currentStatus === "draft") {
      setValue("status", "available", { shouldDirty: true });
    }
  };

  const isSubmitting = createCar.isPending || updateCar.isPending;

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 text-black">
        <div className="flex items-center gap-4">
          <Link
            href="/admin/cars"
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-dark-600" />
          </Link>
          <div>
            <div className="flex items-center gap-2.5">
              <h1 className="text-2xl font-bold text-dark-900">
                {mode === "edit" ? "Edit Vehicle Listing" : "Add New Vehicle"}
              </h1>
              {currentStatus === "draft" && (
                <span className="inline-flex items-center gap-1 rounded-full bg-amber-100 px-2.5 py-0.5 text-xs font-bold text-amber-800">
                  <FileEdit className="h-3 w-3" />
                  Draft
                </span>
              )}
            </div>
            <p className="text-sm text-dark-500 flex items-center gap-2">
              <span>
                {mode === "edit"
                  ? "Update vehicle specifications, pricing, and status"
                  : "Fill in the details to publish or save as draft to finish later"}
              </span>
              {lastAutoSavedAt && (
                <span className="inline-flex items-center gap-1 text-xs text-emerald-600 font-medium">
                  <Clock className="h-3 w-3" />
                  Auto-saved {lastAutoSavedAt}
                </span>
              )}
            </p>
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-2.5">
          <Button
            type="button"
            variant="outline"
            onClick={handleSaveAsDraft}
            isLoading={isSubmitting && savingDraft}
            disabled={isSubmitting}
            leftIcon={<FileEdit className="w-4 h-4" />}
          >
            Save as Draft
          </Button>
          <Button
            type="submit"
            onClick={handlePublishClick}
            isLoading={isSubmitting && !savingDraft}
            disabled={isSubmitting}
            leftIcon={
              currentStatus === "draft" ? (
                <CheckCircle2 className="w-4 h-4" />
              ) : (
                <Save className="w-4 h-4" />
              )
            }
          >
            {mode === "edit"
              ? currentStatus === "draft"
                ? "Publish Vehicle"
                : "Update Listing"
              : "Publish Vehicle"}
          </Button>
        </div>
      </div>

      {/* Unsaved Local Draft Recovery Banner */}
      {pendingLocalDraft && (
        <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
          <div className="flex items-center gap-2.5">
            <Clock className="h-4 w-4 shrink-0 text-amber-600" />
            <span>
              You have an unsaved local draft
              {pendingLocalDraft.values?.title
                ? ` ("${pendingLocalDraft.values.title}")`
                : ""}{" "}
              from{" "}
              {new Date(pendingLocalDraft.savedAt).toLocaleString([], {
                month: "short",
                day: "numeric",
                hour: "2-digit",
                minute: "2-digit",
              })}
              .
            </span>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleRestoreLocalDraft}
              className="inline-flex items-center gap-1.5 rounded-lg bg-amber-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-amber-700 transition-colors cursor-pointer"
            >
              <RotateCcw className="h-3.5 w-3.5" />
              Restore Draft
            </button>
            <button
              type="button"
              onClick={handleDiscardLocalDraft}
              className="inline-flex items-center gap-1 rounded-lg border border-amber-300 bg-white px-3 py-1.5 text-xs font-semibold text-amber-800 hover:bg-amber-100 transition-colors cursor-pointer"
            >
              <Trash2 className="h-3.5 w-3.5" />
              Discard
            </button>
          </div>
        </div>
      )}

      {/* Server Draft Notice */}
      {mode === "edit" && car?.status === "draft" && (
        <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-amber-200 bg-amber-50/70 px-4 py-3 text-sm text-amber-900">
          <div className="flex items-center gap-2">
            <FileEdit className="h-4 w-4 shrink-0 text-amber-600" />
            <span>
              This listing is currently a <strong>Draft</strong> and is hidden from public buyers. Complete the required fields and click <strong>Publish Vehicle</strong> when ready.
            </span>
          </div>
        </div>
      )}

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Basic Info */}
          <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-5">
            <h2 className="text-lg font-semibold text-dark-900">Vehicle Identity</h2>
            <div className="grid sm:grid-cols-2 gap-4">
              <Input
                label="Listing Title"
                placeholder="e.g., 2021 Lexus RX 350 F-Sport"
                error={errors.title?.message}
                {...register("title")}
              />
              <Input
                label="Brand / Make"
                placeholder="e.g., Lexus"
                error={errors.brand?.message}
                {...register("brand")}
              />
              <Input
                label="Model"
                placeholder="e.g., RX 350"
                error={errors.model?.message}
                {...register("model")}
              />
              <Input
                label="Trim / Edition (optional)"
                placeholder="e.g., F-Sport, AMG Line, XSE"
                error={errors.trim?.message}
                {...register("trim")}
              />
              <Input
                label="Year"
                type="number"
                error={errors.year?.message}
                {...register("year")}
              />
              <Select
                label="Body Type"
                error={errors.bodyType?.message}
                options={[
                  { value: "suv", label: "SUV / Crossover" },
                  { value: "sedan", label: "Executive Sedan" },
                  { value: "pickup", label: "Pickup / Truck" },
                  { value: "coupe", label: "Coupe / Performance" },
                  { value: "hatchback", label: "Hatchback" },
                  { value: "van", label: "Bus / Van / MPV" },
                  { value: "convertible", label: "Convertible" },
                  { value: "wagon", label: "Wagon" },
                ]}
                {...register("bodyType")}
              />
              <Input
                label="Exterior Color"
                placeholder="e.g., Obsidian Black"
                error={errors.color?.message}
                {...register("color")}
              />
              <Input
                label="Interior Color (optional)"
                placeholder="e.g., Rioja Red Leather"
                error={errors.interiorColor?.message}
                {...register("interiorColor")}
              />
            </div>
          </div>

          {/* Pricing */}
          <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-5">
            <h2 className="text-lg font-semibold text-dark-900">Pricing (Naira)</h2>
            <div className="grid sm:grid-cols-2 gap-4">
              <Input
                label="Asking Price (₦)"
                type="number"
                placeholder="e.g., 28500000"
                error={errors.price?.message}
                {...register("price")}
              />
              <Input
                label="Previous Price (₦ - optional for Price Drop badge)"
                type="number"
                placeholder="e.g., 31000000"
                error={errors.originalPrice?.message}
                {...register("originalPrice")}
              />
            </div>
          </div>

          {/* Specifications */}
          <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-5">
            <h2 className="text-lg font-semibold text-dark-900">Mechanical Specifications &amp; Origin</h2>
            <div className="grid sm:grid-cols-2 gap-4">
              <Select
                label="Vehicle Condition / Origin"
                error={errors.condition?.message}
                options={[
                  { value: "", label: "Select condition" },
                  { value: "foreign-used", label: "Foreign Used (Tokunbo)" },
                  { value: "new", label: "Brand New" },
                  { value: "nigerian-used", label: "Nigerian Used" },
                  { value: "certified", label: "Certified Pre-Owned" },
                  { value: "used", label: "Used" },
                ]}
                {...register("condition")}
              />
              <Input
                label="Mileage (km)"
                type="number"
                error={errors.mileage?.message}
                {...register("mileage")}
              />
              <Select
                label="Transmission"
                error={errors.transmission?.message}
                options={[
                  { value: "", label: "Select transmission" },
                  { value: "automatic", label: "Automatic" },
                  { value: "manual", label: "Manual" },
                  { value: "cvt", label: "CVT" },
                ]}
                {...register("transmission")}
              />
              <Select
                label="Fuel / Powertrain"
                error={errors.fuelType?.message}
                options={[
                  { value: "", label: "Select fuel type" },
                  { value: "petrol", label: "Petrol" },
                  { value: "hybrid", label: "Hybrid" },
                  { value: "diesel", label: "Diesel" },
                  { value: "electric", label: "Electric" },
                ]}
                {...register("fuelType")}
              />
              <Input
                label="Engine Size"
                placeholder="e.g., 3.5L V6"
                error={errors.engineSize?.message}
                {...register("engineSize")}
              />
              <Select
                label="Drivetrain"
                error={errors.drivetrain?.message}
                options={[
                  { value: "awd", label: "AWD (All-Wheel Drive)" },
                  { value: "4wd", label: "4WD / 4x4" },
                  { value: "fwd", label: "FWD (Front-Wheel Drive)" },
                  { value: "rwd", label: "RWD (Rear-Wheel Drive)" },
                ]}
                {...register("drivetrain")}
              />
            </div>
          </div>

          {/* Description */}
          <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-5">
            <h2 className="text-lg font-semibold text-dark-900">Showroom Notes &amp; Features</h2>
            <Textarea
              label="Vehicle Description"
              placeholder="Describe vehicle history, condition, trim highlights, and inspection notes..."
              rows={5}
              error={errors.description?.message}
              {...register("description")}
            />
            <Input
              label="Key Features (comma separated)"
              placeholder="e.g., Panoramic Roof, 360 Camera, Apple CarPlay, Ventilated Leather Seats, Blind Spot Monitor"
              helperText="Separate features with commas"
              error={errors.features?.message}
              {...register("features")}
            />
          </div>

          {/* Images */}
          <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-5">
            <h2 className="text-lg font-semibold text-dark-900">Showroom Photography</h2>
            <ImageUploader
              images={uploadedImages}
              onImagesChange={setUploadedImages}
            />
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Location */}
          <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-5">
            <h2 className="text-lg font-semibold text-dark-900">Showroom Location</h2>
            <Input
              label="Location"
              placeholder="e.g., Lagos, Nigeria"
              error={errors.location?.message}
              {...register("location")}
            />
          </div>

          {/* Settings */}
          <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-5">
            <h2 className="text-lg font-semibold text-dark-900">Listing Status &amp; Verification</h2>
            <div className="space-y-4">
              <Select
                label="Availability Status"
                options={[
                  { value: "available", label: "Available" },
                  { value: "reserved", label: "Reserved" },
                  { value: "sold", label: "Sold" },
                  { value: "draft", label: "Draft (Hidden from public)" },
                ]}
                {...register("status")}
              />
              <Checkbox
                label="Featured on Homepage Spotlight"
                {...register("featured")}
              />
              <Checkbox
                label="Full Customs Duty Verified"
                {...register("customsPaid")}
              />
            </div>
          </div>
        </div>
      </div>
    </form>
  );
}
