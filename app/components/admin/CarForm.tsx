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
    setValue,
    watch,
  } = useForm<CarFormInput, unknown, CarFormData>({
    resolver: zodResolver(carFormSchema),
    defaultValues: car
      ? {
          title: car.title,
          brand: car.brand,
          model: car.model,
          year: car.year,
          price: car.price,
          originalPrice: car.originalPrice,
          mileage: car.mileage,
          transmission: car.transmission,
          fuelType: car.fuelType,
          engineSize: car.engineSize,
          color: car.color,
          condition: car.condition,
          description: car.description,
          features: car.features.join(", "),
          location: car.location,
          sellerName: car.seller.name,
          sellerPhone: car.seller.phone,
          sellerWhatsapp: car.seller.whatsapp,
          sellerEmail: car.seller.email,
          status: car.status,
          featured: car.featured,
        }
      : {
          status: "available",
          featured: false,
          year: new Date().getFullYear(),
          mileage: 0,
          features: "", // empty string for new car

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
              {mode === "edit" ? "Edit Car" : "Add New Car"}
            </h1>
            <p className="text-sm text-dark-500">
              {mode === "edit" ? "Update car details" : "Fill in the details to list a new car"}
            </p>
          </div>
        </div>
        <Button
          type="submit"
          className=""
          isLoading={isSubmitting}
          leftIcon={<Save className="w-4 h-4" />}
        >
          {mode === "edit" ? "Update Car" : "Create Listing"}
        </Button>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Basic Info */}
          <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-5">
            <h2 className="text-lg font-semibold text-dark-900">Basic Information</h2>
            <div className="grid sm:grid-cols-2 gap-4">
              <Input
                label="Title"
                placeholder="e.g., Toyota Camry 2020 LE"
                error={errors.title?.message}
                {...register("title")}
              />
              <Input
                label="Brand"
                placeholder="e.g., Toyota"
                error={errors.brand?.message}
                {...register("brand")}
              />
              <Input
                label="Model"
                placeholder="e.g., Camry"
                error={errors.model?.message}
                {...register("model")}
              />
              <Input
                label="Year"
                type="number"
                error={errors.year?.message}
                {...register("year")}
              />
              <Input
                label="Color"
                placeholder="e.g., Silver Metallic"
                error={errors.color?.message}
                {...register("color")}
              />
              <Input
                label="Engine Size"
                placeholder="e.g., 2.5L"
                error={errors.engineSize?.message}
                {...register("engineSize")}
              />
            </div>
          </div>

          {/* Pricing */}
          <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-5">
            <h2 className="text-lg font-semibold text-dark-900">Pricing</h2>
            <div className="grid sm:grid-cols-2 gap-4">
              <Input
                label="Price (₦)"
                type="number"
                placeholder="e.g., 8500000"
                error={errors.price?.message}
                {...register("price")}
              />
              <Input
                label="Original Price (₦)"
                type="number"
                placeholder="e.g., 9500000"
                error={errors.originalPrice?.message}
                {...register("originalPrice")}
              />
            </div>
          </div>

          {/* Specifications */}
          <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-5">
            <h2 className="text-lg font-semibold text-dark-900">Specifications</h2>
            <div className="grid sm:grid-cols-2 gap-4">
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
                label="Fuel Type"
                error={errors.fuelType?.message}
                options={[
                  { value: "", label: "Select fuel type" },
                  { value: "petrol", label: "Petrol" },
                  { value: "diesel", label: "Diesel" },
                  { value: "hybrid", label: "Hybrid" },
                  { value: "electric", label: "Electric" },
                ]}
                {...register("fuelType")}
              />
              <Select
                label="Condition"
                error={errors.condition?.message}
                options={[
                  { value: "", label: "Select condition" },
                  { value: "new", label: "New" },
                  { value: "used", label: "Used" },
                  { value: "certified", label: "Certified Pre-Owned" },
                ]}
                {...register("condition")}
              />
            </div>
          </div>

          {/* Description */}
          <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-5">
            <h2 className="text-lg font-semibold text-dark-900">Description</h2>
            <Textarea
              label="Car Description"
              placeholder="Describe the car in detail..."
              rows={5}
              error={errors.description?.message}
              {...register("description")}
            />
            <Input
              label="Features (comma separated)"
              placeholder="e.g., Sunroof, Leather Seats, Backup Camera, Bluetooth"
              helperText="Separate features with commas"
              error={errors.features?.message}
              {...register("features")}
            />
          </div>

          {/* Images */}
          <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-5">
            <h2 className="text-lg font-semibold text-dark-900">Images</h2>
            <ImageUploader
              images={uploadedImages}
              onImagesChange={setUploadedImages}
            />
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Seller Info */}
          <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-5">
            <h2 className="text-lg font-semibold text-dark-900">Seller Information</h2>
            <div className="space-y-4">
              <Input
                label="Seller Name"
                error={errors.sellerName?.message}
                {...register("sellerName")}
              />
              <Input
                label="Phone Number"
                placeholder="+234..."
                error={errors.sellerPhone?.message}
                {...register("sellerPhone")}
              />
              <Input
                label="WhatsApp Number"
                placeholder="+234..."
                error={errors.sellerWhatsapp?.message}
                {...register("sellerWhatsapp")}
              />
              <Input
                label="Email"
                type="email"
                error={errors.sellerEmail?.message}
                {...register("sellerEmail")}
              />
            </div>
          </div>

          {/* Location */}
          <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-5">
            <h2 className="text-lg font-semibold text-dark-900">Location</h2>
            <Input
              label="Location"
              placeholder="e.g., Lagos, Victoria Island"
              error={errors.location?.message}
              {...register("location")}
            />
          </div>

          {/* Settings */}
          <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-5">
            <h2 className="text-lg font-semibold text-dark-900">Settings</h2>
            <div className="space-y-4">
              <Select
                label="Status"
                options={[
                  { value: "available", label: "Available" },
                  { value: "sold", label: "Sold" },
                  { value: "reserved", label: "Reserved" },
                ]}
                {...register("status")}
              />
              <Checkbox
                label="Featured Listing"
                {...register("featured")}
              />
            </div>
          </div>
        </div>
      </div>
    </form>
  );
}
