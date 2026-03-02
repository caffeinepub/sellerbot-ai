import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { ChatSession, Order, OrderStatus } from "../backend.d";
import { useActor } from "./useActor";

// ─── Orders ──────────────────────────────────────────────────────────────────

export function useAllOrders() {
  const { actor, isFetching } = useActor();
  return useQuery<Order[]>({
    queryKey: ["orders"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllOrders();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useOrder(id: bigint) {
  const { actor, isFetching } = useActor();
  return useQuery<Order>({
    queryKey: ["order", id.toString()],
    queryFn: async () => {
      if (!actor) throw new Error("No actor");
      return actor.getOrder(id);
    },
    enabled: !!actor && !isFetching,
  });
}

export function useUpdateOrderStatus() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, status }: { id: bigint; status: OrderStatus }) => {
      if (!actor) throw new Error("No actor");
      return actor.updateOrderStatus(id, status);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["orders"] });
    },
  });
}

// ─── Chat Sessions ────────────────────────────────────────────────────────────

export function useChatSession(id: bigint | null) {
  const { actor, isFetching } = useActor();
  return useQuery<ChatSession>({
    queryKey: ["session", id?.toString()],
    queryFn: async () => {
      if (!actor || id === null) throw new Error("No actor or id");
      return actor.getChatSession(id);
    },
    enabled: !!actor && !isFetching && id !== null,
    refetchInterval: 2000,
  });
}

export function useCreateChatSession() {
  const { actor } = useActor();
  return useMutation({
    mutationFn: async () => {
      if (!actor) throw new Error("No actor");
      return actor.createChatSession();
    },
  });
}

export function useGetBotResponse() {
  const { actor } = useActor();
  return useMutation({
    mutationFn: async ({
      sessionId,
      userMessage,
    }: {
      sessionId: bigint;
      userMessage: string;
    }) => {
      if (!actor) throw new Error("No actor");
      return actor.getBotResponse(sessionId, userMessage);
    },
  });
}

export function useAddMessage() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      sessionId,
      role,
      content,
    }: {
      sessionId: bigint;
      role: import("../backend.d").MessageRole;
      content: string;
    }) => {
      if (!actor) throw new Error("No actor");
      return actor.addMessage(sessionId, role, content);
    },
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["session", variables.sessionId.toString()],
      });
    },
  });
}
