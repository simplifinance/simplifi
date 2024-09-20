import { Pools, LiquidityPool } from "@/interfaces";
import { toBN } from "@/utilities";

export type Operation = 'Open' | 'Closed';

/**
 * Exposes number of active or inactive pools
 * @param pools : type pool
 * @returns : Number of active or inactive pools
 */
export const filterPools = (pools: Pools, type: Operation) => {
    let result : number = 0;
    pools.forEach((pool: LiquidityPool) => {
      switch (type) {
        case 'Open':
          const expectedAmt = toBN(pool.uint256s.unit.toString()).times(toBN(pool.uints.quorum.toString()));
          if(toBN(pool.uints.quorum.toString()).gt(0) && expectedAmt.gt(toBN(pool.uint256s.currentPool.toString()))) {
            result ++;
          }
          break;
        case 'Closed':
          if(toBN(pool.uints.quorum.toString()).isZero()) {
            result ++;
          }
          break;
        default:
          break;
      }
    });
    return result;
  }