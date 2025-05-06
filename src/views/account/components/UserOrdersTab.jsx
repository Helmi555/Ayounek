import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import firebaseInstance from "@/services/firebase";

const UserOrdersTab = ({ email }) => {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    console.info("email is : ", email);

    const fetchOrders = async () => {
      try {
        const orders = await firebaseInstance.getOrders(email);
        setOrders(orders.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
        console.info("Orders are : ", orders);
      } catch (error) {
        console.error("Error fetching orders: ", error);
      }
    };
    fetchOrders();
  }, []);

  console.log("orders:", orders);

  if (!orders || orders.length === 0) {
    return (
      <div className="loader" style={{ minHeight: "80vh" }}>
        <h3>My Orders</h3>
        <strong>
          <span className="text-subtle">You don&apos;t have any orders</span>
        </strong>
      </div>
    );
  }

  return (
    <div
      style={{
        maxWidth: "800px",
        margin: "auto",
        padding: "20px",
        background: "white",
        borderRadius: "8px",
        boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
      }}
    >
      <h2
        style={{ fontSize: "24px", fontWeight: "bold", marginBottom: "16px" }}
      >
        My Orders
      </h2>

      {orders.length > 0 ? (
        <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
          {orders.map((order) => (
            <div
              key={order.id}
              style={{
                padding: "16px",
                border: "1px solid #ddd",
                borderRadius: "6px",
                background: "#f9f9f9",
                transition: "background 0.3s",
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: "10px",
                }}
              >
                <h3 style={{ fontSize: "18px", fontWeight: "semi-bold"}}>
                  Order ID: {order.id.slice(0, 6)}***
                </h3>
                <span
                  style={{
                    padding: "6px 10px",
                    borderRadius: "4px",
                    fontWeight: "bold",
                    background:
                      order.status === "Completed"
                        ? "#c8e6c9"
                        : order.status === "Pending"
                        ? "#fff3cd"
                        : "#cce5ff",
                    color:
                      order.status === "Completed"
                        ? "#2e7d32"
                        : order.status === "Pending"
                        ? "#856404"
                        : "#004085",
                  }}
                >
                  {order.status}
                </span>
              </div>

              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "10px",
                  marginTop: "10px",
                }}
              >
                {order.basket.map((product, index) => (
                  <div
                    key={index}
                    style={{
                      display: "flex",
                      gap: "16px",
                      alignItems: "center",
                      border: "1px solid #eee",
                      padding: "12px",
                      borderRadius: "6px",
                      background: "#fff",
                    }}
                  >
                    <img
                      src={product.imageUrl}
                      alt={product.name}
                      style={{
                        width: "80px",
                        height: "80px",
                        objectFit: "contain",
                        borderRadius: "4px",
                        border: "1px solid #ddd",
                      }}
                    />
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: "4px",
                      }}
                    >
                      <strong style={{ fontSize: "16px" }}>
                        {product.name}
                      </strong>
                      <span style={{ fontSize: "14px", color: "#333" }}>
                        💰 Price: {product.price} TND
                      </span>
                      <span style={{ fontSize: "14px", color: "#333" }}>
                        🔢 Quantity: {product.quantity}
                      </span>
                      <span style={{ fontSize: "14px", color: "#333" }}>
                        📏 Size: {product.selectedSize}
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              <p style={{ fontSize: "14px", color: "#555", marginTop: "10px" }}>
                📅 Date:{" "}
                {new Date(order.date).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </p>
              <p
                style={{
                  fontSize: "14px",
                  fontWeight: "500",
                  color: "#333",
                  marginTop: "6px",
                }}
              >
                💰 Total: {order.total} TND
              </p>
            </div>
          ))}
        </div>
      ) : (
        <p style={{ textAlign: "center", fontSize: "16px", color: "#777" }}>
          No orders found. Start shopping now! 🛍️
        </p>
      )}
    </div>
  );
};

export default UserOrdersTab;
