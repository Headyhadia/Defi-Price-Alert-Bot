import styles from "./Footer.module.css";

const Footer = () => {
  return (
    <div className={styles.footer}>
      <ul className={styles.list}>
        <li className={styles.listItem}>
          🔔 This bot monitors live crypto prices using Chainlink oracles and
          lets you set buy/sell alerts.
        </li>
        <li className={styles.listItem}>
          🦊 Connect your Metamask wallet to get signals — your funds are never
          accessed.
        </li>
        <li className={styles.listItem}>
          🛠️ Built with Solidity, Hardhat, and React on the Sepolia testnet.
        </li>
      </ul>
    </div>
  );
};

export default Footer;
