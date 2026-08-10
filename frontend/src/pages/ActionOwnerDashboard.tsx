import React from 'react';

const ActionOwnerDashboard: React.FC = () => {
  return (
    <div className="min-h-screen bg-slate-100 px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-4xl space-y-6">
        <section className="overflow-hidden rounded-3xl bg-gradient-to-r from-[#0B4F8A] via-[#1473B8] to-[#38A0D8] text-white shadow-lg">
          <div className="flex flex-col gap-6 p-6 sm:p-8">
            <div>
              <span className="inline-flex rounded-full bg-white/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.24em] text-blue-100">
                Action Owner workspace
              </span>
              <h1 className="mt-4 text-3xl font-bold sm:text-4xl">Action Owner Dashboard</h1>
              <p className="mt-2 max-w-2xl text-sm text-slate-200 sm:text-base">
                Manage the corrective actions assigned to you and track their progress.
              </p>
            </div>
          </div>
        </section>

        <section className="rounded-3xl border border-slate-200 bg-white p-8 text-center shadow-sm">
          <p className="text-slate-500">
            Incidents assigned to you as the action owner will appear here once the feature is ready.
          </p>
        </section>
      </div>
    </div>
  );
};

export default ActionOwnerDashboard;
