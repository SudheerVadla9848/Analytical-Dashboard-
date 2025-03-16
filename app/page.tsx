import { DashboardLayout } from '@/components/dashboard/layout';
import { WeatherWidget } from '@/components/widgets/weather';
import { NewsWidget } from '@/components/widgets/news';
import { FinanceWidget } from '@/components/widgets/finance';

export default function Home() {
  return (
    <DashboardLayout>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-1 ">
        <WeatherWidget />
        <NewsWidget />
        <FinanceWidget />
      </div>
    </DashboardLayout>
  );
}