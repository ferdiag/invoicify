// userstore.ts
import { create } from 'zustand';
import { combine } from 'zustand/middleware';
import { states } from './states';
import { actions } from './actions';
import type { State, Actions, UserStoreType } from './types';

export const useUserStore = create<UserStoreType>()(
  combine<State, Actions>(states, (set, get) => ({
    ...actions(set, get),
  })),
);
