// var CronJob = require("cron").CronJob;
// const { Contract, WalletConnection, transactions } = require("near-api-js");
// const nearAPI = require("near-api-js");
// const { connect, KeyPair, keyStores } = nearAPI;

// const sender = "alach.testnet";
// const networkId = "default";

// async function borrow() {
//   const keyStore = new keyStores.InMemoryKeyStore();
//   const keyPair = KeyPair.fromString(
//     "ed25519:eYogCusUw3asWPRwAmiv6aDfsBbjs9K2x69f9SP26yUhnwMWEEzjS1uDF41rZ9BGDSpEXNYL8gHDuJbUCDtBTZq"
//   );
//   await keyStore.setKey(networkId, sender, keyPair);
//   // // configuration used to connect to NEAR
//   const connectionConfig = {
//     networkId,
//     keyStore,
//     nodeUrl: "https://rpc.testnet.near.org",
//     walletUrl: "https://wallet.testnet.near.org",
//     helperUrl: "https://helper.testnet.near.org",
//     explorerUrl: "https://explorer.testnet.near.org",
//   };

//   const near = await connect(connectionConfig);
//   const senderAccount = await near.account(sender);
//   const newArgs = {
//     receiver_id: "contract.1638481328.burrow.testnet",
//     amount: "2000000000000000000000000",
//     msg: "",
//   };

//   const result = await senderAccount.signAndSendTransaction({
//     receiverId: "burrow_l.testnet",
//     actions: [
//       transactions.transfer("2000"),
//       transactions.functionCall(
//         "make_deposit_burrow",
//         Buffer.from(JSON.stringify(newArgs)),
//         "150000000000000",
//         "0"
//       ),
//     ],
//   });

//   console.log(result);
// }

// module.exports = borrow;
