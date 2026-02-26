import getFunction from "./functions/getFunction.ts";
import listFunctions from "./functions/listFunctions.ts";
import createFunction from "./functions/createFunction.ts";
import updateFunction from "./functions/updateFunction.ts";
import deleteFunction from "./functions/deleteFunction.ts";
import generateUploadUrl from "./functions/generateUploadUrl.ts";
import generateDownloadUrl from "./functions/generateDownloadUrl.ts";
import listRuntimes from "./functions/listRuntimes.ts";

export const blocks = {
  functions_getFunction: getFunction,
  functions_listFunctions: listFunctions,
  functions_createFunction: createFunction,
  functions_updateFunction: updateFunction,
  functions_deleteFunction: deleteFunction,
  functions_generateUploadUrl: generateUploadUrl,
  functions_generateDownloadUrl: generateDownloadUrl,
  functions_listRuntimes: listRuntimes,
};
