// Create context menu on extension installation
chrome.runtime.onInstalled.addListener(() => {
    chrome.contextMenus.create({
        id: "summarize",
        title: "Summarize selected text",
        contexts: ["selection"]
    });
    chrome.contextMenus.create({
        id: "translate",
        title: "Translate selected text",
        contexts: ["selection"]
    });
    chrome.contextMenus.create({
        id: "paraphrase",
        title: "Paraphrase selected text",
        contexts: ["selection"]
    });
    chrome.contextMenus.create({
        id: "expand",
        title: "Expand selected text",
        contexts: ["selection"]
    });
    chrome.contextMenus.create({
        id: "generateKeywords",
        title: "Generate keywords",
        contexts: ["selection"]
    });
    chrome.contextMenus.create({
        id: "textToBulletPoints",
        title: "Convert to bullet points",
        contexts: ["selection"]
    });
    chrome.contextMenus.create({
        id: "generateTitle",
        title: "Generate title or headline",
        contexts: ["selection"]
    });
    chrome.contextMenus.create({
        id: "codeExplanation",
        title: "Explain selected code",
        contexts: ["selection"]
    });
    chrome.contextMenus.create({
        id: "rewriteForSEO",
        title: "Rewrite for SEO",
        contexts: ["selection"]
    });
    chrome.contextMenus.create({
        id: "explainELI5",
        title: "Explain like I'm 5 (ELI5)",
        contexts: ["selection"]
    });
});

// Handle context menu clicks
chrome.contextMenus.onClicked.addListener((info, tab) => {
    const selectedText = info.selectionText;

    if (!selectedText) {
        alert("No text selected!");
        return;
    }

    const shortenedText = selectedText.slice(0, 1000); // Limit text to 1000 characters
    const apiKey = "YOR_OPENAI_KEY"; // Replace with your API Key
    const endpoint = "https://api.openai.com/v1/chat/completions";
    let prompt;

    // Determine the prompt to send to the API based on the selected menu
    switch (info.menuItemId) {
        case "summarize":
            prompt = `Please summarize the following text: ${shortenedText}`;
            break;
        case "translate":
            prompt = `Please translate the following text to English: ${shortenedText}`;
            break;
        case "paraphrase":
            prompt = `Please paraphrase the following text: ${shortenedText}`;
            break;
        case "expand":
            prompt = `Please expand the following text with more details: ${shortenedText}`;
            break;
        case "generateKeywords":
            prompt = `Please generate keywords for the following text: ${shortenedText}`;
            break;
        case "textToBulletPoints":
            prompt = `Please convert the following text to bullet points: ${shortenedText}`;
            break;
        case "generateTitle":
            prompt = `Please generate a title or headline for the following text: ${shortenedText}`;
            break;
        case "codeExplanation":
            prompt = `Please explain the following code in simple terms: ${shortenedText}`;
            break;
        case "rewriteForSEO":
            prompt = `Please rewrite the following text for SEO optimization: ${shortenedText}`;
            break;
        case "explainELI5":
            prompt = `Please explain the following text like I'm 5 years old: ${shortenedText}`;
            break;
        default:
            prompt = `Please summarize the following text: ${shortenedText}`;
            break;
    }

    const data = {
        model: "gpt-3.5-turbo",
        messages: [{ role: "user", content: prompt }],
        max_tokens: 150
    };

    // Call the OpenAI API
    fetch(endpoint, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${apiKey}`
        },
        body: JSON.stringify(data)
    })
    .then(response => response.json())
    .then(json => {
        const result = json.choices[0].message.content;
        console.log("Result received:", result);

        chrome.storage.local.set({ result: result }, () => {
            console.log('Result saved in storage.');
        });

        chrome.windows.create({
            url: "sidebar.html",
            type: "popup",
            width: 300,
            height: 600,
            top: 100,
            left: 100
        }, (window) => {
            if (chrome.runtime.lastError) {
                console.error("Error creating window:", chrome.runtime.lastError);
            } else {
                console.log("Sidebar window opened:", window);
            }
        });
    })
    .catch(error => {
        console.error("Error during API call:", error);
        alert(`An error occurred during the operation: ${error.message}`);
    });
});

