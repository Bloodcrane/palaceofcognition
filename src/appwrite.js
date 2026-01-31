import { Client, Account, Databases, Storage } from "appwrite";

const client = new Client()
    .setEndpoint("https://fra.cloud.appwrite.io/v1")
    .setProject("697e6a6d0023b43d5b17");

// Add ping method to simulate connection check
client.ping = async () => {
    try {
        const response = await fetch('https://fra.cloud.appwrite.io/v1/health/version');
        if (response.ok) {
            const data = await response.json();
            console.log('Appwrite Ping Successful:', data);
            return true;
        }
        console.error('Appwrite Ping Failed:', response.statusText);
        return false;
    } catch (error) {
        console.error('Appwrite Ping Error:', error);
        return false;
    }
};

const account = new Account(client);
const databases = new Databases(client);
const storage = new Storage(client);

export { client, account, databases, storage };
