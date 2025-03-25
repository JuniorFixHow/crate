import { getContracts, getUnusedContracts } from "@/lib/actions/contract.action";
import { IContract } from "@/lib/database/models/contract.model"

import { useQuery } from "@tanstack/react-query";

export const useFetchContracts = () => {
  const fetchContracts = async (): Promise<{ contracts: IContract[]; freeContracts: IContract[] }> => {
    try {
      const [conts, freeconts] = await Promise.all([
        getContracts() as Promise<IContract[]>,
        getUnusedContracts() as Promise<IContract[]>,
      ]);

      return {
        contracts: conts.sort((a, b) => new Date(b.createdAt!).getTime() - new Date(a.createdAt!).getTime()),
        freeContracts: freeconts.sort((a, b) => new Date(b.createdAt!).getTime() - new Date(a.createdAt!).getTime()),
      };
    } catch (error) {
      console.error("Error fetching contracts:", error);
      return { contracts: [], freeContracts: [] };
    }
  };

  const {
    data = { contracts: [], freeContracts: [] },
    isPending: loading,
    refetch,
  } = useQuery({
    queryKey: ["contracts"],
    queryFn: fetchContracts,
  });

  return {
    contracts: data.contracts,
    freeContracts: data.freeContracts,
    loading,
    refetch,
  };
};
