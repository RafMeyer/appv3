const cardTemplates = {
  "START": {
    name: "START",
    title: "START Card",
    sub: "Rose / Blue Mastercard",
    css: "start",
    number: "5555 2300 4941 0001",
    expiry: "09/29",
    cvv: "274"
  },
  "Y": {
    name: "Y",
    title: "Y Elite",
    sub: "Private Elite · Forest green",
    css: "y",
    number: "5555 9800 4941 0002",
    expiry: "11/30",
    cvv: "905"
  },
  "X": {
    name: "X",
    title: "X Electric",
    sub: "Electric blue performance",
    css: "x",
    number: "5555 2800 4941 0003",
    expiry: "04/30",
    cvv: "888"
  },
  "+": {
    name: "+",
    title: "+ Private",
    sub: "Deep blue private banking",
    css: "plus",
    number: "5555 8880 4941 0004",
    expiry: "12/31",
    cvv: "221"
  }
};

let cards = ["START", "Y", "X", "+"];
let currentCard = null;
let revealed = false;
let frozen = false;

function showScreen(id) {
  document.querySelectorAll(".screen").forEach(s => s.classList.remove("active"));
  document.getElementById(id).classList.add("active");
  window.scrollTo(0, 0);
}

function openApp() {
  const username = document.getElementById("username").value || "Client";
  document.getElementById("hello").innerText = username.split("@")[0];
  renderCards();
  showScreen("home");
}

function setTheme(theme) {
  document.body.className = theme;
  fakeDone("Theme changed");
}

function setSpace(space) {
  const data = {
    personal: ["Personal balance", "€48,920.55", "+ €1,240 this month"],
    business: ["Business balance", "€88,210.00", "Invoices ready"],
    vault: ["Vault balance", "€240,000.00", "Private savings protected"]
  };

  document.getElementById("spaceLabel").innerText = data[space][0];
  document.getElementById("spaceBalance").innerText = data[space][1];
  document.getElementById("spaceSubtitle").innerText = data[space][2];

  document.querySelectorAll(".tabs button").forEach(b => b.classList.remove("active"));
  if (space === "personal") document.getElementById("tabPersonal").classList.add("active");
  if (space === "business") document.getElementById("tabBusiness").classList.add("active");
  if (space === "vault") document.getElementById("tabVault").classList.add("active");
}

function renderCards() {
  const list = document.getElementById("cardsList");
  if (!list) return;
  list.innerHTML = "";
  cards.forEach((key, index) => {
    const c = cardTemplates[key];
    const div = document.createElement("div");
    div.className = "card " + c.css;
    div.onclick = () => openCardDetail(key);
    div.innerHTML = `
      <p>STARTBANK</p>
      <h1>${c.name}</h1>
      <span>${c.sub}</span>
    `;
    list.appendChild(div);
  });
}

function openCardDetail(key) {
  currentCard = key;
  revealed = false;
  frozen = false;
  const c = cardTemplates[key];

  document.getElementById("detailTitle").innerText = c.title;
  document.getElementById("detailCardName").innerText = c.name;
  document.getElementById("detailCardSub").innerText = c.sub;
  document.getElementById("cardExpiry").innerText = c.expiry;
  document.getElementById("cardCvv").innerText = "•••";
  document.getElementById("cardNumber").innerText = maskNumber(c.number);

  const detail = document.getElementById("detailCard");
  detail.className = "card big-card " + c.css;

  document.getElementById("revealBtn").innerText = "Reveal";
  document.getElementById("freezeBtn").innerText = "Freeze card";

  showScreen("cardDetail");
}

function maskNumber(num) {
  const parts = num.split(" ");
  return "•••• •••• •••• " + parts[3];
}

function toggleCardNumber() {
  if (!currentCard) return;
  const c = cardTemplates[currentCard];
  revealed = !revealed;
  document.getElementById("cardNumber").innerText = revealed ? c.number : maskNumber(c.number);
  document.getElementById("cardCvv").innerText = revealed ? c.cvv : "•••";
  document.getElementById("revealBtn").innerText = revealed ? "Hide" : "Reveal";
  fakeDone(revealed ? "Sensitive details revealed" : "Sensitive details hidden");
}

function toggleFreeze() {
  frozen = !frozen;
  const detail = document.getElementById("detailCard");
  detail.classList.toggle("frozen", frozen);
  document.getElementById("freezeBtn").innerText = frozen ? "Unfreeze card" : "Freeze card";
  fakeDone(frozen ? "Card frozen" : "Card unfrozen");
}

function copyCard() {
  if (!currentCard) return;
  const c = cardTemplates[currentCard];
  navigator.clipboard?.writeText(c.number);
  fakeDone("Card number copied");
}

function openAddCard() {
  showScreen("addCard");
}

function addCard(type) {
  cards.push(type);
  renderCards();
  fakeDone(type + " card added");
  showScreen("cards");
}

function fakeDone(message) {
  const toast = document.getElementById("toast");
  toast.innerText = message;
  toast.classList.add("show");
  setTimeout(() => toast.classList.remove("show"), 1800);
}

class BottomNav extends HTMLElement {
  connectedCallback() {
    this.innerHTML = `
      <nav>
        <button onclick="showScreen('home')">Home</button>
        <button onclick="showScreen('cards')">Cards</button>
        <button onclick="showScreen('elite')">Elite</button>
        <button onclick="showScreen('settings')">Style</button>
      </nav>
    `;
  }
}
customElements.define("bottom-nav", BottomNav);

window.addEventListener("load", renderCards);

if ("serviceWorker" in navigator) {
  navigator.serviceWorker.register("service-worker.js");
}
