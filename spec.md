# SellerBot AI

## Current State
New project. No existing code.

## Requested Changes (Diff)

### Add
- AI chatbot widget that handles customer conversations automatically
- Order collection flow: chatbot asks customers for name, product, quantity, shipping address, contact info
- Seller dashboard showing all collected orders with status tracking
- Simulated AI responses that guide customers through ordering process
- Order management: view, update status (pending/confirmed/shipped/delivered), delete orders
- Customer chat sessions stored with full conversation history
- Dashboard stats: total orders, pending count, revenue summary
- Tron-inspired dark UI with neon cyan/blue glowing elements, grid backgrounds, geometric design

### Modify
- None (new project)

### Remove
- None (new project)

## Implementation Plan

### Backend (Motoko)
- `Order` type: id, customerId, customerName, product, quantity, address, contact, status, timestamp, total
- `ChatSession` type: id, customerId, messages array, orderData (partial), createdAt
- `Message` type: role (user/bot), content, timestamp
- CRUD for orders: createOrder, getOrders, getOrder, updateOrderStatus, deleteOrder
- Chat session management: createSession, getSession, addMessage, getSessions
- AI response generation: rule-based bot logic that collects order details step by step
- Bot state machine: greeting -> ask product -> ask quantity -> ask address -> ask contact -> confirm order -> complete
- Stats query: getStats (totalOrders, pendingCount, confirmedCount, shippedCount)

### Frontend
- Layout: sidebar navigation + main content area
- Pages:
  1. Dashboard: stats cards, recent orders table, quick actions
  2. Orders: full orders list with filters by status, order detail modal
  3. Chat Simulator: demo customer chat interface to test the bot
  4. Live Chats: active chat sessions list with conversation view
- Chatbot widget: floating bot for seller-side preview
- Tron visual design: dark background (#0a0a0f), neon cyan (#00f5ff) accents, glowing borders, scanline effects, grid overlay, monospace fonts
