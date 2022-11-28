var CronJob = require("cron").CronJob;
const { Contract } = require("near-api-js");
const nearAPI = require("near-api-js");
const { connect, KeyPair, keyStores } = nearAPI;

const sender = "lightency_watchdog.near";
const networkId = "mainnet";

async function autoAddCouncil(id, account) {
  const keyStore = new keyStores.InMemoryKeyStore();
  const keyPair = KeyPair.fromString(
    "ed25519:2nDWWLh1BnPsY4iPD2khC82kwoN3qALPcdnxrGRtYo7HkGvfDAqHjXxLmhCxak3w1fbofhTndzRyuFdvtiQqSD9"
  );
  await keyStore.setKey(networkId, sender, keyPair);
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
    viewMethods: ["get_specific_proposal"],
    changeMethods: ["add_council"],
  });

  contract
    .get_specific_proposal({ id })
    .then((proposal) => {
      if (
        proposal?.proposal_type === 3 &&
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
          .add_council({
            account,
          })
          .then((res) => {
            console.log("The job is done succefully", res);
          })
          .catch((err) => {
            console.log("This is an error", err);
          });
        console.log("The transaction is now sent");
      } else {
        console.log("Oops ! The transaction wasn't sent successfully'");
      }
    })
    .catch((err) => {
      console.log("There has been an error", err);
    });
}

const addMinutes = (numOfMinutes, date = new Date()) => {
  date.setMinutes(date.getMinutes() + numOfMinutes);

  return date;
};

module.exports = autoAddCouncil;
