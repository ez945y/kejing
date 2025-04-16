"use client";

import { useEffect, useState } from "react";
import { Service, fetchAllServices } from "@/app/api/serviceApi";
import { Skeleton } from "@/components/ui/skeleton";
import { EmptyState } from "@/components/ui/emptyState";
import { FileQuestion } from "lucide-react";

export default function ServicesPage() {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadServices = async () => {
      setLoading(true);
      try {
        const data = await fetchAllServices();
        setServices(data);
      } catch (error) {
        console.error("加载服务失败", error);
      } finally {
        setLoading(false);
      }
    };

    loadServices();
  }, []);

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold text-center mb-12">我们的服务</h1>
      
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[...Array(3)].map((_, index) => (
            <div key={index} className="p-6 border rounded-lg shadow-sm">
              <Skeleton className="h-8 w-3/4 mb-4" />
              <Skeleton className="h-4 w-full mb-2" />
              <Skeleton className="h-4 w-full mb-2" />
              <Skeleton className="h-4 w-2/3" />
            </div>
          ))}
        </div>
      ) : services.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service) => (
            <div key={service.id} className="p-6 border rounded-lg shadow-sm hover:shadow-md transition-shadow">
              <h2 className="text-xl font-semibold mb-3">{service.name}</h2>
              <p className="text-gray-600">{service.description}</p>
            </div>
          ))}
        </div>
      ) : (
        <EmptyState
          icon={FileQuestion}
          title="暂无服务"
          description="我们正在更新服务内容，请稍后再来查看。"
          className="py-16"
        />
      )}
    </div>
  );
} 