import express from "express";
import cors from "cors";
import codeBlocks from "./data/codeBlocks.js";

const app = express();
const port = 8080;

app.use(cors());
app.use(express.json());

app.get("/api/lobby", (req, res) => {
  let codeBlocksTitles;
  try {
    codeBlocksTitles = codeBlocks.map((code) => code.title);
  } catch (error) {
    console.error(error.message);
    return res.status(500).send(error.message);
  }
  return res.send(codeBlocksTitles);
});
//get code block code by it's title
app.get("/api/code-block/:title", (req, res) => {
  const title = req.params.title;
  let codeBlock;
  try {
    codeBlock = codeBlocks.find((code) => code.title === title);
  } catch (error) {
    console.error(error.message);
    return res.status(500).send(error.message);
  }
  return res.send(codeBlock);
});
//We want the first client who enters the code block to be the mentor.
//if "codeBlock.locked is truthy- (meaning a first entrance had already happened) send a 423 "LOCKED" status, 
//else set the locked val to true
app.post("/api/code-block/:title/lock", (req, res) => {
  const title = req.params.title;
  let codeBlock;
  try {
    codeBlock = codeBlocks.find((code) => code.title === title);
  } catch (error) {
    console.error(error.message);
    return res.status(500).send(error.message);
  }
  if (codeBlock.locked) {
    return res.status(423).send();//user is already locked
  }
  codeBlock.locked = true;// set the locked val to true
  return res.send();
});

app.post("/api/code-block/:title", (req, res) => {
  const title = req.params.title;
  let codeBlock;
  try {
    codeBlock = codeBlocks.find((codeBlock) => codeBlock.title === title);
    if (!codeBlock) {
      console.log("Code block not found for update:", title);
      return res.status(404).send("Code block not found");
    }

    codeBlock.code = req.body.code;
  } catch (error) {
    console.error(error.message);
    return res.status(500).send(error.message);
  }
  return res.send();
});
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
