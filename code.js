const Imap = require ('imap-simple');
const twilio = require('twilio');

exports.handler = async function(callback) {
    // Initialize Twilio client
const accountSid = 'XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX';
const authToken = 'XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX';
const client = require('twilio')(accountSid, authToken);

    // IMAP configuration
    const config = {
        imap: {
            user: 'ubahakweemeka@gmail.com',
            password: 'XXXXXXXXXXXXXXXXX',
            host: 'imap.gmail.com',
            port: 993,
            tls: true,
            tlsOptions: {
                rejectUnauthorized: false // Use only if needed (e.g., for self-signed certificates)
            }
        }
    };

    try {
        // Connect to the IMAP server
        const connection = await Imap.connect(config);
        await connection.openBox('INBOX');

        // Define search criteria and fetch options
        const searchCriteria = ['UNSEEN'];
        const fetchOptions = {
            bodies: ['HEADER', 'TEXT'],
            markSeen: false
        };

        // Fetch emails matching the search criteria
        const emails = await connection.search(searchCriteria, fetchOptions);
        
        // Process fetched emails
        emails.forEach(async (email) => {
            // Construct message body
            const messageBody = `
                From: ${email.parts[0].body.from}
                To: ${email.parts[0].body.to}
                Subject: ${email.parts[0].body.subject}
                Date: ${email.parts[0].body.date}
                Text: ${email.parts[1].body}
            `;

            // Send message using Twilio API
            await client.messages.create({
                body: messageBody,
                from: 'whatsapp:+14155238886', // Your Twilio WhatsApp number
                to: 'whatsapp:XXXXXXXXXXXXXX' // Your configured WhatsApp number
            });
        });
        
        // Close the connection
        connection.end();

        // Send success response
        callback(null, 'Emails fetched successfully and sent to WhatsApp.');
    } catch (error) {
        // Handle errors
        console.error('Error fetching and sending emails:', error);
        // Send error response
        callback(error);
    }
};
