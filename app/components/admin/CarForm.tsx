"use client";

import { useState } from "react";
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
import { ArrowLeft, Save } from "lucide-react";
import Link from "next/link";

interface CarFormProps {
  car?: Car;
  mode?: "create" | "edit";
}

export function CarForm({ car, mode = "create" }: CarFormProps) {
  const router = useRouter();
  const [uploadedImages, setUploadedImages] = useState<string[]>(car?.images || []);

  const createCar = useCreateCar();
  const updateCar = useUpdateCar();

  const {
    register,
    handleSubmit,
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
          engineSize: car.engineSize,
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
          status: "available",
          condition: "foreign-used",
          bodyType: "suv",
          drivetrain: "awd",
          customsPaid: true,
          featured: false,
          year: new Date().getFullYear(),
          mileage: 0,
          features: "",
        },
  });

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
            router.push("/admin/cars");
          },
        }
      );
    } else {
      createCar.mutate(payload, {
        onSuccess: () => {
          router.push("/admin/cars");
        },
      });
    }
  };

  const isSubmitting = createCar.isPending || updateCar.isPending;

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
      {/* Header */}
      <div className="flex items-center text-black justify-between">
        <div className="flex items-center gap-4">
          <Link
            href="/admin/cars"
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-dark-600" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-dark-900">
              {mode === "edit" ? "Edit Vehicle Listing" : "Add New Vehicle"}
            </h1>
            <p className="text-sm text-dark-500">
              {mode === "edit" ? "Update vehicle specifications, pricing, and status" : "Fill in the details to publish a new vehicle to the showroom"}
            </p>
          </div>
        </div>
        <Button
          type="submit"
          isLoading={isSubmitting}
          leftIcon={<Save className="w-4 h-4" />}
        >
          {mode === "edit" ? "Update Listing" : "Publish Vehicle"}
        </Button>
      </div>

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
