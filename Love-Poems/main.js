// Constants
const API_ENDPOINT = "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent";
const API_KEY = "AIzaSyAsmV6SVySiWKt3cIm8xZl3hrVwprlxhG0"; // Replace with your API key

const generatePoem = async (userName, partnerName, theme) => {
    if (!userName || !partnerName || !theme) {
        throw new Error("All fields are required");
    }

    const prompt = `Write a romantic poem about ${partnerName} and ${userName}, with a theme of ${theme}. 
    Center it around Valentine's Day and meaningful relationships. Use creative wordplay on their names make it short but impactful don't forget the names .`;

    try {
        const response = await fetch(`${API_ENDPOINT}?key=${API_KEY}`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                contents: [{ parts: [{ text: prompt }] }]
            }),
        });

        if (!response.ok) {
            throw new Error(`API request failed: ${response.status}`);
        }

        const data = await response.json();

        if (!data?.candidates?.[0]?.content?.parts?.[0]?.text) {
            throw new Error("Invalid API response format");
        }

        return data.candidates[0].content.parts[0].text;
    } catch (error) {
        console.error("Error generating poem:", error);
        throw error;
    }
};

const typePoem = (poem, element, speed = 50) => {
    if (!element) return;

    element.textContent = ""; 
    element.classList.add("typing");

    return new Promise((resolve) => {
        let words = poem.split(" "); // Split by words instead of characters
        let i = 0;
        const interval = setInterval(() => {
            if (i < words.length) {
                element.textContent += (i === 0 ? "" : " ") + words[i]; // Append words dynamically
                i++;
            } else {
                clearInterval(interval);
                element.classList.remove("typing");
                resolve();
            }
        }, speed);
    });
};


const setLoading = (isLoading) => {
    const submitButton = document.querySelector('#poemForm button[type="submit"]');
    const loadingIndicator = document.getElementById("loadingIndicator");

    if (submitButton) {
        submitButton.disabled = isLoading;
        submitButton.textContent = isLoading ? "Generating..." : "Generate Poem";
    }

    if (loadingIndicator) {
        loadingIndicator.style.display = isLoading ? "block" : "none";
    }
};

// Form submission handler
document.getElementById("poemForm")?.addEventListener("submit", async (e) => {
    e.preventDefault();

    const poemTextElement = document.getElementById("poemText");
    const errorElement = document.getElementById("errorMessage");

    try {
        setLoading(true);
        errorElement.textContent = "";

        const userName = document.getElementById("userName").value.trim();
        const partnerName = document.getElementById("partnerName").value.trim();
        const theme = document.getElementById("theme").value.trim();

        const poem = await generatePoem(userName, partnerName, theme);
        await typePoem(poem, poemTextElement);
    } catch (error) {
        errorElement.textContent = "Failed to generate poem. Please try again.";
        poemTextElement.textContent = "";
    } finally {
        setLoading(false);
    }
});
