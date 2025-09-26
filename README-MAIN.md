# Tourismo - Travel Booking Platform with Ethereum Payments

> **Note:** This is the **main branch** with full Ethereum payment integration. For a frontend-only demo, check out the `static-demo` branch.

A complete travel booking platform with Ethereum blockchain integration, built with Next.js, TypeScript, Tailwind CSS, and Solidity smart contracts. This version includes full payment processing with MetaMask and smart contract integration.

## 🌟 Features

- **Ethereum Payments** - Secure booking payments with ETH
- **Smart Contract Integration** - Built with Solidity and deployed on Ethereum
- **MetaMask Wallet** - Seamless wallet connection
- **Admin Dashboard** - Manage bookings and view payment status
- **Fully Responsive** - Works on all devices

## 🚀 Getting Started

### Prerequisites
- Node.js 16+
- MetaMask browser extension
- Ganache (for local development)
- Truffle (for smart contract deployment)

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/Kardi-Abdossattar/tourismo.git
   cd tourismo
   ```

2. Install dependencies:
   ```bash
   npm install
   # or
   yarn
   ```

3. Set up the blockchain environment:
   ```bash
   # Install Truffle globally
   npm install -g truffle
   
   # Start Ganache (in a new terminal)
   npx ganache -p 7545
   
   # Deploy smart contracts
   npm run truffle:compile
   npm run truffle:migrate
   ```

4. Start the development server:
   ```bash
   npm run dev
   # or
   yarn dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser

## 🔗 Smart Contract

The `ReservationPayment` smart contract handles all payment processing:
- Accepts ETH payments for bookings
- Emits events for payment tracking
- Maintains a record of all transactions

### Contract Address
```
0x... (Update with your deployed contract address)
```

## 🛠️ Tech Stack

- **Frontend:** Next.js 13+ (App Router)
- **Smart Contracts:** Solidity
- **Blockchain:** Ethereum (Ganache for local development)
- **Wallet Integration:** MetaMask, Web3.js
- **Styling:** Tailwind CSS
- **State Management:** React Context API

## 📂 Project Structure

```
/
├── contracts/            # Solidity smart contracts
│   └── ReservationPayment.sol
├── migrations/           # Truffle migration scripts
├── app/                  # Next.js pages and layouts
├── components/           # Reusable UI components
├── lib/                  # Utility functions and configs
│   └── web3.ts           # Web3 and contract interaction
└── public/               # Static assets
```

## 🌐 Live Demo

Check out the live demo at: [GitHub Pages](https://kardi-abdossattar.github.io/tourismo/)

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
