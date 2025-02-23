const BASE_URL = "https://open.er-api.com/v6/latest"; // Free API

const dropdowns = document.querySelectorAll(".dropdown select");
const btn = document.querySelector("form button");
const fromCurr = document.querySelector(".from select");
const toCurr = document.querySelector(".to select");
const msg = document.querySelector(".msg");

// Country codes for flags
const countryList = {
    AED: "AE", AFN: "AF", XCD: "AG", ALL: "AL", AMD: "AM", ANG: "AN", AOA: "AO",
    ARS: "AR", AUD: "AU", AZN: "AZ", BAM: "BA", BBD: "BB", BDT: "BD", BGN: "BG",
    BHD: "BH", BIF: "BI", BMD: "BM", BND: "BN", BOB: "BO", BRL: "BR", BSD: "BS",
    CAD: "CA", CDF: "CD", XAF: "CF", CHF: "CH", CLP: "CL", CNY: "CN", COP: "CO",
    CRC: "CR", CUP: "CU", CVE: "CV", CZK: "CZ", DJF: "DJ", DKK: "DK", DOP: "DO",
    DZD: "DZ", EGP: "EG", ETB: "ET", EUR: "FR", FJD: "FJ", FKP: "FK", GBP: "GB",
    GEL: "GE", GHS: "GH", GIP: "GI", GMD: "GM", GNF: "GN", GTQ: "GT", HKD: "HK",
    HUF: "HU", IDR: "ID", ILS: "IL", INR: "IN", IQD: "IQ", IRR: "IR", ISK: "IS",
    JMD: "JM", JOD: "JO", JPY: "JP", KES: "KE", KGS: "KG", KHR: "KH", KRW: "KR",
    KWD: "KW", KZT: "KZ", LAK: "LA", LBP: "LB", LKR: "LK", MAD: "MA", MDL: "MD",
    MMK: "MM", MNT: "MN", MOP: "MO", MXN: "MX", MYR: "MY", MZN: "MZ", NAD: "NA",
    NGN: "NG", NOK: "NO", NPR: "NP", NZD: "NZ", OMR: "OM", PAB: "PA", PEN: "PE",
    PHP: "PH", PKR: "PK", PLN: "PL", QAR: "QA", RON: "RO", RUB: "RU", SAR: "SA",
    SDG: "SD", SEK: "SE", SGD: "SG", SYP: "SY", THB: "TH", TJS: "TJ", TND: "TN",
    TRY: "TR", TWD: "TW", TZS: "TZ", UAH: "UA", UGX: "UG", USD: "US", UYU: "UY",
    UZS: "UZ", VEF: "VE", VND: "VN", YER: "YE", ZAR: "ZA", ZMK: "ZM"
};

// Populate dropdowns with currency options
for (let select of dropdowns) {
    for (let currCode in countryList) {
        let newOption = document.createElement("option");
        newOption.innerText = currCode;
        newOption.value = currCode;

        if (select.name === "from" && currCode === "USD") {
            newOption.selected = true; // Default: USD
        }
        if (select.name === "to" && currCode === "INR") {
            newOption.selected = true; // Default: INR
        }

        select.append(newOption);
    }
    
    // Update flag when currency changes
    select.addEventListener("change", (evt) => {
        updateFlag(evt.target);
    });
}

// Function to update currency flags
const updateFlag = (element) => {
    let currCode = element.value;
    let countryCode = countryList[currCode];
    let newSrc = `https://flagsapi.com/${countryCode}/flat/64.png`;
    
    let img = element.parentElement.querySelector("img");
    if (img) {
        img.src = newSrc;
    }
};

// Event listener for conversion button
btn.addEventListener("click", async (evt) => {
    evt.preventDefault();

    let amount = document.querySelector(".amount input");
    let amtval = amount.value;

    if (amtval === "" || amtval < 1) {
        amtval = 1;
        amount.value = "1"; // Default value
    }

    const URL = `${BASE_URL}/${fromCurr.value}`;

    try {
        let response = await fetch(URL);

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        let data = await response.json();
        let rate = data.rates[toCurr.value];

        if (!rate) {
            throw new Error("Invalid currency pair or API issue.");
        }

        let finalAmount = (amtval * rate).toFixed(2); // Format to 2 decimal places
        msg.innerText = `${amtval} ${fromCurr.value} = ${finalAmount} ${toCurr.value}`;
    } catch (error) {
        msg.innerText = "Error fetching exchange rate. Please try again later.";
        console.error(error);
    }
});
