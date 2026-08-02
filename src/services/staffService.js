import { supabase } from "../supabase/client";

const normalizeOrder = (order) => ({
  ...order,
  id: order.id,
  customer_name: order.customer_name || order.customer || order.customer_name || "Unknown Customer",
  movie_title: order.movie_title || order.movie || order.movie_title || "Unknown Movie",
  amount: Number(order.amount ?? order.total ?? 0),
  status: order.status || "pending",
  priority: order.priority || "normal",
  created_at: order.created_at || order.updated_at,
});

const normalizeTicket = (ticket) => ({
  ...ticket,
  id: ticket.id,
  customer_name: ticket.customer_name || ticket.customer || "Customer",
  subject: ticket.subject || ticket.title || "Support Request",
  status: ticket.status || "open",
  priority: ticket.priority || "normal",
  message: ticket.message || ticket.body || "No details provided.",
  updated_at: ticket.updated_at || ticket.created_at,
  created_at: ticket.created_at,
});

const normalizeMessage = (message) => ({
  ...message,
  id: message.id,
  sender_name: message.sender_name || message.from || "Staff",
  recipient_name: message.recipient_name || message.to || "Customer",
  body: message.body || message.message || "",
  is_read: message.is_read ?? message.unread === false ? true : message.unread === true ? false : false,
  created_at: message.created_at,
});

const normalizeMovie = (movie) => ({
  ...movie,
  id: movie.id,
  title: movie.title || movie.name || "Untitled Movie",
  stock: Number(movie.stock ?? 0),
  threshold: Number(movie.stock_threshold ?? movie.reorder_point ?? 0),
  critical_threshold: Number(movie.stock_critical_threshold ?? 0),
});

export const staffService = {
  async getOrders() {
    const { data, error } = await supabase
      .from("orders")
      .select("id, customer_name, customer, movie_title, movie, amount, total, status, priority, created_at")
      .order("created_at", { ascending: false });

    if (error) throw error;

    return (data || []).map(normalizeOrder);
  },

  async getInventory() {
    const { data, error } = await supabase
      .from("movies")
      .select("id, title, name, stock, stock_threshold, stock_critical_threshold, reorder_point, genre")
      .order("title", { ascending: true });

    if (error) throw error;

    return (data || []).map(normalizeMovie);
  },

  async getDashboard() {
    const [ordersResult, ticketsResult, messagesResult, moviesResult] = await Promise.all([
      supabase
        .from("orders")
        .select("id, customer_name, customer, movie_title, movie, amount, total, status, priority, created_at")
        .order("created_at", { ascending: false }),
      supabase
        .from("support_tickets")
        .select("id, customer_name, customer, subject, title, status, priority, message, body, created_at, updated_at")
        .order("updated_at", { ascending: false }),
      supabase
        .from("messages")
        .select("id, sender_name, from, recipient_name, to, body, message, is_read, unread, created_at")
        .order("created_at", { ascending: false })
        .limit(10),
      supabase
        .from("movies")
        .select("id, title, name, stock, stock_threshold, stock_critical_threshold, reorder_point")
        .order("stock", { ascending: true })
        .limit(20),
    ]);

    const orders = (ordersResult.data || []).map(normalizeOrder);
    const tickets = (ticketsResult.data || []).map(normalizeTicket);
    const messages = (messagesResult.data || []).map(normalizeMessage);
    const inventory = (moviesResult.data || []).map(normalizeMovie);

    const today = new Date().toDateString();
    const ordersToday = orders.filter((order) => new Date(order.created_at).toDateString() === today).length;
    const pendingOrders = orders.filter((order) => order.status === "pending").length;
    const openSupportTickets = tickets.filter((ticket) => ticket.status === "open").length;
    const unreadMessages = messages.filter((message) => !message.is_read).length;

    const stockValues = inventory.map((movie) => movie.stock).filter((stock) => stock >= 0);
    const averageStock = stockValues.length ? stockValues.reduce((sum, stock) => sum + stock, 0) / stockValues.length : 0;
    const dynamicLow = Math.max(1, Math.round(averageStock * 0.35));
    const dynamicCritical = Math.max(1, Math.round(averageStock * 0.12));

    const inventoryAlerts = inventory
      .map((movie) => {
        const threshold = movie.threshold || dynamicLow;
        const criticalThreshold = movie.critical_threshold || dynamicCritical;
        const stock = movie.stock;
        let status = "ok";

        if (stock <= 0) {
          status = "out-of-stock";
        } else if (stock <= criticalThreshold) {
          status = "critical";
        } else if (stock <= threshold) {
          status = "low";
        }

        return {
          ...movie,
          status,
          threshold: threshold || Math.max(1, Math.ceil(stock * 0.35)),
          critical_threshold: criticalThreshold || Math.max(1, Math.ceil(stock * 0.12)),
        };
      })
      .filter((movie) => movie.status !== "ok")
      .slice(0, 6);

    return {
      orders,
      tickets,
      messages,
      inventory,
      inventoryAlerts,
      stats: {
        ordersToday,
        pendingOrders,
        openSupportTickets,
        lowStockMovies: inventoryAlerts.length,
        unreadMessages,
      },
    };
  },

  async updateOrderStatus(orderId, status) {
    const { data, error } = await supabase
      .from("orders")
      .update({ status })
      .eq("id", orderId)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async updateTicketStatus(ticketId, status) {
    const { data, error } = await supabase
      .from("support_tickets")
      .update({ status })
      .eq("id", ticketId)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async markMessageRead(messageId) {
    const { data, error } = await supabase
      .from("messages")
      .update({ is_read: true })
      .eq("id", messageId)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async createContactTicket({ customerName, customerEmail, subject, message }) {
    const ticketPayload = {
      customer_name: customerName,
      customer_email: customerEmail,
      subject: subject || "Contact Form Submission",
      message,
      body: message,
      status: "open",
      priority: "normal",
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    const { data: ticket, error: ticketError } = await supabase
      .from("support_tickets")
      .insert(ticketPayload)
      .select()
      .single();

    if (ticketError) throw ticketError;

    const messagePayload = {
      sender_name: customerName,
      recipient_name: "CinemaHub Staff",
      body: message,
      message,
      is_read: false,
      ticket_id: ticket?.id || null,
      created_at: new Date().toISOString(),
    };

    const { error: messageError } = await supabase
      .from("messages")
      .insert(messagePayload);

    if (messageError) {
      console.error("Unable to log contact message to staff inbox:", messageError);
    }

    return ticket;
  },

  async sendMessage({ recipientName, body, ticketId }) {
    const payload = {
      recipient_name: recipientName,
      message: body,
      body,
      is_read: false,
      ticket_id: ticketId || null,
    };

    const { data, error } = await supabase
      .from("messages")
      .insert(payload)
      .select()
      .single();

    if (error) throw error;
    return data;
  },
};
