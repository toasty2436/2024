const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');
const cors = require('cors');

const app = express();
const PORT = 3000;

// Enable CORS to allow requests from a different port (e.g., 5500)
app.use(cors());

// Middleware to parse URL-encoded form data
app.use(bodyParser.urlencoded({ extended: true }));

// Endpoint to handle form submissions
app.post('/submit', async (req, res) => {
    const { name, email, age, occupation, rating, remark } = req.body;

    // Handle checkboxes (liked items may be an array)
    const liked = req.body.liked;
    const likedItems = Array.isArray(liked) ? liked.join(', ') : liked || 'None';

    // Format the message for Discord
    const discordMessage = `
**Survey Response:**
- **Name:** ${name}
- **Email:** ${email}
- **Age:** ${age || 'N/A'}
- **Occupation:** ${occupation}
- **Rating:** ${rating || 'N/A'}
- **Liked:** ${likedItems}
- **Remarks:** ${remark || 'None'}
    `;

    try {
        // Replace YOUR_DISCORD_WEBHOOK_URL with your actual Discord webhook URL
        const webhookUrl = 'https://discord.com/api/webhooks/1313332028871016479/p-fmxgOQLwY30WwzKiKjp862dIaj-xp_b4DuCzGAJifagH1X_8AdRvSNtDhW_d8lJvSz';

        // Send the message to Discord
        await axios.post(webhookUrl, { content: discordMessage });

        // Send a response back to the client
        res.send('Response sent to Discord!');
    } catch (error) {
        console.error('Error sending to Discord:', error);
        res.status(500).send('Failed to send response.');
    }
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
