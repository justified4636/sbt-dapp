import { useTonConnectUI } from "@tonconnect/ui-react";
import { useCallback, useState } from "react";
import { contractService } from "@/lib/contract/contractService";
import type { TransactionResult } from "@/types";

export const useContract = () => {
  const [tonConnectUI] = useTonConnectUI();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const mint = useCallback(
    async (studentAddress: string): Promise<TransactionResult> => {
      setLoading(true);
      setError(null);

      try {
        // Check if current user is admin
        const wallet = tonConnectUI.wallet;
        if (!wallet) {
          throw new Error("No wallet connected");
        }
        const userAddress = wallet.account.address;
        console.log("DEBUG: Connected wallet address:", userAddress);

        const isAdmin = await contractService.isAdmin(userAddress);
        console.log("DEBUG: Is current user admin?", isAdmin);

        if (!isAdmin) {
          throw new Error("Current wallet is not authorized to mint NFTs. Only admins can mint certificates.");
        }

        // Get the nextId before minting
        const stateBefore = await contractService.getState();
        const expectedTokenId = stateBefore.nextId;
        console.log("DEBUG: State before mint:", stateBefore);
        console.log("DEBUG: Expected token ID:", expectedTokenId);

        const transaction =
          contractService.buildMintTransaction(studentAddress);
        console.log("DEBUG: Built transaction for student:", studentAddress);
        console.log("DEBUG: Transaction details:", {
          address: transaction.messages[0].address,
          amount: transaction.messages[0].amount,
          payloadLength: transaction.messages[0].payload.length
        });

        const result = await tonConnectUI.sendTransaction(transaction);
        console.log("DEBUG: Transaction sent, result:", result);
        console.log("DEBUG: Transaction hash (BOC):", result.boc);

        // Wait a bit for the transaction to be processed
        console.log("DEBUG: Waiting 5 seconds for transaction processing...");
        await new Promise(resolve => setTimeout(resolve, 5000));

        // Verify the mint by checking if nextId increased
        const stateAfter = await contractService.getState();
        console.log("DEBUG: State after mint:", stateAfter);

        // Check if nextId actually increased
        if (stateAfter.nextId <= stateBefore.nextId) {
          console.error("DEBUG: nextId did not increase - transaction may have failed");
          console.log("DEBUG: nextId before:", stateBefore.nextId, "after:", stateAfter.nextId);
          throw new Error("Transaction did not update contract state - minting failed");
        }

        const tokenId = expectedTokenId;
        console.log("DEBUG: Attempting to verify token ID:", tokenId);

        // Retry token verification a few times in case of timing issues
        let token = null;
        let attempts = 0;
        const maxAttempts = 3;

        while (!token && attempts < maxAttempts) {
          attempts++;
          console.log(`DEBUG: Token fetch attempt ${attempts}/${maxAttempts}`);
          try {
            token = await contractService.getToken(tokenId);
            console.log("DEBUG: Fetched token:", token);
          } catch (error) {
            console.warn(`DEBUG: Token fetch attempt ${attempts} failed:`, error);
            if (attempts < maxAttempts) {
              await new Promise(resolve => setTimeout(resolve, 2000)); // Wait 2s between attempts
            }
          }
        }

        if (!token) {
          console.error("DEBUG: Token verification failed after", maxAttempts, "attempts - token is null");
          console.error("DEBUG: This could indicate:");
          console.error("  - Transaction failed silently");
          console.error("  - Contract rejected the mint (not admin, insufficient funds, etc.)");
          console.error("  - API rate limiting preventing token fetch");
          throw new Error("Token was not minted successfully - check admin status and transaction details");
        }

        // Fetch metadata to ensure it's complete
        try {
          const uri = await contractService.getTokenUri(tokenId);
          console.log("DEBUG: Token URI:", uri);

          const metadataResponse = await fetch(uri);
          if (!metadataResponse.ok) {
            console.warn("DEBUG: Failed to fetch metadata, but token exists");
          } else {
            const metadata = await metadataResponse.json();
            console.log("DEBUG: Metadata fetched successfully:", metadata);
          }
        } catch (metadataError) {
          console.warn("DEBUG: Metadata fetch failed, but continuing:", metadataError);
        }

        console.log("DEBUG: Mint successful, token ID:", tokenId);
        return {
          success: true,
          hash: result.boc,
          tokenId,
        };
      } catch (err: unknown) {
        const errorMsg =
          err instanceof Error ? err.message : "Transaction failed";
        setError(errorMsg);
        console.error("Mint error:", err);
        return {
          success: false,
          error: errorMsg,
        };
      } finally {
        setLoading(false);
      }
    },
    [tonConnectUI],
  );

  const addAdmin = useCallback(
    async (adminAddress: string): Promise<TransactionResult> => {
      setLoading(true);
      setError(null);

      try {
        const transaction =
          contractService.buildAddAdminTransaction(adminAddress);
        const result = await tonConnectUI.sendTransaction(transaction);

        return {
          success: true,
          hash: result.boc,
        };
      } catch (err: unknown) {
        const errorMsg =
          err instanceof Error ? err.message : "Transaction failed";
        setError(errorMsg);
        console.error("Add admin error:", err);
        return {
          success: false,
          error: errorMsg,
        };
      } finally {
        setLoading(false);
      }
    },
    [tonConnectUI],
  );

  return {
    mint,
    addAdmin,
    loading,
    error,
    clearError: () => setError(null),
  };
};
