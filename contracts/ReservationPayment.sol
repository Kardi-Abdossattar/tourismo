// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract ReservationPayment {
    struct PaymentInfo {
        address userAddress;
        uint256 amount; // in wei
        bool paid;
    }

    // bookingId => payment info
    mapping(uint256 => PaymentInfo) public payments;

    event ReservationPaid(uint256 indexed bookingId, address indexed user, uint256 amount);

    // Receive payment for a reservation
    function payReservation(uint256 bookingId) external payable {
        require(msg.value > 0, "No ETH sent");
        PaymentInfo storage p = payments[bookingId];
        // Prevent double payment for same bookingId
        require(!p.paid, "Already paid");

        p.userAddress = msg.sender;
        p.amount = msg.value;
        p.paid = true;

        emit ReservationPaid(bookingId, msg.sender, msg.value);
    }

    function getPayment(uint256 bookingId)
        external
        view
        returns (address user, uint256 amount, bool paid)
    {
        PaymentInfo memory p = payments[bookingId];
        return (p.userAddress, p.amount, p.paid);
    }
}
