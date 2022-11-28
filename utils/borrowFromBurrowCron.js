var CronJob = require("cron").CronJob;
const { Contract } = require("near-api-js");
const nearAPI = require("near-api-js");
const { connect, KeyPair, keyStores } = nearAPI;

const sender = "alach.testnet";
const networkId = "default";

async function burrow(id, amount) {
  const keyStore = new keyStores.InMemoryKeyStore();
  const keyPair = KeyPair.fromString(
    "ed25519:eYogCusUw3asWPRwAmiv6aDfsBbjs9K2x69f9SP26yUhnwMWEEzjS1uDF41rZ9BGDSpEXNYL8gHDuJbUCDtBTZq"
  );
  await keyStore.setKey(networkId, sender, keyPair);
  // // configuration used to connect to NEAR
  const connectionConfig = {
    networkId,
    keyStore,
    nodeUrl: "https://rpc.testnet.near.org",
    walletUrl: "https://wallet.testnet.near.org",
    helperUrl: "https://helper.testnet.near.org",
    explorerUrl: "https://explorer.testnet.near.org",
  };

  const near = await connect(connectionConfig);
  // create a NEAR account object
  const senderAccount = await near.account(sender);
  let contract = new Contract(senderAccount, "burrow_lightency.testnet", {
    viewMethods: [],
    changeMethods: ["burrow"],
  });

  let contract2 = new Contract(senderAccount, "treasurydao.testnet", {
    viewMethods: ["get_proposals", "get_specific_proposal"],
    changeMethods: ["fund"],
  });

  contract2
    .get_specific_proposal({ id: id })
    .then((proposal) => {
      if (
       
        new Date() >
          addMinutes(
            proposal?.duration_days * 24 * 60 +
              proposal.duration_hours * 60 +
              proposal.duration_min,
            new Date(proposal.time_of_creation / 1000000)
          ) &&
        proposal?.votes_for - proposal?.votes_against > 0
      ) {
        contract
          .burrow(
            {
              amount: String(amount * 1000000000000000000000000),
              account_id: "contract.1638481328.burrow.testnet",
              msg1: "",
              vec: [{ IncreaseCollateral: { token_id: "wrap.testnet" } }],
              msg2: '{"Execute":{"actions":[{"Borrow":{"token_id":"usdt.fakes.testnet","amount":"10000000000000000000"}},{"Withdraw":{"token_id":"usdt.fakes.testnet","max_amount":"10000000000000000000"}}]}}',
            },
            "250000000000000"
          )
          .then((res) => {
            console.log("Mala jaw", res);
          })
          .catch((err) => {
            console.log("This is an error", err);
          });
        console.log("would do the job");
      } else {
        console.log("would not");
      }
    })
    .catch((err) => {
      console.log("This is an error", err);
    });
}

const addMinutes = (numOfMinutes, date = new Date()) => {
  date.setMinutes(date.getMinutes() + numOfMinutes);

  return date;
};

module.exports = burrow;
