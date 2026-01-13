import { FaTerminal, FaDatabase, FaLock, FaNetworkWired } from 'react-icons/fa';

export const modules = [
  {
    id: "linux-101",
    title: "Linux Basics",
    icon: <FaTerminal />,
    difficulty: "Beginner",
    image: "nginx:alpine", // Docker image to use
    description: "Learn how to navigate the file system and manipulate files.",
    objectives: [
      "Check current user with 'whoami'",
      "List files using 'ls -la'",
      "Create a file named 'pwned.txt'"
    ],
    guide: `
      <h3 class="text-neon-green font-bold">Mission Briefing</h3>
      <p class="mb-4">Welcome, Agent. Before you can hack servers, you must master the terminal.</p>
      
      <h4 class="text-white font-bold mt-4">Command 1: whoami</h4>
      <p class="text-gray-400 text-sm mb-2">Tells you which user you are currently logged in as.</p>
      
      <h4 class="text-white font-bold mt-4">Command 2: ls -la</h4>
      <p class="text-gray-400 text-sm mb-2">Lists all files in the current directory, including hidden ones.</p>
    `
  },
  {
    id: "recon-nmap",
    title: "Network Recon",
    icon: <FaNetworkWired />,
    difficulty: "Intermediate",
    image: "nginx:alpine", 
    description: "Identify open ports and services on a target machine.",
    objectives: [
      "Ping the target to check connectivity",
      "Identify the web server version using curl",
      "Find the hidden 'robots.txt' file"
    ],
    guide: `
      <h3 class="text-neon-green font-bold">Mission Briefing</h3>
      <p class="mb-4">Target acquired. We need to identify what software is running on the host.</p>
      
      <h4 class="text-white font-bold mt-4">Step 1: Curl Headers</h4>
      <code class="block bg-gray-800 p-2 rounded mt-2 text-green-300">curl -I localhost</code>
      <p class="text-gray-400 text-sm mt-2">The '-I' flag fetches headers only. Look for 'Server'.</p>
    `
  },
  {
    id: "db-exploit",
    title: "NoSQL Injection",
    icon: <FaDatabase />,
    difficulty: "Advanced",
    image: "redis:alpine", 
    description: "Interact with an unsecured Redis database to extract flags.",
    objectives: [
      "Connect using redis-cli",
      "List all keys in the database",
      "Extract the value of 'secret_flag'"
    ],
    guide: `
      <h3 class="text-neon-green font-bold">Mission Briefing</h3>
      <p class="mb-4">We found an exposed database. Your goal is to extract the secret flag.</p>
      
      <h4 class="text-white font-bold mt-4">Step 1: Connect</h4>
      <p class="text-gray-400 text-sm mb-2">Since the DB is local, run:</p>
      <code class="block bg-gray-800 p-2 rounded text-green-300">redis-cli</code>
    `
  }
];