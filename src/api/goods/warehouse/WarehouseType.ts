import type { BasePojo } from "@/api/type/BasePojo";

export interface WarehouseVO extends BasePojo{
  id?: string;
  name: string;
  address: string;
  capacity: number;
  status: number;
  adminId?: string;
}

export interface WarehouseSaveVO {
  id?: string;
  name?: string;
  address?: string;
  capacity?: number;
  status?: number;
  adminId?: string;
}