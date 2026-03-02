import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface Message {
    content: string;
    role: MessageRole;
    timestamp: bigint;
}
export interface Order {
    id: bigint;
    customerName: string;
    status: OrderStatus;
    contactInfo: string;
    totalAmount: string;
    timestamp: bigint;
    quantity: bigint;
    shippingAddress: string;
    product: string;
}
export interface ChatSession {
    id: bigint;
    customerName?: string;
    contactInfo?: string;
    messages: Array<Message>;
    createdAt: bigint;
    currentStep: BotStep;
    address?: string;
    quantity?: bigint;
    product?: string;
    linkedOrderId?: bigint;
}
export enum BotStep {
    askProduct = "askProduct",
    confirmOrder = "confirmOrder",
    greeting = "greeting",
    askContact = "askContact",
    complete = "complete",
    askQuantity = "askQuantity",
    askAddress = "askAddress"
}
export enum MessageRole {
    bot = "bot",
    user = "user"
}
export enum OrderStatus {
    shipped = "shipped",
    cancelled = "cancelled",
    pending = "pending",
    delivered = "delivered",
    confirmed = "confirmed"
}
export interface backendInterface {
    addMessage(sessionId: bigint, role: MessageRole, content: string): Promise<void>;
    createChatSession(): Promise<bigint>;
    createOrder(customerName: string, product: string, quantity: bigint, shippingAddress: string, contactInfo: string, totalAmount: string): Promise<bigint>;
    getAllOrders(): Promise<Array<Order>>;
    getBotResponse(sessionId: bigint, userMessage: string): Promise<string>;
    getChatSession(id: bigint): Promise<ChatSession>;
    getOrder(id: bigint): Promise<Order>;
    updateChatSessionStep(sessionId: bigint, newStep: BotStep): Promise<void>;
    updateCustomerName(sessionId: bigint, name: string): Promise<void>;
    updateOrderStatus(id: bigint, newStatus: OrderStatus): Promise<void>;
}
