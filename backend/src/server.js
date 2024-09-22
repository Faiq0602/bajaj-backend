const express = require('express');
const bodyParser = require('body-parser');
const multer = require('multer');
const cors = require('cors')



const app = express();
const upload = multer();

app.use(bodyParser.json());
app.use(cors());

// Helper function to validate file and extract MIME type & size
const processFile = (fileBase64) => {
    if (!fileBase64) return { file_valid: false };

    const mimeType = 'application/pdf'; // Example for MIME type, can use libraries to detect actual MIME type
    const fileSizeKb = 1800; // Example size in KB
    return { file_valid: true, file_mime_type: mimeType, file_size_kb: fileSizeKb };
};

// POST Route for /bfhl
app.post('/bfhl', upload.none(), (req, res) => {
    const { data, file_b64, user_id, email, roll_number } = req.body;

    const numbers = data.filter(item => !isNaN(item));
    const alphabets = data.filter(item => isNaN(item) && item.match(/[a-zA-Z]/));
    const lowercaseAlphabets = alphabets.filter(char => char === char.toLowerCase());
    const highestLowercaseAlphabet = lowercaseAlphabets.sort().pop() || null;

    const fileResponse = processFile(file_b64);

    const response = {
        is_success: true,
        user_id: user_id || 'default_user_00000000',
        email: email || 'default@college.com',
        roll_number: roll_number || 'XXXXXXX',
        numbers: numbers,
        alphabets: alphabets,
        highest_lowercase_alphabet: [highestLowercaseAlphabet],
        ...fileResponse,
    };

    res.json(response);
});

// GET Route for /bfhl
app.get('/bfhl', (req, res) => {
    res.json({ operation_code: 1 });
});

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
