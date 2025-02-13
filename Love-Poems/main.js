const generatePoem = async (userName, partnerName, theme) => {
    const apiKey = '13fb7ec2b331f0d261710bba64164a1ada0f30fbf512927b63071987'; // Replace with your Together AI API key
  
    const prompt = `Write a romantic poem about ${userName} and ${partnerName}, with a theme of ${theme} center it of off valentines and also a meaningful relation between them also use some world play on their names.`;
  
    try {
      // Send POST request to Together AI API
      const response = await fetch('https://api.together.xyz/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: "deepseek-ai/DeepSeek-R1", // Using the appropriate model
          messages: [{ role: "system", content: "You are a helpful assistant." }, { role: "user", content: prompt }],
          max_tokens: 150, // Limit the length of the poem
          temperature: 0.7, // Controls creativity
          top_p: 0.95,
          top_k: 50,
          repetition_penalty: 1,
          stop: ["<｜end▁of▁sentence｜>"],
          stream: true, // Stream response for real-time typing effect
        }),
      });
  
      const data = await response.json();
  
      if (response.ok) {
        const poem = data.choices[0].text.trim();
        return poem;
      } else {
        throw new Error('Error generating poem');
      }
    } catch (error) {
      console.error('Error:', error);
      return 'Sorry, something went wrong while generating the poem.';
    }
  };
  
  // Function to animate the poem text
  const typePoem = (poem) => {
    const poemTextElement = document.getElementById('poemText');
    poemTextElement.textContent = '';  // Clear previous poem
    poemTextElement.classList.remove('typing'); // Reset animation
  
    poemTextElement.classList.add('typing'); // Start typing animation
  
    let i = 0;
    const interval = setInterval(() => {
      poemTextElement.textContent += poem.charAt(i);
      i++;
      if (i > poem.length - 1) clearInterval(interval); // Stop typing when the poem is fully written
    }, 50); // Speed of typing effect
  };
  
  // Handling the form submission
  document.getElementById('poemForm').addEventListener('submit', async (e) => {
    e.preventDefault();  // Prevent page reload
  
    // Get form input values
    const userName = document.getElementById('userName').value;
    const partnerName = document.getElementById('partnerName').value;
    const theme = document.getElementById('theme').value;
  
    // Call the function to generate the poem
    const poem = await generatePoem(userName, partnerName, theme);
  
    // Call function to animate the typing effect
    typePoem(poem);
  });
  