const API_URL =
    "https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=10&page=1&sparkline=false";

let coins = [];
let filteredCoins = [];

const tableBody = document.getElementById("coinTableBody");
const searchInput = document.getElementById("searchInput");
const searchBtn = document.getElementById("searchBtn");
const marketCapBtn = document.getElementById("marketCapBtn");
const percentageBtn = document.getElementById("percentageBtn");
const refreshBtn = document.getElementById("refreshBtn");

const loading = document.getElementById("loading");
const error = document.getElementById("error");


// ======================================================
// 1. FETCH USING .then()
// ======================================================

function fetchCoinsUsingThen() {

    loading.style.display = "block";
    error.textContent = "";

    fetch(API_URL)
        .then((response) => {

            if (!response.ok) {
                throw new Error("Failed to fetch cryptocurrency data");
            }

            return response.json();
        })

        .then((data) => {

            coins = data;
            filteredCoins = [...coins];

            renderCoins(filteredCoins);

        })

        .catch((err) => {

            console.error(err);
            error.textContent = "Unable to fetch coin data.";

        })

        .finally(() => {

            loading.style.display = "none";

        });
}


// ======================================================
// 2. FETCH USING ASYNC / AWAIT
// ======================================================

async function fetchCoinsUsingAsyncAwait() {

    loading.style.display = "block";
    error.textContent = "";

    try {

        const response = await fetch(API_URL);

        if (!response.ok) {
            throw new Error("Failed to fetch cryptocurrency data");
        }

        const data = await response.json();

        coins = data;
        filteredCoins = [...coins];

        renderCoins(filteredCoins);

    }

    catch (err) {

        console.error(err);
        error.textContent = "Unable to fetch coin data.";

    }

    finally {

        loading.style.display = "none";

    }
}


// ======================================================
// 3. RENDER COINS
// ======================================================

function renderCoins(data) {

    tableBody.innerHTML = "";

    if (data.length === 0) {

        tableBody.innerHTML = `
            <tr>
                <td colspan="7">
                    No coins found
                </td>
            </tr>
        `;

        return;
    }

    data.forEach((coin) => {

        const row = document.createElement("tr");

        const percentage =
            coin.price_change_percentage_24h ?? 0;

        const percentageClass =
            percentage >= 0 ? "positive" : "negative";

        row.innerHTML = `

            <td>
                ${coin.name}
            </td>

            <td class="symbol">
                ${coin.symbol}
            </td>

            <td>
                <img
                    src="${coin.image}"
                    alt="${coin.name}"
                    class="coin-image"
                >
            </td>

            <td>
                $${formatNumber(coin.current_price)}
            </td>

            <td>
                $${formatNumber(coin.total_volume)}
            </td>

            <td>
                $${formatNumber(coin.market_cap)}
            </td>

            <td class="${percentageClass}">
                ${percentage.toFixed(2)}%
            </td>

        `;

        tableBody.appendChild(row);

    });
}


// ======================================================
// 4. SEARCH FUNCTIONALITY
// ======================================================

function searchCoins() {

    const searchValue =
        searchInput.value.trim().toLowerCase();

    filteredCoins = coins.filter((coin) => {

        return (
            coin.name.toLowerCase().includes(searchValue) ||
            coin.symbol.toLowerCase().includes(searchValue) ||
            coin.id.toLowerCase().includes(searchValue)
        );

    });

    renderCoins(filteredCoins);
}


// ======================================================
// 5. SORT BY MARKET CAP
// ======================================================

function sortByMarketCap() {

    filteredCoins.sort((a, b) => {

        return b.market_cap - a.market_cap;

    });

    renderCoins(filteredCoins);
}


// ======================================================
// 6. SORT BY PERCENTAGE CHANGE
// ======================================================

function sortByPercentage() {

    filteredCoins.sort((a, b) => {

        const percentageA =
            a.price_change_percentage_24h ?? 0;

        const percentageB =
            b.price_change_percentage_24h ?? 0;

        return percentageB - percentageA;

    });

    renderCoins(filteredCoins);
}


// ======================================================
// 7. FORMAT LARGE NUMBERS
// ======================================================

function formatNumber(number) {

    if (number === null || number === undefined) {
        return "N/A";
    }

    return Number(number).toLocaleString("en-US", {
        maximumFractionDigits: 2
    });
}


// ======================================================
// 8. EVENT LISTENERS
// ======================================================

searchBtn.addEventListener("click", searchCoins);

searchInput.addEventListener("keyup", (event) => {

    if (event.key === "Enter") {
        searchCoins();
    }

});

marketCapBtn.addEventListener(
    "click",
    sortByMarketCap
);

percentageBtn.addEventListener(
    "click",
    sortByPercentage
);


// Refresh demonstrates async/await
refreshBtn.addEventListener(
    "click",
    fetchCoinsUsingAsyncAwait
);


// ======================================================
// 9. INITIAL API CALL
// ======================================================

// Initial fetch uses .then()
fetchCoinsUsingThen();
