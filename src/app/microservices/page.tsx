"use client";

import { useEffect, useState } from "react";

export default function MicroservicesTestPage() {
  const [crmData, setCrmData] = useState<any>(null);
  const [hrData, setHrData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        // Fetch dari CRM Service
        const crmRes = await fetch("http://localhost:3001/api/crm/customers");
        const crmJson = await crmRes.json();
        setCrmData(crmJson.data);

        // Fetch dari HR Service
        const hrRes = await fetch("http://localhost:3002/api/hr/employees");
        const hrJson = await hrRes.json();
        setHrData(hrJson.data);
      } catch (error) {
        console.error("Gagal mengambil data dari microservices:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  return (
    <div className="p-8 font-sans max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">Test Integrasi Microservices</h1>
      
      {loading ? (
        <p className="text-gray-500">Memuat data dari CRM dan HR...</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Card CRM */}
          <div className="border border-blue-200 rounded-lg p-6 bg-blue-50 shadow-sm">
            <h2 className="text-xl font-semibold mb-4 text-blue-700">Data dari CRM (Port 3001)</h2>
            <ul className="space-y-2">
              {crmData ? crmData.map((cust: any) => (
                <li key={cust.id} className="bg-white p-3 rounded shadow-sm border border-blue-100 flex justify-between">
                  <span className="font-medium text-gray-800">{cust.name}</span>
                  <span className="text-sm bg-blue-100 text-blue-800 px-2 py-1 rounded-full">{cust.status}</span>
                </li>
              )) : <p className="text-red-500">Gagal memuat data CRM</p>}
            </ul>
          </div>

          {/* Card HR */}
          <div className="border border-green-200 rounded-lg p-6 bg-green-50 shadow-sm">
            <h2 className="text-xl font-semibold mb-4 text-green-700">Data dari HR (Port 3002)</h2>
            <ul className="space-y-2">
              {hrData ? hrData.map((emp: any) => (
                <li key={emp.id} className="bg-white p-3 rounded shadow-sm border border-green-100 flex justify-between">
                  <span className="font-medium text-gray-800">{emp.name}</span>
                  <span className="text-sm bg-green-100 text-green-800 px-2 py-1 rounded-full">{emp.position}</span>
                </li>
              )) : <p className="text-red-500">Gagal memuat data HR</p>}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}
