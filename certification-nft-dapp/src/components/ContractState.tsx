import { useContractState } from "@/hooks/useContractState";
import { CONTRACT_ADDRESS } from "@/lib/constants";
import { formatSupply } from "@/lib/format";

export const ContractState = () => {
  const { state: contractState, loading, error } = useContractState();

  if (loading) {
    return (
      <div className="bg-gray-800 rounded-2xl shadow-md border border-gray-700 p-4 sm:p-6">
        <h2 className="text-xl font-bold mb-4">Contract Overview</h2>
        <div className="animate-pulse space-y-4">
          <div className="h-4 bg-gray-700 rounded w-1/4"></div>
          <div className="h-4 bg-gray-700 rounded w-1/2"></div>
          <div className="h-4 bg-gray-700 rounded w-1/3"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-gray-800 rounded-2xl shadow-md border border-gray-700 p-4 sm:p-6">
        <h2 className="text-xl font-bold mb-4">Contract Overview</h2>
        <div className="p-4 bg-red-900/50 border border-red-700 rounded-lg">
          <p className="text-sm text-red-300">Error fetching contract data: {error}</p>
        </div>
      </div>
    );
  }

  if (!contractState) {
    return (
      <div className="bg-gray-800 rounded-2xl shadow-md border border-gray-700 p-4 sm:p-6">
        <h2 className="text-xl font-bold mb-4">Contract Overview</h2>
        <p className="text-gray-400">Data unavailable</p>
      </div>
    );
  }

  return (
    <div className="bg-gray-800 rounded-2xl shadow-md border border-gray-700 p-4 sm:p-6">
      <h2 className="text-xl font-bold mb-4 text-white">
        Contract Overview
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-gradient-to-br from-purple-900/50 to-purple-800/50 p-4 rounded-lg border border-purple-700">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-purple-600 rounded-lg">
              <svg
                className="w-5 h-5 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                role="img"
                aria-label="Check mark icon"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <div>
              <p className="text-sm font-medium text-purple-200">Total Issued</p>
              <p className="text-2xl font-bold text-purple-100">
                {contractState.total.toString()}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-gradient-to-br from-pink-900/50 to-pink-800/50 p-4 rounded-lg border border-pink-700">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-pink-600 rounded-lg">
              <svg
                className="w-5 h-5 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                role="img"
                aria-label="Lightning bolt icon"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 10V3L4 14h7v7l9-11h-7z"
                />
              </svg>
            </div>
            <div>
              <p className="text-sm font-medium text-pink-200">Next Available Token</p>
              <p className="text-2xl font-bold text-pink-100">
                {contractState.nextId.toString()}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-gradient-to-br from-green-900/50 to-green-800/50 p-4 rounded-lg border border-green-700">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-green-600 rounded-lg">
              <svg
                className="w-5 h-5 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                role="img"
                aria-label="Lock icon"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                />
              </svg>
            </div>
            <div>
              <p className="text-sm font-medium text-green-200">Circulation</p>
              <p className="text-2xl font-bold text-green-100">
                {formatSupply(contractState.total, BigInt(10000))}
              </p>
            </div>
          </div>
        </div>
      </div>
      <div className="mt-6 pt-6 border-t border-gray-700">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <div>
              <p className="text-sm font-medium text-white mb-2">Contract Identifier</p>
              <div className="flex items-center gap-3">
                <p className="text-xs font-mono break-all bg-gray-900 text-white  border border-gray-700 flex-1">
                  {CONTRACT_ADDRESS}
                </p>
                <button
                  type="button"
                  onClick={(e) => {
                    const btn = e.currentTarget as HTMLButtonElement;
                    const original = btn.innerText;
                    const write = navigator.clipboard?.writeText?.(CONTRACT_ADDRESS);
                    if (!write) {
                      btn.innerText = "Copy not supported";
                      setTimeout(() => (btn.innerText = original), 2000);
                      return;
                    }
                    write
                      .then(() => {
                        btn.innerText = "Copied!";
                        btn.classList.add("bg-green-600", "text-white");
                        setTimeout(() => {
                          btn.innerText = original;
                          btn.classList.remove("bg-green-600", "text-white");
                        }, 2000);
                      })
                      .catch(() => {
                        btn.innerText = "Failed";
                        setTimeout(() => (btn.innerText = original), 2000);
                      });
                  }}
                  className="px-3 py-2 bg-gray-500 border border-gray-300 rounded-md text-sm hover:bg-gray-700 transition"
                  aria-label="Copy contract address"
                >
                  <span className="text-white">Copy address</span>
                </button>
              </div>
            </div>
          </div>
          {/* <div>
            <p className="text-sm font-medium text-gray-300 mb-2">Base URI</p>
            <p className="text-xs font-mono break-all bg-gray-900 p-3 rounded-lg border border-gray-700">
              {contractState.base_uri}
            </p>
          </div> */}
        </div>
      </div>
    </div>
  );
};
