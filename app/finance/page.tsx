import { DashboardLayout } from '@/components/dashboard/layout';
import { FinanceWidget } from '@/components/widgets/finance';

export default function FinancePage() {
  return (
    <DashboardLayout>
      <div className="container py-6">
        <h1 className="text-3xl font-bold mb-6">Finance Dashboard</h1>
        <div className="grid gap-4">
          <FinanceWidget />
        </div>
      </div>
    </DashboardLayout>
  );
}