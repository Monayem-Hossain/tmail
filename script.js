// Define email accounts with their API keys
const EMAIL_ACCOUNTS = {
    "1": {
        "email": "vpnsi.test@inbox.testmail.app",
        "apikey": "fce67b17-dc4a-4551-bc27-c0fcbb982d0b",
        "name": "vpnsi",
    },
    "2": {
        "email": "y1gbh.test@inbox.testmail.app",
        "apikey": "f0f0440b-5b62-4714-8e4e-70c1158d1729",
        "name": "y1gbh"
    },
    "3": {
        "email": "wvk5b.test@inbox.testmail.app",
        "apikey": "f7c3fb4b-dbf5-4761-a4a2-3366b968029e",
        "name": "wvk5b"
    },
    "4": {
        "email": "ps6yq.test@inbox.testmail.app",
        "apikey": "a6d7f581-8e63-400d-bf7e-ce23a57ff366",
        "name": "ps6yq"
    },
    "5": {
        "email": "skx3s.test@inbox.testmail.app",
        "apikey": "77370133-baac-48b5-9d70-4e240c88bbec",
        "name": "skx3s"
    },
    "6": {
        "email": "4ttbz.test@inbox.testmail.app",
        "apikey": "eeb9dd77-5c4e-4392-935d-037f10a3b2d7",
        "name": "4ttbz"
    },
};

// Fetch emails from API
async function fetchEmails(apiKey, namespace) {
    const url = `https://api.testmail.app/api/json?apikey=${apiKey}&namespace=${namespace}&pretty=true`;

    try {
        const response = await fetch(url);
        const data = await response.json();
        return data.emails || [];
    } catch (error) {
        console.error('Error fetching emails:', error);
        return [];
    }
}

// Display email list
function displayEmailList(emails) {
    const emailList = document.getElementById('email-list');
    emailList.innerHTML = ''; // Clear the list

    emails.forEach((email, index) => {
        const listItem = document.createElement('li');
        listItem.innerHTML = `${index + 1}: ${email.from_parsed[0].address} - ${email.subject || "No subject"}`;
        listItem.addEventListener('click', () => {
            displayEmailDetails(email);
            // Hide the email list and show email details
            document.getElementById('inbox').style.display = 'none';
            document.getElementById('email-details').style.display = 'block';
        });
        emailList.appendChild(listItem);
    });
}

// Display selected email details and enable the Copy button
function displayEmailDetails(email) {
    const recipientAddress = email.to || "Unknown recipient";

    document.getElementById('sender-name').innerText = email.from_parsed[0].name || "Unknown Name";
    document.getElementById('sender-address').innerText = email.from_parsed[0].address || "Unknown Address";
    document.getElementById('recipient').innerText = recipientAddress;
    document.getElementById('subject').innerText = email.subject || "No subject";
    document.getElementById('text').innerText = email.text || "No content";
    const downloadUrl = document.getElementById('download-url');
    downloadUrl.href = email.downloadUrl || "#";
    downloadUrl.innerText = email.downloadUrl ? "Download" : "No download URL";

    // Copy button functionality (copying the recipient address)
    document.getElementById('copy-email').onclick = () => copyEmailAddressToClipboard(recipientAddress);
}

// Copy the email address to clipboard
function copyEmailAddressToClipboard(emailAddress) {
    navigator.clipboard.writeText(emailAddress).then(() => {
        // Show success message
        const copyStatus = document.getElementById('copy-status');
        copyStatus.style.display = 'block';
        setTimeout(() => {
            copyStatus.style.display = 'none';
        }, 2000);  // Hide the message after 2 seconds
    }).catch(err => {
        console.error('Failed to copy: ', err);
    });
}

// Main function
document.getElementById('fetch-emails').addEventListener('click', async () => {
    const selectedAccount = document.getElementById('email-account').value;
    const accountDetails = EMAIL_ACCOUNTS[selectedAccount];

    if (accountDetails) {
        const emails = await fetchEmails(accountDetails.apikey, accountDetails.name);
        displayEmailList(emails);
        document.getElementById('inbox').style.display = 'block'; // Show email list
        document.getElementById('email-details').style.display = 'none'; // Hide email details initially

        // Copy the recipient address of the first email immediately after fetching
        if (emails.length > 0) {
            const firstEmailRecipientAddress = emails[0].to || "Unknown recipient";
            copyEmailAddressToClipboard(firstEmailRecipientAddress);
        }
    } else {
        alert('Invalid account selection');
    }
});
