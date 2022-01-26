import {context} from "@actions/github";
import {getInput, setFailed, setOutput} from "@actions/core";
import path from "path";
import fs from "fs";
import validateMetadata from "helpers/validateMetaData";
import getFilePaths from "helpers/getFilePaths";
import validateFiles from "helpers/validateFiles";
import createGMA from "helpers/createGMA";
import { GMA_PATH } from "./constants";
import buildDescription from "helpers/buildDescription";
import publishGMA from "helpers/publishGMA";

try {
    const accountName = getInput("account-name");
    const accountPassword = getInput("account-password");
    const workshopId = getInput("workshop-id");
    const accountSecret = getInput("account-secret");
    const addonPath = getInput("addon-path");

    const metadataPath = path.join(addonPath, "addon.json");

    if (!fs.existsSync(metadataPath)) 
        setFailed("missing addon.json!");

    const metadata = JSON.parse(fs.readFileSync(metadataPath).toString());
    validateMetadata(metadata);

    const filePaths = getFilePaths(addonPath, metadata.ignore);
    validateFiles(filePaths);

    createGMA(GMA_PATH, metadata.title, buildDescription(metadata), filePaths, addonPath);


    let changes = ""

    // originally this was a "DEBUG" flag, but its preferable we use the NODE_ENV environment vairable instead.
    if (process.env.NODE_ENV === "development") {
        changes = "DEBUG MESSAGE";
    } else {
        if (context.payload.head_commit && context.payload.head_commit.message)
          changes = context.payload.head_commit.message;
    }

    publishGMA(accountName, accountPassword, workshopId, GMA_PATH, changes, accountSecret);
    setOutput("error-code", 0);
    process.exit(0);
} catch (e) {
    console.error(e);
    setFailed(e);
    process.exit(1);
}