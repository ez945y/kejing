"use client";

import { useEffect, useState } from "react";
import { fetchAllServices } from "@/app/api/serviceApi";
import { Skeleton } from "@/components/ui/skeleton";
import { EmptyState } from "@/components/ui/emptyState";
import MainNav from "@/components/mainNav";
import MainFooter from "@/components/mainFooter";

export default function ServicesPage() {
    const [services, setServices] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadServices = async () => {
            setLoading(true);
            try {
                const servicesData = await fetchAllServices();
                setServices(servicesData);
            } catch (error) {
                console.error("获取服务列表失败:", error);
            } finally {
                setLoading(false);
            }
        };

        loadServices();
    }, []);

    return (
        <div className="min-h-screen flex flex-col">
            <MainNav />
            <main className="flex-grow container mx-auto px-4 py-8">
                <h1 className="text-3xl font-bold mb-8 text-center">我们的服务</h1>

                {loading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {[...Array(3)].map((_, index) => (
                            <div key={index} className="p-6 border rounded-lg shadow-sm">
                                <Skeleton className="h-8 w-3/4 mb-4" />
                                <Skeleton className="h-4 w-full mb-2" />
                                <Skeleton className="h-4 w-full mb-2" />
                                <Skeleton className="h-4 w-2/3" />
                            </div>
                        ))}
                    </div>
                ) : services.length === 0 ? (
                    <EmptyState
                        title="暂无服务"
                        description="目前还没有添加任何服务项目，请稍后再来查看。"
                    />
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {services.map((service) => (
                            <div key={service.id} className="p-6 border rounded-lg shadow-sm hover:shadow-md transition-shadow">
                                <h2 className="text-xl font-semibold mb-3">{service.name}</h2>
                                <p className="text-gray-600">{service.description}</p>
                            </div>
                        ))}
                    </div>
                )}
            </main>
            <MainFooter />
        </div>
    );
} 