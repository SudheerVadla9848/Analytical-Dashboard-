import { DashboardLayout } from '@/components/dashboard/layout';
import { WeatherWidget } from '@/components/widgets/weather';

export default function WeatherPage() {
  return (
    <DashboardLayout>
      <div className="container py-6">
        <h1 className="text-3xl font-bold mb-6">Weather Dashboard</h1>
        <div className="grid gap-4">
          <WeatherWidget />
        </div>
      </div>
    </DashboardLayout>
  );
}