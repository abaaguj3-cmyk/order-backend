const API_URL = "https://order-backend-krh9.onrender.com/orders";

let pendingOrder = null;

function previewOrder() {
    const name = document.getElementById("name").value;
    const location = document.getElementById("location").value;

    const item1 = document.getElementById("item1").value;
    const qty1 = document.getElementById("qty1").value;

    const item2 = document.getElementById("item2").value;
    const qty2 = document.getElementById("qty2").value;

    if (!name || !location) {
        alert("Please fill name and location");
        return;
    }

    pendingOrder = {
        customer_name: name,
        location: location,
        items: [
            item1 && { item: item1, quantity: Number(qty1) },
            item2 && { item: item2, quantity: Number(qty2) }
        ].filter(Boolean)
    };

    document.getElementById("preview").innerHTML = `
        <p><b>Name:</b> ${name}</p>
        <p><b>Location:</b> ${location}</p>
        <p><b>Items:</b></p>
        <ul>
            ${pendingOrder.items.map(i =>
                `<li>${i.item} - ${i.quantity}</li>`
            ).join("")}
        </ul>
    `;

    document.getElementById("modal").classList.remove("hidden");
}

function closeModal() {
    document.getElementById("modal").classList.add("hidden");
}

async function submitOrder() {
    await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(pendingOrder)
    });

    alert("Order submitted!");
    closeModal();

    location.reload();
}