import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import type { Incident } from "../types/incident";

const InvestigatorWorkspace: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const incident = location.state?.incident as Incident | undefined;

  const [rootCauseCategory, setRootCauseCategory] = useState("");
  const [rootCause, setRootCause] = useState("");
  const [loading, setLoading] = useState(false);

  const handleRootCauseSubmit = async () => {

  if (rootCause.length < 20) {
    alert("Root cause findings must be at least 20 characters");
    return;
  }

  if (!rootCauseCategory) {
    alert("Please select a root cause category");
    return;
  }

  try {

    setLoading(true);

    const response = await fetch(
  `http://localhost:8000/api/v1/incidents/${incident!.id}/root-cause`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          rootCause,
          rootCauseCategory,
        }),
      }
    );


    if (!response.ok) {
      throw new Error("Failed");
    }


    alert("Root Cause submitted successfully");


    setRootCause("");
    setRootCauseCategory("");


  } catch (error) {

    alert("Validation failed");

  } finally {

    setLoading(false);

  }

};

  if (!incident) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold">Incident not found</h2>
          <button
            onClick={() => navigate("/investigator")}
            className="mt-4 rounded-lg bg-blue-600 px-4 py-2 text-white"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-100 p-6">
      <div className="mx-auto max-w-6xl">

        <button
          onClick={() => navigate("/investigator")}
          className="mb-6 text-blue-600 hover:underline"
        >
          ← Back to Dashboard
        </button>

        <div className="rounded-3xl bg-white p-8 shadow">

          <h1 className="text-3xl font-bold text-slate-900">
            Investigator Workspace
          </h1>

          <p className="mt-2 text-slate-500">
            Review the incident details and submit your Root Cause Analysis.
          </p>

          <div className="mt-8 rounded-xl border p-6">

            <h2 className="mb-6 text-xl font-semibold">
              Incident Information
            </h2>

            <div className="grid gap-6 md:grid-cols-2">

              <div>
                <p className="text-sm text-gray-500">Title</p>
                <p className="font-semibold">{incident.title}</p>
              </div>

              <div>
                <p className="text-sm text-gray-500">Status</p>
                <p className="font-semibold">{incident.status}</p>
              </div>

              <div>
                <p className="text-sm text-gray-500">Severity</p>
                <p>{incident.severity}</p>
              </div>

              <div>
                <p className="text-sm text-gray-500">Category</p>
                <p>{incident.category}</p>
              </div>

              <div>
                <p className="text-sm text-gray-500">Location</p>
                <p>{incident.location}</p>
              </div>

              <div>
                <p className="text-sm text-gray-500">Created</p>
                <p>{new Date(incident.createdAt).toLocaleDateString()}</p>
              </div>

            </div>

            <div className="mt-6">
              <p className="text-sm text-gray-500">Description</p>
              <p className="mt-2">{incident.description}</p>
            </div>

          </div>

            <div className="mt-6 rounded-xl border bg-white p-6">
                <h2 className="mb-6 text-xl font-semibold">
                    Reporter Information
                </h2>

                    <div className="grid gap-6 md:grid-cols-2">

                        <div>
                            <p className="text-sm text-gray-500">Reporter</p>
                            <p className="font-semibold">
                                {incident.reporter?.name ?? "Unknown"}
                            </p>
                        </div>

                        <div>
                            <p className="text-sm text-gray-500">Department</p>
                            <p className="font-semibold">
                                {incident.department?.name ?? "N/A"}
                            </p>
                        </div>

                    </div>
                </div>

                {/* Evidence Attachments */}
                <div className="mt-6 rounded-xl border bg-white p-6">
                    <h2 className="mb-6 text-xl font-semibold">
                        Evidence Attachments
                    </h2>

                {incident.attachments && incident.attachments.length > 0 ? (
                    <div className="space-y-3">
                    {incident.attachments.map((file) => (
                        <div
                            key={file.id}
                            className="flex items-center justify-between rounded-lg border p-3"
                            >
                            <div>
                                <p className="font-medium">{file.fileName}</p>
                                <p className="text-sm text-gray-500">
                                {file.fileType}
                                </p>
                            </div>

                            <a
                                href={`http://localhost:8000/${file.filePath}`}
                                target="_blank"
                                rel="noreferrer"
                                className="rounded-lg bg-blue-600 px-4 py-2 text-sm text-white hover:bg-blue-700">

                                View
                            </a>
                        </div>
                    ))}
                    </div>
                ) : (
                    <p className="text-gray-500">
                    No evidence uploaded.
                    </p>
                )}
                </div>

                {/* Root Cause Analysis */}
                <div className="mt-6 rounded-xl border bg-white p-6">

                <h2 className="mb-6 text-xl font-semibold">
                    Root Cause Analysis
                </h2>


                <div className="mb-6">

                    <label className="mb-2 block text-sm font-medium">
                    Root Cause Category
                    </label>


                    <select
                    value={rootCauseCategory}
                    onChange={(e) => setRootCauseCategory(e.target.value)}
                    className="w-full rounded-lg border p-3"
                    >

                    <option value="">
                        Select Category
                    </option>

                    <option value="Human Error">
                        Human Error
                    </option>

                    <option value="Equipment Failure">
                        Equipment Failure
                    </option>

                    <option value="Process Gap">
                        Process Gap
                    </option>

                    <option value="Communication Failure">
                        Communication Failure
                    </option>

                    </select>

                </div>



                <div className="mb-6">

                    <label className="mb-2 block text-sm font-medium">
                    Detailed Findings
                    </label>


                    <textarea
                    value={rootCause}
                    onChange={(e)=>setRootCause(e.target.value)}
                    rows={5}
                    placeholder="Describe the root cause findings..."
                    className="w-full rounded-lg border p-3"
                    />


                    <p className="mt-2 text-sm text-gray-500">
                    Minimum 20 characters
                    </p>

                </div>



                <button
                    onClick={handleRootCauseSubmit}
                    disabled={loading}
                    className="rounded-lg bg-blue-600 px-6 py-3 text-white hover:bg-blue-700"
                >

                    {loading ? "Submitting..." : "Submit Findings"}

                </button>


                </div>

        </div>
      </div>
    </div>
  );
};

export default InvestigatorWorkspace;