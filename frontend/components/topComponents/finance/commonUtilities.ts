import { Pools, FuncTag } from "@/interfaces";
import { toBN } from "@/utilities";

export type Operation = 'Open' | 'Closed';

/**
 * Exposes number of active or inactive pools
 * @param pools : type pool
 * @returns : Number of active or inactive pools
 */
export const filterPools = (pools: Pools, type: Operation) => {
    // let result : number = 0;
    return pools.filter((pool) => {
      const stage = toBN(pool.stage.toString()).toNumber();
      const stageEnded = stage === FuncTag.ENDED;
      const quorumIsZero = toBN(pool.uints.quorum.toString()).isZero();
      const allGH = toBN(pool.allGh.toString()).eq(toBN(pool.userCount._value.toString()));
      const isClosed : boolean = stageEnded || allGH || quorumIsZero;
      return type === 'Closed'? isClosed : !isClosed;
    });
  }