const { expect } = require("chai");
const { ethers } = require("hardhat");
const { anyValue } = require("@nomicfoundation/hardhat-chai-matchers/withArgs");
const env = require("hardhat");

describe("priceAlert - Sepolia Tests", function () {
  let priceAlert;

  const deployedAddress = "0x6CE73136fE2B70198DfdAA9a9EbA60d12ea1E8a8";
  before(async function () {
    priceAlert = await ethers.getContractAt("PriceAlert", deployedAddress);
  });
  //check 1
  it("Check BTC/USD is giving the correct feed address", async function () {
    const expected = "0x1b44F3514812d835EB1BDB0acB33d3fA3351Ee43";
    const actual = await priceAlert.priceFeeds("BTC/USD");
    expect(actual).to.equal(expected);
  });
  //check 2
  it("Check ETH/USD is giving the correct feed contract address", async function () {
    const expected = "0x694AA1769357215DE4FAC081bf1f309aDC325306";
    const actual = await priceAlert.priceFeeds("ETH/USD");
    expect(actual).to.equal(expected);
  });
  //check 3
  it("Check LINK/USD is giving the correct feed address", async function () {
    const expected = "0xc59E3633BAAC79493d908e63626716e204A45EdF";
    const actual = await priceAlert.priceFeeds("LINK/USD");
    expect(actual).to.equal(expected);
  });
  //check 4
  it("Check if any other asset is giving the 0 address", async function () {
    const expected = "0x0000000000000000000000000000000000000000";
    const actual = await priceAlert.priceFeeds("Dodge/USD");
    expect(actual).to.equal(expected);
  });
  //check 5
  it("Should emit AlertTriggered for above check (sell signal)", async function () {
    const threshold =
      (await priceAlert.viewPrices("BTC/USD")) + BigInt(99000 * 1e8);
    const message = "Sell Signal";
    const [owner] = await ethers.getSigners();
    //call the transaction
    const tx = await priceAlert.checkPrice(
      "BTC/USD",
      threshold,
      message,
      false
    );
    const receipt = await tx.wait();
    //filter logs
    const events = await priceAlert.queryFilter(
      priceAlert.filters.AlertTriggered(null, null, null, null),
      receipt.blockNumber,
      receipt.blockNumber
    ); //find alert from the same box where tx occured
    //exert the event exists or not
    expect(events.length).to.be.greaterThan(0);
    const evt = events[0];
    expect(evt.args.user).to.equal(await owner.getAddress());
    expect(evt.args.asset).to.equal("BTC/USD");
    expect(evt.args.price).to.be.gt(0);
    expect(evt.args.userMessage).to.equal(message);
  });
  //check 6
  it("Should emit ALertTriggered for below check (buy signal)", async function () {
    const [owner] = await ethers.getSigners();
    const threshold =
      (await priceAlert.viewPrices("BTC/USD")) - BigInt(99000 * 1e8); // threshold is less than the actual value. thus it would give buy signal.
    const message = "Buy signal";
    //call the transaction
    const tx = await priceAlert.checkPrice("BTC/USD", threshold, message, true);
    const receipt = await tx.wait();
    //filter the log
    const events = await priceAlert.queryFilter(
      priceAlert.filters.AlertTriggered(null, null, null, null),
      receipt.blockNumber,
      receipt.blockNumber
    );
    //exert that event exists or not
    expect(events.length).to.be.greaterThan(0);
    const evt = events[0];
    expect(evt.args.user).to.equal(await owner.getAddress());
    expect(evt.args.asset).to.equal("BTC/USD");
    expect(evt.args.price).to.be.gt(0);
    expect(evt.args.userMessage).to.equal(message);
  });
  //check 7
  it("Should not emit the AlertTriggered if the threshold equals to the price.", async function () {
    const [owner] = await ethers.getSigners();
    const threshold = await priceAlert.viewPrices("BTC/USD");
    const message = "Should not trigger. Its equal";

    const tx = await priceAlert.checkPrice(
      "BTC/USD",
      threshold,
      message,
      false
    );
    const receipt = await tx.wait();

    const events = await priceAlert.queryFilter(
      priceAlert.filters.AlertTriggered(null, null, null, null),
      receipt.blockNumber,
      receipt.blockNumber
    );

    expect(events.length).to.equal(0);
  });
  //check 8
  it("Should return a positive price for a valid address", async function () {
    const price = await priceAlert.viewPrices("ETH/USD");
    expect(price).to.be.a("bigint");
    expect(price).to.be.gt(0);
  });
  //check 9
  it("Should revert the transaction if undefined asset given", async function () {
    await expect(priceAlert.viewPrices("DODGE/USD")).to.be.revertedWith(
      "Invalid asset"
    );
  });
});
