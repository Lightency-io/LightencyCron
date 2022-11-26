var CronJob = require("cron").CronJob;
const { Contract } = require("near-api-js");
const nearAPI = require("near-api-js");
const { connect, KeyPair, keyStores } = nearAPI;

const sender = "alach.testnet";
const networkId = "default";

async function autoFund(id, amount) {
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
  let contract = new Contract(senderAccount, "treasurydao.testnet", {
    viewMethods: ["get_proposals", "get_specific_proposal"],
    changeMethods: ["fund"],
  });

  contract
    .get_specific_proposal({ id: id })
    .then((proposal) => {
      //console.log(proposals)
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
          .fund({
            account: "energydao.testnet",
            amount,
          })
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

module.exports = autoFund;
