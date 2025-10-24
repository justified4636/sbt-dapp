import { Award, Loader2 } from "lucide-react";
import { type FormEvent, useState } from "react";
import { useContract } from "@/hooks/useContract";
import { validateAddress } from "@/lib/utils/address";

interface MintFormProps {
  onSuccess?: () => void;
}

export const MintForm = ({ onSuccess }: MintFormProps) => {
  const [address, setAddress] = useState("");
  const [validationError, setValidationError] = useState("");
  const { mint, loading, error } = useContract();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setValidationError("");

    if (!address.trim()) {
      setValidationError("Enter student address");
      return;
    }

    if (!validateAddress(address)) {
      setValidationError("Invalid TON address");
      return;
    }

    const result = await mint(address);
    if (result.success) {
      setAddress("");
      onSuccess?.();
    }
  };

  return (
    <div className="bg-gray-800 rounded-xl shadow-md border border-gray-700 p-4 sm:p-6">
      <div className="flex items-center gap-3 mb-4">
        <div className="p-2 bg-pink-900/50 rounded-lg">
          <Award className="w-6 h-6 text-pink-300" />
        </div>
        <div>
          <h2 className="text-xl font-bold">Mint Certificate</h2>
          <p className="text-sm text-gray-400">Admin only</p>
        </div>
      </div>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label
            htmlFor="student-address"
            className="block text-sm font-medium text-gray-300 mb-2"
          >
            Student Address
          </label>
          <input
            id="student-address"
            type="text"
            value={address}
            onChange={(e) => {
              setAddress(e.target.value);
              setValidationError("");
            }}
            placeholder="Enter student address to mint..."
            className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-shadow text-white placeholder-gray-500"
            disabled={loading}
          />
          {validationError && (
            <p className="mt-1 text-sm text-red-400">{validationError}</p>
          )}
        </div>
        {error && (
          <div className="p-3 bg-red-900/50 border border-red-700 rounded-lg">
            <p className="text-sm text-red-300">{error}</p>
          </div>
        )}
        <button
          type="submit"
          disabled={loading}
          className="w-full relative bg-gradient-to-r from-pink-600 to-pink-700 hover:from-pink-500 hover:to-pink-600 disabled:from-gray-700 disabled:to-gray-600 text-white font-medium py-3 rounded-lg transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] shadow-lg hover:shadow-pink-500/25 disabled:transform-none disabled:shadow-none overflow-hidden group"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-out"></div>
          <div className="relative flex items-center justify-center gap-2">
            {loading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin animate-pulse" />
                <span>Minting...</span>
              </>
            ) : (
              <>
                <Award className="w-5 h-5 group-hover:animate-bounce" />
                <span>Mint Certificate</span>
              </>
            )}
          </div>
        </button>
      </form>
    </div>
  );
};
