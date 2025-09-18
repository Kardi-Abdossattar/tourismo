const ReservationPayment = artifacts.require("ReservationPayment");

module.exports = function (deployer) {
  deployer.deploy(ReservationPayment);
};
