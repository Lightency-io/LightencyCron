var CronJob = require("cron").CronJob;
const { Contract } = require("near-api-js");
const nearAPI = require("near-api-js");
const { connect, KeyPair, keyStores } = nearAPI;

const sender = "lightency_watchdog.near";
const networkId = "mainnet";

async function burrow(id, amount) {
  const keyStore = new keyStores.InMemoryKeyStore();
  const keyPair = KeyPair.fromString(
    "ed25519:2nDWWLh1BnPsY4iPD2khC82kwoN3qALPcdnxrGRtYo7HkGvfDAqHjXxLmhCxak3w1fbofhTndzRyuFdvtiQqSD9"
  );
  await keyStore.setKey(networkId, sender, keyPair);
  // // configuration used to connect to NEAR
  const connectionConfig = {
    networkId,
    keyStore,
    nodeUrl: "https://rpc.mainnet.near.org",
    walletUrl: "https://wallet.near.org",
    helperUrl: "https://helper.mainnet.near.org",
    explorerUrl: "https://explorer.mainnet.near.org",
  };

  const near = await connect(connectionConfig);
  // create a NEAR account object
  const senderAccount = await near.account(sender);

  let contract = new Contract(senderAccount, "treasurydao.near", {
    viewMethods: ["get_proposals", "get_specific_proposal"],
    changeMethods: ["fund", "burrow"],
  });

  contract
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
              amount: "1000000000000000000000000",
              account_id: "contract.main.burrow.near",
              msg1: "",
              vec: [{ IncreaseCollateral: { token_id: "wrap.near" } }],
              msg2: '{"Execute":{"actions":[{"Borrow":{"token_id":"dac17f958d2ee523a2206206994597c13d831ec7.factory.bridge.near","amount":"1000000000000000000"}},{"Withdraw":{"token_id":"dac17f958d2ee523a2206206994597c13d831ec7.factory.bridge.near","max_amount":"10000000000000000000"}}]}}',
            },
            "250000000000000"
          )
          .then((res) => {
            console.log("The burrow transaction has been completed", res);
          })
          .catch((err) => {
            console.log("This is an error", err);
          });
        console.log("The Burrow transaction is now sent");
      } else {
        console.log("Oops ! The transaction wasn't sent successfully'");
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
