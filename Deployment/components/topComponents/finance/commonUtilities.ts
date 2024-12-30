import { Pools, FuncTag, LiquidityPool, PoolType } from "@/interfaces";
import { toBigInt, toBN } from "@/utilities";
import BigNumber from "bignumber.js";
import { formatEther } from "viem";

export type Operation = 'Open' | 'Closed';

/**
 * Exposes number of active or inactive pools
 * @param pools : type pool
 * @returns : Number of active or inactive pools
 */
export default function filterPools (pools: Pools) {
  let tvl : BigNumber = toBN(0);
  for(let i = 0; i < pools.length; i++){
    tvl.plus(toBN(pools[i].uint256s.currentPool.toString()));
  }

  const filterPool = (op: Operation) => {
    // console.log("Pools", pools)
    return pools?.filter((pool) => {
      const stage = toBN(pool.stage.toString()).toNumber();
      const stageEnded = stage === FuncTag.ENDED;
      const quorumIsZero = toBN(pool.uints.quorum.toString()).isZero();
      const allGH = toBN(pool.allGh.toString()).eq(toBN(pool.userCount._value.toString()));
      const isClosed : boolean = stageEnded || allGH || quorumIsZero;
      return op === 'Closed'? isClosed : !isClosed;
    });
  }

  const filterType = (type: PoolType) => {
    return pools.filter((pool) => type === 'Permissionless'? pool.isPermissionless : !pool.isPermissionless);
  }
  const open = filterPool('Open');
  const closed = filterPool('Closed');
  const permissioned = filterType('Permissioned');
  const permissionless = filterType('Permissionless');
  return { open, closed, permissioned, permissionless, tvl: formatEther(toBigInt(tvl.toString())) }
}