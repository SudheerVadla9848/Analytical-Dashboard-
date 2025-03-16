import { DashboardLayout } from '@/components/dashboard/layout';
import { NewsWidget } from '@/components/widgets/news';

export default function NewsPage() {
  return (
    <DashboardLayout>
      <div className="container py-6">
        <h1 className="text-3xl font-bold mb-6">News Dashboard</h1>
        <div className="grid gap-4">
          <NewsWidget />
        </div>
      </div>
    </DashboardLayout>
  );
}