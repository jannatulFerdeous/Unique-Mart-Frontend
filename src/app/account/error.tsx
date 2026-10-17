"use client";

import { DashboardError } from "@/modules/AdminPortal";

export default function DashboardSegmentError(props: { error: Error & { digest?: string }; retry: () => void }) {
  return <DashboardError {...props} />;
}
