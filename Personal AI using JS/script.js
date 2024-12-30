// URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=AIzaSyB1LB0alFtp9j5OH9kHO0fMcICrnH9G0ZU"

document.addEventListener("DOMContentLoaded", () => {
  const chatForm = document.getElementById("chat-form");
  const userInput = document.getElementById("user-input");
  const chatMessages = document.getElementById("chatMessages");
  const sendButton = document.getElementById("inputBtn");

  userInput.addEventListener("input", () => {
    userInput.style.height = "auto";
    userInput.style.height = userInput.scrollHeight + "px";
  });
  chatForm.addEventListener("submit", async (e) => {
    e.preventDefault(); // prevents default loading
    const message = userInput.value.trim(); // trim is used for trim the white spaces in the input
    if (!message) return;

    addMessage(message, true); // adds user's message to the chat

    // clear the input after typing
    userInput.value = "";
    userInput.style.height = "auto";
    sendButton.disabled = true;

    const typingIndicator = showTypingIndicator(); // indicates message's

    // request to the API
    try {
      const response = await generateResponse(message);
      typingIndicator.remove();

      //AI response
      addMessage(response, false);
    } catch (error) {
      typingIndicator.remove();
      addErrorMessage(error.message);
    } finally {
      sendButton.disabled = false;
    }
  });

  // function for adding the user message in chat
  function addMessage(text, isUser) {
    const message = document.createElement("div");
    message.className = `message ${isUser ? "user-message" : ""}`;
    message.innerHTML = `
        <div class="avatar ${isUser ? "user-avatar" : ""}">
    ${isUser ? "U" : "AI"}
        </div>
        <div class="messageContent">${text}</div>
    `;
    chatMessages.appendChild(message);
    chatMessages.scrollTop = chatMessages.scrollHeight;
  }

  // function to show the indicator
  function showTypingIndicator() {
    const indicator = document.createElement("div");
    indicator.className = "message";
    indicator.innerHTML = `
            <div class="avatar">AI</div>
            <div class="typingIndicator">
            <div class="dot"></div>
            <div class="dot"></div>
            <div class="dot"></div>
            </div>
        `;

    chatMessages.appendChild(indicator);
    chatMessages.scrollTop = chatMessages.scrollHeight;
    return indicator;
  }

  //Error message function
  function addErrorMessage(text) {
    const message = document.createElement("div");
    message.className = "message";
    message.innerHTML = `
        <div class="avatar">AI</div>
            <div class="message-content" style="color:red">
                Error: ${text}
            </div>
        `;
  }
});

//function to generate response from the API
async function generateResponse(prompt) {
  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=AIzaSyB1LB0alFtp9j5OH9kHO0fMcICrnH9G0ZU`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              {
                text: prompt,
              },
            ],
          },
        ],
      }),
    }
  );

  if (!response.ok) {
    throw new Error("Failed to generate the response");
  }
  const data = await response.json(); // actual response from the AI
  return data.candidates[0].content.parts[0].text;
}

function scrollToBottom() {
  const messagesWrapper = document.querySelector(".messages-wrapper");
  messagesWrapper.scrollTop = messagesWrapper.scrollHeight;
}

scrollToBottom();
