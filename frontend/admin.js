const API_URL = "https://order-backend-krh9.onrender.com/orders";

// LOAD ORDERS (with filters)
async function loadOrders() {
  const res = await fetch(API_URL);
  let data = await res.json();

  const nameFilter = document.getElementById("filterName").value.toLowerCase();
  const locationFilter = document.getElementById("filterLocation").value.toLowerCase();
  const dateFilter = document.getElementById("filterDate").value;

  if (nameFilter) {
    data = data.filter(o =>
      o.customer_name.toLowerCase().includes(nameFilter)
    );
  }

  if (locationFilter) {
    data = data.filter(o =>
      (o.location || "").toLowerCase().includes(locationFilter)
    );
  }

  if (dateFilter) {
    data = data.filter(o =>
      new Date(o.created_at).toISOString().split("T")[0] === dateFilter
    );
  }

  const table = document.getElementById("ordersTable");
  table.innerHTML = "";

  data.forEach(order => {
    table.innerHTML += `
      <tr>
        <td>${order.customer_name}</td>
        <td>${order.item}</td>
        <td>${order.quantity}</td>
        <td>${order.location || ""}</td>
        <td>${new Date(order.created_at).toLocaleString()}</td>
      </tr>
    `;
  });
}

// EXPORT CSV
function exportCSV() {
  window.open(API_URL + "/export/csv");
}

// initial load
loadOrders();