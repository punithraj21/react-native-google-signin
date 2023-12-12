// // import pino from "pino";
// // import axiomTransport from "@axiomhq/pino";

// // const AXIOM_TOKEN = "xaat-7101c982-dee3-44f4-bba1-c88d9eda7686";
// // const AXIOM_ORG_ID = "white-shark-4i6o";
// // const AXIOM_DATASET = "utilities";

// // let transport = null;
// // if (AXIOM_TOKEN && AXIOM_ORG_ID && AXIOM_DATASET) {
// //   transport = axiomTransport({
// //     orgId: AXIOM_ORG_ID,
// //     token: AXIOM_TOKEN,
// //     dataset: AXIOM_DATASET,
// //   });
// // }

// // const Logger = transport ? pino({ transport }) : pino();

// // export default Logger;
// // logger.js
// import { createLogger } from "react-native-logs";
// import axios from "axios";

// const axiomIngestEndpoint =
//   "https://cloud.axiom.co/api/v1/datasets/utilities/ingest";
// const axiomApiToken = "xaat-7101c982-dee3-44f4-bba1-c88d9eda7686";

// const axiomTransport = async (msg, level, _extra) => {
//   try {
//     await axios.post(
//       axiomIngestEndpoint,
//       {
//         message: msg,
//         level: level,
//       },
//       {
//         headers: {
//           Authorization: `Bearer ${axiomApiToken}`,
//           "Content-Type": "application/json",
//         },
//       },
//     );
//   } catch (error) {
//     console.error("Error sending log to Axiom:", error);
//   }
// };

// const levels = {
//   debug: 0,
//   info: 1,
//   warn: 2,
//   error: 3,
// };

// const config = {
//   severity: "info",
//   levels,
//   transport: axiomTransport,
// };

// const Logger = createLogger(config);

// export default Logger;
