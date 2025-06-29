//Matamask connection

import { ethers } from "ethers";

import PriceAlertABI from "../abi/PriceAlert.json";

const CONTRACT_ADDRESS = "0x6CE73136fE2B70198DfdAA9a9EbA60d12ea1E8a8";

//Connect to metamask
export async function connectWallet() {
  if (!window.ethereum) {
    alert("Please install metamask to use this app. ");
    return;
  }
  const accounts = await window.ethereum.request({
    method: "eth_requestAccounts",
  });
  return accounts[0];
}

//get provider or signer based on whether a write or read function is being called
export function getSignerOrProvider(needSigner = false) {
  const provider = new ethers.BrowserProvider(window.ethereum);
  return needSigner ? provider.getSigner() : provider;
}

//get contract instance
export async function getContractInstance(needSigner = false) {
  const providerOrSigner = await getSignerOrProvider(needSigner);
  return new ethers.Contract(
    CONTRACT_ADDRESS,
    PriceAlertABI.abi,
    providerOrSigner
  );
}
