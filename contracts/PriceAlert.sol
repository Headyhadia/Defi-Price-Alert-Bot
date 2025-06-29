//SPDX-License-Identifier: MIT

pragma solidity ^0.8.20;
import "./lib/chainlink/AggregatorV3Interface.sol";

contract PriceAlert {
    mapping(string => AggregatorV3Interface) public priceFeeds;

    constructor() {
        priceFeeds["BTC/USD"] = AggregatorV3Interface(
            0x1b44F3514812d835EB1BDB0acB33d3fA3351Ee43
        );
        priceFeeds["ETH/USD"] = AggregatorV3Interface(
            0x694AA1769357215DE4FAC081bf1f309aDC325306
        );
        priceFeeds["LINK/USD"] = AggregatorV3Interface(
            0xc59E3633BAAC79493d908e63626716e204A45EdF
        );
    }

    //this function checks price of the selected coin and compare with threshold giving alert
    function checkPrice(
        string memory asset,
        uint256 threshold,
        string memory userMessage,
        bool triggerAbove
    ) external {
        AggregatorV3Interface priceFeed = priceFeeds[asset];
        require(address(priceFeed) != address(0), "Invalid asset");

        (, int256 price, , , ) = priceFeed.latestRoundData();
        if (!triggerAbove && price < int256(threshold)) {
            emit AlertTriggered(
                msg.sender,
                asset,
                price,
                userMessage,
                triggerAbove
            );
        } else if (triggerAbove && price > int256(threshold)) {
            emit AlertTriggered(
                msg.sender,
                asset,
                price,
                userMessage,
                triggerAbove
            );
        }
    }

    //function to check the current prices
    function viewPrices(string memory asset) public view returns (int256) {
        AggregatorV3Interface priceFeed = priceFeeds[asset];
        require(address(priceFeed) != address(0), "Invalid asset");

        (, int256 price, , , ) = priceFeed.latestRoundData();
        return price;
    }

    event AlertTriggered(
        address indexed user,
        string asset,
        int256 price,
        string userMessage,
        bool triggerAbove
    );
}
