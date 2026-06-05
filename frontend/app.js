const API_URL = "https://order-backend-krh9.onrender.com/orders";

// ======================
// ADD ORDER
// ======================
async function addOrder() {
  try {
    const name = document.getElementById("name").value;
    const item = document.getElementById("item").value;
    const qty = document.getElementById("qty").value;

    await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        customer_name: name,
        item: item,
        quantity: Number(qty)
      })
    });

    loadOrders();

  } catch (err) {
    console.error("ADD ERROR:", err);
  }
}

// ======================
// LOAD ORDERS
// ======================
async function loadOrders() {
  try {
    const res = await fetch(API_URL);
    const data = await res.json();

    const table = document.getElementById("ordersTable");
    table.innerHTML = "";

    data.forEach(order => {
      table.innerHTML += `
        <tr>
          <td>${order.customer_name}</td>
          <td>${order.item}</td>
          <td>${order.quantity}</td>
          <td>${new Date(order.created_at).toLocaleString()}</td>
        </tr>
      `;
    });

  } catch (err) {
    console.error("LOAD ERROR:", err);
  }
}

// ======================
// EXPORT CSV (FIXED)
// ======================
function downloadCSV() {
  window.open(
    "https://order-backend-krh9.onrender.com/orders/export/csv",
    "_blank"
  );
}

// ======================
// AUTO LOAD
// ======================
loadOrders();