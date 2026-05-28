import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Settings — VedaAI',
  description: 'Manage your profile and school configuration preferences.',
};

export default function SettingsPage() {
  return (
    <div className="flex flex-col h-full px-6 py-8 md:p-10">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-[#111] tracking-tight">Settings</h1>
        <p className="text-sm text-[#666] mt-1">Configure your teacher profile and school integration settings.</p>
      </div>

      <div className="max-w-2xl bg-white border border-gray-100 shadow-sm rounded-2xl p-6">
        <h2 className="text-base font-bold text-[#111] mb-6">Profile Settings</h2>
        
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-[#555] mb-1">Teacher Account Name</label>
            <input type="text" readOnly value="Teacher" className="w-full border border-gray-200 rounded-lg px-3 py-2 bg-gray-50 text-gray-500 outline-none cursor-not-allowed" />
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#555] mb-1">School Affiliation</label>
            <input type="text" readOnly value="Delhi Public School, Bokaro" className="w-full border border-gray-200 rounded-lg px-3 py-2 bg-gray-50 text-gray-500 outline-none cursor-not-allowed" />
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#555] mb-1">Primary Subject Area</label>
            <input type="text" readOnly value="Computer Science & Mathematics" className="w-full border border-gray-200 rounded-lg px-3 py-2 bg-gray-50 text-gray-500 outline-none cursor-not-allowed" />
          </div>
        </div>

        <hr className="my-6 border-gray-100" />
        
        <h2 className="text-base font-bold text-[#111] mb-4">Integrations</h2>
        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-green-50 flex items-center justify-center text-green-600 font-bold text-xs">
              G
            </div>
            <div>
              <p className="text-sm font-bold text-[#111]">Google Classroom</p>
              <p className="text-xs text-[#666]">Sync your students and publish assignments directly.</p>
            </div>
          </div>
          <button className="px-4 py-2 border border-gray-200 rounded-full text-xs font-semibold bg-white hover:bg-gray-50 transition-colors">
            Connect
          </button>
        </div>
      </div>
    </div>
  );
}
