import Map "mo:core/Map";
import Array "mo:core/Array";
import Time "mo:core/Time";
import Runtime "mo:core/Runtime";
import List "mo:core/List";
import Text "mo:core/Text";
import Nat "mo:core/Nat";

actor {
  type OrderStatus = {
    #pending;
    #confirmed;
    #shipped;
    #delivered;
    #cancelled;
  };

  type Order = {
    id : Nat;
    customerName : Text;
    product : Text;
    quantity : Nat;
    shippingAddress : Text;
    contactInfo : Text;
    totalAmount : Text;
    status : OrderStatus;
    timestamp : Int;
  };

  type BotStep = {
    #greeting;
    #askProduct;
    #askQuantity;
    #askAddress;
    #askContact;
    #confirmOrder;
    #complete;
  };

  type MessageRole = {
    #user;
    #bot;
  };

  type Message = {
    role : MessageRole;
    content : Text;
    timestamp : Int;
  };

  type ChatSession = {
    id : Nat;
    customerName : ?Text;
    messages : [Message];
    currentStep : BotStep;
    createdAt : Int;
    linkedOrderId : ?Nat;
    product : ?Text;
    quantity : ?Nat;
    address : ?Text;
    contactInfo : ?Text;
  };

  // Storage
  let ordersMap = Map.empty<Nat, Order>();
  var nextOrderId = 1;

  let chatsMap = Map.empty<Nat, ChatSession>();
  var nextChatId = 1;

  // Order Management
  public shared ({ caller }) func createOrder(customerName : Text, product : Text, quantity : Nat, shippingAddress : Text, contactInfo : Text, totalAmount : Text) : async Nat {
    let id = nextOrderId;
    let newOrder : Order = {
      id;
      customerName;
      product;
      quantity;
      shippingAddress;
      contactInfo;
      totalAmount;
      status = #pending;
      timestamp = Time.now();
    };
    ordersMap.add(id, newOrder);
    nextOrderId += 1;
    id;
  };

  public query ({ caller }) func getOrder(id : Nat) : async Order {
    switch (ordersMap.get(id)) {
      case (null) { Runtime.trap("Order does not exist") };
      case (?order) { order };
    };
  };

  public query ({ caller }) func getAllOrders() : async [Order] {
    ordersMap.values().toArray();
  };

  public shared ({ caller }) func updateOrderStatus(id : Nat, newStatus : OrderStatus) : async () {
    switch (ordersMap.get(id)) {
      case (null) { Runtime.trap("Order does not exist") };
      case (?order) {
        let updatedOrder = { order with status = newStatus };
        ordersMap.add(id, updatedOrder);
      };
    };
  };

  // Chat Session Management
  public shared ({ caller }) func createChatSession() : async Nat {
    let id = nextChatId;
    let newSession : ChatSession = {
      id;
      customerName = null;
      messages = [];
      currentStep = #greeting;
      createdAt = Time.now();
      linkedOrderId = null;
      product = null;
      quantity = null;
      address = null;
      contactInfo = null;
    };
    chatsMap.add(id, newSession);
    nextChatId += 1;
    id;
  };

  public query ({ caller }) func getChatSession(id : Nat) : async ChatSession {
    switch (chatsMap.get(id)) {
      case (null) { Runtime.trap("Chat session does not exist") };
      case (?session) { session };
    };
  };

  public shared ({ caller }) func addMessage(sessionId : Nat, role : MessageRole, content : Text) : async () {
    switch (chatsMap.get(sessionId)) {
      case (null) { Runtime.trap("Chat session does not exist") };
      case (?session) {
        let newMessage : Message = {
          role;
          content;
          timestamp = Time.now();
        };
        let messagesList = List.fromArray<Message>(session.messages);
        messagesList.add(newMessage);
        let updatedSession = { session with messages = messagesList.toArray() };
        chatsMap.add(sessionId, updatedSession);
      };
    };
  };

  public shared ({ caller }) func updateChatSessionStep(sessionId : Nat, newStep : BotStep) : async () {
    switch (chatsMap.get(sessionId)) {
      case (null) { Runtime.trap("Chat session does not exist") };
      case (?session) {
        let updatedSession = { session with currentStep = newStep };
        chatsMap.add(sessionId, updatedSession);
      };
    };
  };

  public shared ({ caller }) func updateCustomerName(sessionId : Nat, name : Text) : async () {
    switch (chatsMap.get(sessionId)) {
      case (null) { Runtime.trap("Chat session does not exist") };
      case (?session) {
        let updatedSession = { session with customerName = ?name };
        chatsMap.add(sessionId, updatedSession);
      };
    };
  };

  // Bot Logic
  public shared ({ caller }) func getBotResponse(sessionId : Nat, userMessage : Text) : async Text {
    switch (chatsMap.get(sessionId)) {
      case (null) { Runtime.trap("Chat session does not exist") };
      case (?session) {
        let response = switch (session.currentStep) {
          case (#greeting) { "Welcome! What's the product you're interested in?" };
          case (#askProduct) { "How many units would you like to order?" };
          case (#askQuantity) { "Please provide your shipping address." };
          case (#askAddress) { "Can I have your contact information?" };
          case (#askContact) { "Let's confirm your order details." };
          case (#confirmOrder) { "Thank you! Your order is complete." };
          case (#complete) { "Thank you! Your order is complete." };
        };
        await addMessage(sessionId, #bot, response);
        response;
      };
    };
  };
};
