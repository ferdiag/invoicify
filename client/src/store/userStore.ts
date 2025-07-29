// userstore.ts
import { create } from "zustand";
import { combine } from "zustand/middleware";
import { states } from "./states";
import { actions } from "./actions";
import type { State, Actions } from "./types";

// Wir definieren unseren Store-Typ als Schnittmenge aus State + Actions
export type UserStore = State & Actions;

export const useUserStore = create<UserStore>()(
  combine<State, Actions>(states, (set, get) => ({
    ...actions(set, get),
  }))
);
