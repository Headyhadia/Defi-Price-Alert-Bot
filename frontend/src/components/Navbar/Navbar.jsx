import styles from "./Navbar.module.css";
import { connectWallet } from "../../utils/contractUtils";
import React, { useState } from "react";

const Navbar = () => {
  const [walletAddress, setWalletAddress] = useState("");
  const handleConnect = async () => {
    try {
      const account = await connectWallet();
      setWalletAddress(account); // update state
      console.log("Connected account:", account);
    } catch (err) {
      console.error("Wallet connection failed:", err);
    }
  };

  return (
    <div className={styles.connect}>
      <button onClick={handleConnect} className={styles.connectBtn}>
        {walletAddress
          ? `Connected: ${walletAddress.slice(0, 6)}...${walletAddress.slice(
              -4
            )}`
          : "Connect Wallet"}
      </button>
    </div>
  );
};

export default Navbar;
