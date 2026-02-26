import functions_getFunction from "./functions/getFunction.ts";
import functions_listFunctions from "./functions/listFunctions.ts";
import functions_createFunction from "./functions/createFunction.ts";
import functions_updateFunction from "./functions/updateFunction.ts";
import functions_deleteFunction from "./functions/deleteFunction.ts";
import functions_generateUploadUrl from "./functions/generateUploadUrl.ts";
import functions_generateDownloadUrl from "./functions/generateDownloadUrl.ts";
import functions_listRuntimes from "./functions/listRuntimes.ts";

export const blocks = {
  functions_getFunction: functions_getFunction,
  functions_listFunctions: functions_listFunctions,
  functions_createFunction: functions_createFunction,
  functions_updateFunction: functions_updateFunction,
  functions_deleteFunction: functions_deleteFunction,
  functions_generateUploadUrl: functions_generateUploadUrl,
  functions_generateDownloadUrl: functions_generateDownloadUrl,
  functions_listRuntimes: functions_listRuntimes,
};
