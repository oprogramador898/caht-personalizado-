// Variáveis globais
const chatDiv = document.getElementById("chat");
const userInput = document.getElementById("userInput");
const sendMessageButton = document.getElementById("sendMessage");
const addQAButton = document.getElementById("addQAButton");
const chatNameInput = document.getElementById("chatNameInput");
const setChatNameButton = document.getElementById("setChatName");

let chatName = "";
let qaPairs = [
    { question: "Olá", answer: "Olá, como posso te ajudar?" }
];
let customQAPairs = [];
let userNames = [];

// Desabilitar a entrada do usuário e o botão de enviar mensagem inicialmente
userInput.disabled = true;
sendMessageButton.disabled = true;

// Adicionar mensagem de boas-vindas
addMessageToChat("Bem-vindo ao Chatbot Personalizado! Por favor, digite seu nome para começar a conversar.", "bot");

// Adicionar evento de clique para definir o nome do chat
setChatNameButton.addEventListener("click", () => {
    const newName = chatNameInput.value.trim();
    if (newName) {
        setChatName(newName);
    }
});

// Carregar o nome do chat ao iniciar a página
loadChatName();

// Adicionar evento de clique para enviar mensagem
sendMessageButton.addEventListener("click", () => {
    const userQuestion = userInput.value.trim();
    if (userQuestion) {
        sendMessage(userQuestion);
    }
});

// Adicionar evento de clique para adicionar pergunta e resposta personalizada
addQAButton.addEventListener("click", () => {
    const newQuestion = document.getElementById("newQuestion").value.trim();
    const newAnswer = document.getElementById("newAnswer").value.trim();
    if (newQuestion && newAnswer) {
        addCustomQA(newQuestion, newAnswer);
    }
});

// Enviar mensagem
function sendMessage(message) {
    addMessageToChat(`${chatName}: ${message}`, "user");
    const chatResponse = getChatResponse(message);
    addMessageToChat(`Chatbot: ${chatResponse}`, "bot");
    userInput.value = "";
    qaPairs.push({ question: message, answer: chatResponse });
}

// Obter resposta do chatbot
function getChatResponse(userQuestion) {
    userQuestion = normalizeText(userQuestion);
    const existingPair = qaPairs.find(pair => normalizeText(pair.question) === userQuestion);
    if (existingPair) {
        return existingPair.answer;
    } else {
        return "Não tenho uma resposta para essa pergunta. Que tal adicionar essa pergunta e resposta?";
    }
}

// Adicionar mensagem ao chat
function addMessageToChat(message, sender) {
    const messageDiv = document.createElement("div");
    messageDiv.classList.add("message", sender);
    messageDiv.textContent = message;
    chatDiv.appendChild(messageDiv);
}

// Definir o nome do chat
function setChatName(name) {
    chatName = name;
    chatNameInput.value = "";
    userNames.push(name);
    userInput.disabled = false;
    sendMessageButton.disabled = false;
    addMessageToChat(`Tudo bem, ${chatName}! Como posso ajudar?`, "bot");
    // Salvar o nome do chat no armazenamento local
    localStorage.setItem('chatName', chatName);
}

// Carregar o nome do chat
function loadChatName() {
    const storedChatName = localStorage.getItem('chatName');
    if (storedChatName) {
        setChatName(storedChatName);
    }
}

// Adicionar pergunta e resposta personalizada
function addCustomQA(question, answer) {
    const newPair = { question, answer };
    if (!qaPairs.some(pair => pair.question === question)) {
        qaPairs.push(newPair);
        addQAItemToLocalStorage(question, answer);
        document.getElementById("newQuestion").value = "";
        document.getElementById("newAnswer").value = "";
    }
}

// Normalizar texto (remover caracteres especiais e converter para minúsculas)
function normalizeText(text) {
    return text.toLowerCase().replace(/[^\w\s]/g, "");
}

// Adicionar item de pergunta e resposta ao armazenamento local
function addQAItemToLocalStorage(question, answer) {
    const qaItem = { question, answer };
    customQAPairs.push(qaItem);
    localStorage.setItem('customQAPairs', JSON.stringify(customQAPairs));
}

// Carregar pergunta e resposta personalizada do armazenamento local
function loadQAPairsFromLocalStorage() {
    const storedQAPairs = localStorage.getItem('customQAPairs');
    if (storedQAPairs) {
        customQAPairs = JSON.parse(storedQAPairs);
    }
}

// Carregar perguntas e respostas personalizadas ao iniciar a página
loadQAPairsFromLocalStorage();
