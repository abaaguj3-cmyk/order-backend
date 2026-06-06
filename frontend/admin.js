const API_URL = "https://order-backend-krh9.onrender.com/orders";

let ordersCache = [];

async function loadOrders() {
    const res = await fetch(API_URL);
    const data = await res.json();

    ordersCache = data;
    renderTable(data);
}

function renderTable(data) {
    const table = document.getElementById("ordersTable");
    table.innerHTML = "";

    data.forEach(order => {
        const items = Array.isArray(order.items)
            ? order.items.map(i => `${i.item} (${i.quantity})`).join(", ")
            : "";

        table.innerHTML += `
            <tr>
                <td>${order.customer_name}</td>
                <td>${order.location || ""}</td>
                <td>${items}</td>
                <td>${new Date(order.created_at).toLocaleString()}</td>
            </tr>
        `;
    });
}

// FILTERS
function applyFilters() {
    const name = document.getElementById("filterName").value.toLowerCase();
    const location = document.getElementById("filterLocation").value.toLowerCase();
    const date = document.getElementById("filterDate").value;

    const filtered = ordersCache.filter(order => {
        const matchName = order.customer_name.toLowerCase().includes(name);
        const matchLocation = (order.location || "").toLowerCase().includes(location);
        const matchDate = date
            ? new Date(order.created_at).toISOString().slice(0,10) === date
            : true;

        return matchName && matchLocation && matchDate;
    });

    renderTable(filtered);
}

// attach filter events
["filterName", "filterLocation", "filterDate"].forEach(id => {
    document.addEventListener("input", applyFilters);
});

// CSV EXPORT
function exportCSV() {
    let csv = "Name,Location,Items,Date\n";

    ordersCache.forEach(o => {
        const items = Array.isArray(o.items)
            ? o.items.map(i => `${i.item}(${i.quantity})`).join("|")
            : "";

        csv += `${o.customer_name},${o.location || ""},${items},${o.created_at}\n`;
    });

    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = "orders.csv";
    a.click();
}

loadOrders();