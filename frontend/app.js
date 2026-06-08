const API_URL = "https://order-backend-krh9.onrender.com/orders";

let pendingOrder = null;

function previewOrder() {
    const name = document.getElementById("name").value;
    const location = document.getElementById("location").value;

    if (!name || !location) {
        alert("Name and location required");
        return;
    }

    const items = [];

    const appetizer = document.getElementById("appetizer").value;
    const appetizerQty = document.getElementById("appetizerQty").value;

    const main = document.getElementById("main").value;
    const mainQty = document.getElementById("mainQty").value;

    const drink = document.getElementById("drink").value;
    const drinkQty = document.getElementById("drinkQty").value;

    if (appetizer) items.push({ category: "appetizer", name: appetizer, qty: Number(appetizerQty) || 1 });
    if (main) items.push({ category: "main", name: main, qty: Number(mainQty) || 1 });
    if (drink) items.push({ category: "drink", name: drink, qty: Number(drinkQty) || 1 });

    if (items.length === 0) {
        alert("Please select at least one item");
        return;
    }

    pendingOrder = { customer_name: name, location, items };

    document.getElementById("preview").innerHTML = `
        <p><b>Name:</b> ${name}</p>
        <p><b>Location:</b> ${location}</p>
        <p><b>Items:</b></p>
        <ul>
            ${items.map(i => `<li>${i.category}: ${i.name} x${i.qty}</li>`).join("")}
        </ul>
    `;

    document.getElementById("modal").classList.remove("hidden");
}

function closeModal() {
    document.getElementById("modal").classList.add("hidden");
}

async function submitOrder() {
    try {
        const res = await fetch(API_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(pendingOrder)
        });

        const data = await res.json();

        if (!res.ok) {
            throw new Error(data.error || "Failed");
        }

        alert("Order submitted successfully!");
        closeModal();
        location.reload();

    } catch (err) {
        alert("Error: " + err.message);
    }
}