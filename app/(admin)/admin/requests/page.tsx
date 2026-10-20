"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { AdminLayout } from "@/app/components/admin/AdminLayout";
import { Badge } from "@/app/components/ui/Badge";
import { Button } from "@/app/components/ui/Button";
import { LoadingSpinner } from "@/app/components/ui/LoadingSpinner";
import { ErrorMessage } from "@/app/components/ui/ErrorMessage";
import { formatPrice, formatDate, generateWhatsAppLink } from "@/app/utils/format";
import {
  Phone,
  MessageCircle,
  Mail,
  Clock,
  CheckCircle2,
  XCircle,
  Eye,
  Filter,
  Search,
} from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";

interface CarRequest {
  _id: string;
  name: string;
  email?: string;
  phone: string;
  whatsapp?: string;
  preferredContact: string;
  brand: string;
  model?: string;
  yearFrom?: number;
  yearTo?: number;
  transmission: string;
  fuelType: string;
  budgetFrom?: number;
  budgetTo?: number;
  condition: string;
  color?: string;
  mileageMax?: number;
  description?: string;
  urgency: string;
  status: "pending" | "contacted" | "fulfilled" | "closed";
  createdAt: string;
}

const statusConfig = {
  pending: { variant: "warning" as const, icon: Clock },
  contacted: { variant: "info" as const, icon: Phone },
  fulfilled: { variant: "success" as const, icon: CheckCircle2 },
  closed: { variant: "default" as const, icon: XCircle },
};

const urgencyLabels: Record<string, string> = {
  asap: "ASAP",
  "1week": "1 Week",
  "1month": "1 Month",
  flexible: "Flexible",
};

function handleUnauthorized() {
  if (typeof window === "undefined") return;
  if (window.location.pathname.startsWith("/admin/login")) return;
  window.location.href = "/admin/login";
}

function fetchRequests(status?: string) {
  const params = new URLSearchParams();
  if (status && status !== "all") params.set("status", status);
  return fetch(`/api/requests?${params.toString()}`).then(async (r) => {
    if (r.status === 401) {
      handleUnauthorized();
      throw new Error("Your session expired. Please sign in again.");
    }
    if (!r.ok) throw new Error("Failed to load requests");
    return r.json();
  });
}

