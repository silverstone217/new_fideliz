import { create } from "zustand";
import {
  AppStateType,
  ClientType,
  ShopStateType,
  TransactionType,
} from "../types";

export const useAppState = create<AppStateType>((set) => ({
  firstTime: true,
  setFirstTime: (firstTime: boolean) => set({ firstTime }),
}));

type ShopStateTypeProps = {
  shop: ShopStateType | null;
  setShop: (shop: ShopStateType | null) => void;
};
export const useShopState = create<ShopStateTypeProps>((set) => ({
  shop: null,
  setShop: (shop: ShopStateType | null) => set({ shop }),
}));

type ClientStateType = {
  clients: ClientType[];
  setClients: (client: ClientType[]) => void;
};

export const useClientsState = create<ClientStateType>((set) => ({
  clients: [],
  setClients: (client: ClientType[]) => set({ clients: [...client] }),
}));

type TransactionStateType = {
  transactions: TransactionType[];
  setTransactions: (transaction: TransactionType[]) => void;
};

export const useTransactionState = create<TransactionStateType>((set) => ({
  transactions: [],
  setTransactions: (transaction: TransactionType[]) =>
    set({ transactions: [...transaction] }),
}));
