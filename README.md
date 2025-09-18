# Tourismo – Ethereum Reservation Payments Integration

This project now supports on-chain ETH payments for reservations using a simple Solidity contract, Truffle, Ganache, ethers.js (backend + frontend), and MetaMask.

## What was added
- `contracts/ReservationPayment.sol`: Smart contract to accept ETH per bookingId and emit events.
- `migrations/1_deploy_reservation_payment.js`: Truffle migration.
- `truffle-config.js`: Truffle config (Solc 0.8.20, Ganache network).
- Backend blockchain integration:
  - `backend/config/blockchain.js`
  - `backend/controllers/paymentController.js`
  - `backend/routes/paymentRoutes.js`
  - Mounted in `backend/server.js` under `/api/payment`
  - Added seeding path fix for Truffle build artifact
- Frontend integration:
  - Updated booking flow `app/booking/[id]/page.tsx` to call the contract via MetaMask and store tx details
  - Web3 helpers: `lib/web3.ts` now includes `sendContractPayment`, `isMetaMaskAvailable`
  - API helpers: `lib/api.ts` now includes `createPayment` and `getPaymentStatus`
- Admin: `app/admin/bookings/page.tsx` shows payment status (paid/unpaid) by querying the blockchain via backend.

## Prerequisites
- Node.js LTS
- MetaMask browser extension
- Ganache (GUI or CLI)
- Truffle (global):
  ```bash
  npm install -g truffle
  ```

## Quick start (local blockchain)
1. Start Ganache on http://127.0.0.1:7545 (default):
   - GUI: Create a workspace with network id `*`.
   - CLI (alternative):
     ```bash
     npx ganache -p 7545
     ```

2. Compile and deploy the smart contract:
   ```bash
   # From project root
   npm run truffle:compile
   npm run truffle:migrate
   # If re-deploying: npm run truffle:reset
   ```
   After migrate, note the deployed `ReservationPayment` address printed by Truffle.

3. Configure backend environment (`backend/.env`):
   Create `backend/.env` with:
   ```env
   MONGODB_URI=mongodb://localhost:27017/tourismo
   JWT_SECRET=dev_secret_change_me
   PORT=5000
   ETH_RPC_URL=http://127.0.0.1:7545
   CONTRACT_ADDRESS=0xYourDeployedContractAddressHere
   ```

4. Install and run:
   ```bash
   # From project root
   npm install
   npm run backend:install
   npm run dev
   ```
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:5000

5. Connect MetaMask to Ganache:
   - Add network: RPC URL `http://127.0.0.1:7545`, Chain ID `1337` or Ganache’s actual chain ID, Currency `ETH`.
   - Import a Ganache account’s private key to MetaMask (for test ETH).

## Usage
- Visit a destination and proceed to booking at `http://localhost:3000/booking/<targetId>`.
- Click “Connect MetaMask Wallet”.
- Click “Pay <price> ETH”. This will:
  - Call backend `/api/payment/create` to get tx payload.
  - Send `payReservation(bookingId)` tx via MetaMask with the specified ETH amount.
  - Await confirmation and then create a booking in the database containing `bookingId`, `txHash`, `paid: true`.
- Admin can view payment status at `http://localhost:3000/admin/bookings`.
  - Each booking with a `bookingId` queries `/api/payment/status/:bookingId` to show on-chain `paid` and `amount`.

## API Summary
- Backend:
  - `POST /api/payment/create` body `{ bookingId: number, amountEth: string }` → `{ to, data, valueWei }`
  - `GET /api/payment/status/:bookingId` → `{ user, amountWei, amountEth, paid }`
- Smart contract:
  - `payReservation(uint256 bookingId)` payable: records payer, amount; emits `ReservationPaid`.
  - `getPayment(uint256 bookingId)` view: returns `{ user, amount, paid }`.

## Notes and recommendations
- BookingId generation: currently client-generated (`Date.now()/1000`) for demo purposes. In production, prefer server-assigned, collision-resistant ids.
- Confirmations: The flow waits for 1 confirmation (`tx.wait()`). Adjust if needed.
- Security: Never use real funds on Ganache. Do not commit secrets.
- If `build/contracts/ReservationPayment.json` is missing, run `npm run truffle:compile` and `npm run truffle:migrate`.

## Troubleshooting
- MetaMask not detected: ensure the extension is installed; the UI will show a warning.
- Contract address error: set `CONTRACT_ADDRESS` in `backend/.env` to the address from Truffle migration.
- Network mismatch: ensure MetaMask is connected to the same network as Ganache (RPC `127.0.0.1:7545`).
- CORS/Fetch issues: backend runs on port 5000 with CORS enabled; check console logs.
