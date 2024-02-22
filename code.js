const Imap = require ('imap-simple');

async function fetchEmails() {
    const config = {
        imap: {
            user: 'ubahakweemeka@gmail.com',
            password: 'XXXXXXXXXX',
            host: 'imap.gmail.com',
            port: 993,
            tls: true,
            tlsOptions: {
                rejectUnauthorized: false
            }
        }
    };

    try {
        const connection = await Imap.connect(config);
        await connection.openBox('INBOX');

        const searchCriteria = ['UNSEEN'];
        const fetchOptions = {
            bodies: ['HEADER', 'TEXT'],
            markSeen: false
        };

        const emails = await connection.search(searchCriteria, fetchOptions);

        emails.forEach((email) => {
            console.log('Subject:', email.parts[0].body.subject);
            console.log('From:', email.parts[0].body.from);
            console.log('Date:', email.parts[0].body.date);
            console.log('Text:', email.parts[1].body);
        });

        await connection.end();
    }
    catch (error) {
       console.error('Error fetching emails:', error); 
    }
}

fetchEmails();