export default function AdminRequestsPage() {
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [selectedRequest, setSelectedRequest] = useState<CarRequest | null>(null);

  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ["requests", statusFilter],
    queryFn: () => fetchRequests(statusFilter),
  });

  const updateStatus = async (id: string, status: string) => {
    const res = await fetch(`/api/requests/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    if (res.status === 401) {
      handleUnauthorized();
      return;
    }
    refetch();
    if (selectedRequest?._id === id) {
      setSelectedRequest({ ...selectedRequest, status: status as CarRequest["status"] });
    }
  };

  const deleteRequest = async (id: string) => {
    if (!confirm("Delete this request?")) return;
    const res = await fetch(`/api/requests/${id}`, { method: "DELETE" });
    if (res.status === 401) {
      handleUnauthorized();
      return;
    }
    refetch();
    if (selectedRequest?._id === id) setSelectedRequest(null);
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-dark-900">Car Requests</h1>
            <p className="text-sm text-dark-500 mt-1">
              Manage customer car sourcing requests
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-dark-400" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="contacted">Contacted</option>
              <option value="fulfilled">Fulfilled</option>
              <option value="closed">Closed</option>
            </select>
          </div>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <LoadingSpinner size={32} className="text-primary-600" />
          </div>
        ) : isError ? (
          <ErrorMessage onRetry={refetch} />
        ) : (
          <div className="grid lg:grid-cols-2 gap-6">
            <div className="space-y-3 max-h-[calc(100vh-200px)] overflow-y-auto">
              {data?.requests?.length === 0 && (
                <div className="text-center py-16 bg-white rounded-xl border border-gray-200">
                  <Search className="w-8 h-8 text-gray-300 mx-auto mb-3" />
                  <p className="text-dark-500">No requests found</p>
                </div>
              )}
              {data?.requests?.map((req: CarRequest) => {
                const config = statusConfig[req.status];
                return (
                  <div
                    key={req._id}
                    onClick={() => setSelectedRequest(req)}
                    className={`p-4 bg-white rounded-xl border cursor-pointer transition-all ${
                      selectedRequest?._id === req._id
                        ? "border-primary-500 ring-2 ring-primary-100"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-semibold text-dark-900 text-sm">{req.name}</h3>
                          <Badge variant={config.variant} size="sm">
                            <config.icon className="w-3 h-3 mr-1" />
                            {req.status}
                          </Badge>
                        </div>
                        <p className="text-sm text-dark-700">
                          {req.brand} {req.model || ""} {req.yearFrom ? `(${req.yearFrom}${req.yearTo ? `-${req.yearTo}` : ""})` : ""}
                        </p>
                        <div className="flex items-center gap-3 mt-2 text-xs text-dark-500">
                          <span className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {urgencyLabels[req.urgency]}
                          </span>
                          <span>{formatDate(req.createdAt)}</span>
                        </div>
                      </div>
                      <Eye className="w-4 h-4 text-dark-300 shrink-0" />
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Detail Panel */}
            <AnimatePresence mode="wait">
              {selectedRequest ? (
                <motion.div
                  key={selectedRequest._id}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  className="bg-white rounded-xl border border-gray-200 p-6 sticky top-4"
                >
                  <div className="flex items-start justify-between mb-6">
                    <div>
                      <h2 className="text-lg font-bold text-dark-900">{selectedRequest.name}</h2>
                      <p className="text-sm text-dark-500 mt-0.5">
                        Submitted {formatDate(selectedRequest.createdAt)}
                      </p>
                    </div>
                    <Badge variant={statusConfig[selectedRequest.status].variant}>
                      {selectedRequest.status}
                    </Badge>
                  </div>

                  {/* Contact */}
                  <div className="space-y-3 mb-6">
                    <h3 className="text-xs font-semibold text-dark-500 uppercase tracking-wider">Contact</h3>
                    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                      <Phone className="w-4 h-4 text-primary-600" />
                      <span className="text-sm text-dark-700">{selectedRequest.phone}</span>
                    </div>
                    {selectedRequest.whatsapp && (
                      <a
                        href={generateWhatsAppLink(selectedRequest.whatsapp, `Hello ${selectedRequest.name}, regarding your car request for ${selectedRequest.brand}`)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-3 p-3 bg-green-50 rounded-lg hover:bg-green-100 transition-colors"
                      >
                        <MessageCircle className="w-4 h-4 text-green-600" />
                        <span className="text-sm text-green-700 font-medium">{selectedRequest.whatsapp}</span>
                      </a>
                    )}
                    {selectedRequest.email && (
                      <a
                        href={`mailto:${selectedRequest.email}`}
                        className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                      >
                        <Mail className="w-4 h-4 text-dark-400" />
                        <span className="text-sm text-dark-700">{selectedRequest.email}</span>
                      </a>
                    )}
                    <div className="flex items-center gap-2 text-xs text-dark-500">
                      <span>Preferred:</span>
                      <Badge variant="primary" size="sm">{selectedRequest.preferredContact}</Badge>
                    </div>
                  </div>

                  {/* Car Specs */}
                  <div className="space-y-3 mb-6">
                    <h3 className="text-xs font-semibold text-dark-500 uppercase tracking-wider">Car Requirements</h3>
                    <div className="grid grid-cols-2 gap-2">
                      <div className="p-3 bg-gray-50 rounded-lg">
                        <p className="text-xs text-dark-500">Brand</p>
                        <p className="text-sm font-semibold text-dark-900">{selectedRequest.brand}</p>
                      </div>
                      {selectedRequest.model && (
                        <div className="p-3 bg-gray-50 rounded-lg">
                          <p className="text-xs text-dark-500">Model</p>
                          <p className="text-sm font-semibold text-dark-900">{selectedRequest.model}</p>
                        </div>
                      )}
                      {(selectedRequest.yearFrom || selectedRequest.yearTo) && (
                        <div className="p-3 bg-gray-50 rounded-lg">
                          <p className="text-xs text-dark-500">Year</p>
                          <p className="text-sm font-semibold text-dark-900">
                            {selectedRequest.yearFrom || "Any"} - {selectedRequest.yearTo || "Any"}
                          </p>
                        </div>
                      )}
                      {(selectedRequest.budgetFrom || selectedRequest.budgetTo) && (
                        <div className="p-3 bg-gray-50 rounded-lg">
                          <p className="text-xs text-dark-500">Budget</p>
                          <p className="text-sm font-semibold text-dark-900">
                            {selectedRequest.budgetFrom ? formatPrice(selectedRequest.budgetFrom) : "Any"} - {" "}
                            {selectedRequest.budgetTo ? formatPrice(selectedRequest.budgetTo) : "Any"}
                          </p>
                        </div>
                      )}
                      <div className="p-3 bg-gray-50 rounded-lg">
                        <p className="text-xs text-dark-500">Transmission</p>
                        <p className="text-sm font-semibold text-dark-900 capitalize">{selectedRequest.transmission}</p>
                      </div>
                      <div className="p-3 bg-gray-50 rounded-lg">
                        <p className="text-xs text-dark-500">Fuel</p>
                        <p className="text-sm font-semibold text-dark-900 capitalize">{selectedRequest.fuelType}</p>
                      </div>
                      <div className="p-3 bg-gray-50 rounded-lg">
                        <p className="text-xs text-dark-500">Condition</p>
                        <p className="text-sm font-semibold text-dark-900 capitalize">{selectedRequest.condition}</p>
                      </div>
                      <div className="p-3 bg-gray-50 rounded-lg">
                        <p className="text-xs text-dark-500">Urgency</p>
                        <p className="text-sm font-semibold text-dark-900">{urgencyLabels[selectedRequest.urgency]}</p>
                      </div>
                      {selectedRequest.color && (
                        <div className="p-3 bg-gray-50 rounded-lg">
                          <p className="text-xs text-dark-500">Color</p>
                          <p className="text-sm font-semibold text-dark-900">{selectedRequest.color}</p>
                        </div>
                      )}
                      {selectedRequest.mileageMax && (
                        <div className="p-3 bg-gray-50 rounded-lg">
                          <p className="text-xs text-dark-500">Max Mileage</p>
                          <p className="text-sm font-semibold text-dark-900">{selectedRequest.mileageMax.toLocaleString()} km</p>
                        </div>
                      )}
                    </div>
                  </div>

                  {selectedRequest.description && (
                    <div className="mb-6">
                      <h3 className="text-xs font-semibold text-dark-500 uppercase tracking-wider mb-2">Notes</h3>
                      <p className="text-sm text-dark-600 bg-gray-50 rounded-lg p-3">{selectedRequest.description}</p>
                    </div>
                  )}

                  {/* Actions */}
                  <div className="space-y-2">
                    <p className="text-xs font-semibold text-dark-500 uppercase tracking-wider">Update Status</p>
                    <div className="grid grid-cols-2 gap-2">
                      {(["pending", "contacted", "fulfilled", "closed"] as const).map((status) => (
                        <button
                          key={status}
                          onClick={() => updateStatus(selectedRequest._id, status)}
                          disabled={selectedRequest.status === status}
                          className={`px-3 py-2 rounded-lg text-xs font-medium capitalize transition-all ${
                            selectedRequest.status === status
                              ? "bg-primary-100 text-primary-700 border-2 border-primary-300"
                              : "bg-gray-50 text-dark-600 border border-gray-200 hover:bg-gray-100"
                          }`}
                        >
                          {status}
                        </button>
                      ))}
                    </div>
                    <Button
                      variant="danger"
                      size="sm"
                      className="w-full mt-2"
                      onClick={() => deleteRequest(selectedRequest._id)}
                    >
                      Delete Request
                    </Button>
                  </div>
                </motion.div>
              ) : (
                <div className="hidden lg:flex items-center justify-center h-full bg-white rounded-xl border border-gray-200 border-dashed">
                  <p className="text-dark-400 text-sm">Select a request to view details</p>
                </div>
              )}
            </AnimatePresence>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
