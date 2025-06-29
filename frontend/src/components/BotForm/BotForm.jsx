import React, { useState } from "react";
import styles from "./BotForm.module.css";
import { getContractInstance } from "../../utils/contractUtils";

const Bot = () => {
  const [asset, setAsset] = useState("BTC/USD");
  const [assetView, setAssetView] = useState("BTC/USD");
  const [threshold, setThreshold] = useState("");
  const [status, setStatus] = useState("");
  const [currentPrice, setCurrentPrice] = useState(0);

  const handleSignal = async (type) => {
    if (!threshold) return alert("Set a threshold!");

    const message = `${type === "sell" ? "Sell" : "Buy"} signal for ${asset}`;
    const isSell = type === "sell";

    try {
      const contract = await getContractInstance(true);
      const tx = await contract.checkPrice(
        asset,
        BigInt(threshold * 1e8),
        message,
        isSell
      );
      await tx.wait();
      setStatus(`✅ ${type.toUpperCase()} signal sent!`);
      alert(
        `✅ ${type.toUpperCase()} signal sent for ${asset} at threshold ${threshold}`
      );
    } catch (err) {
      console.error(err);
      setStatus("❌ Transaction failed");
    }
  };
  const handleViewPrice = async () => {
    if (!assetView) return alert("Select an asset first!");

    try {
      const contract = await getContractInstance(false); //signer is false. For view function signer is not required
      const price = await contract.viewPrices(assetView);
      setCurrentPrice(Number(price) / 1e8); // Convert from 1e8
    } catch (err) {
      console.error(err);
      setStatus("❌ Couldn't fetch price.");
    }
  };

  return (
    <div className={styles.main}>
      <h1>YOUR ON-CHAIN PRICE ALERT BOT</h1>
      <div className={styles.price}>
        {currentPrice !== null && `Current ${assetView}: $${currentPrice}`}
      </div>
      <form className={styles.form} onSubmit={(e) => e.preventDefault()}>
        <ul className={styles.lists}>
          <li className={styles.list}>
            <select
              className={styles.contentlist}
              name="viewPrices"
              value={assetView}
              onChange={(e) => setAssetView(e.target.value)}
            >
              <option value="BTC/USD">BTC/USD</option>
              <option value="ETH/USD">ETH/USD</option>
              <option value="LINK/USD">LINK/USD</option>
            </select>

            <button type="button" onClick={handleViewPrice}>
              View Current Price
            </button>
          </li>
          <li className={styles.list}>
            <label>Asset</label>

            <select
              className={styles.contentlist}
              name="CheckPrice"
              value={asset}
              onChange={(e) => setAsset(e.target.value)}
            >
              <option value="BTC/USD">BTC/USD</option>
              <option value="ETH/USD">ETH/USD</option>
              <option value="LINK/USD">LINK/USD</option>
            </select>
          </li>
          <li className={styles.list}>
            <label>Threshold (USD): </label>
            <input
              type="number"
              placeholder="Enter threshold"
              value={threshold}
              onChange={(e) => setThreshold(e.target.value)}
            />
          </li>
          <li className={styles.list}>
            <div className={styles.signalButtons}>
              <button type="button" onClick={() => handleSignal("sell")}>
                Sell Signal
              </button>
              <button type="button" onClick={() => handleSignal("buy")}>
                Buy Signal
              </button>
            </div>
          </li>
        </ul>
      </form>
      {status && <p>{status}</p>}
    </div>
  );
};
export default Bot;
