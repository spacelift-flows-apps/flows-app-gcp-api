import listSecrets from "./secrets/listSecrets.ts";
import createSecret from "./secrets/createSecret.ts";
import addSecretVersion from "./secret_versions/addSecretVersion.ts";
import getSecret from "./secrets/getSecret.ts";
import updateSecret from "./secrets/updateSecret.ts";
import deleteSecret from "./secrets/deleteSecret.ts";
import listSecretVersions from "./secret_versions/listSecretVersions.ts";
import getSecretVersion from "./secret_versions/getSecretVersion.ts";
import accessSecretVersion from "./secret_versions/accessSecretVersion.ts";
import disableSecretVersion from "./secret_versions/disableSecretVersion.ts";
import enableSecretVersion from "./secret_versions/enableSecretVersion.ts";
import destroySecretVersion from "./secret_versions/destroySecretVersion.ts";
import setIamPolicy from "./iam/setIamPolicy.ts";
import getIamPolicy from "./iam/getIamPolicy.ts";
import testIamPermissions from "./iam/testIamPermissions.ts";

export const blocks = {
  secrets_listSecrets: listSecrets,
  secrets_createSecret: createSecret,
  secret_versions_addSecretVersion: addSecretVersion,
  secrets_getSecret: getSecret,
  secrets_updateSecret: updateSecret,
  secrets_deleteSecret: deleteSecret,
  secret_versions_listSecretVersions: listSecretVersions,
  secret_versions_getSecretVersion: getSecretVersion,
  secret_versions_accessSecretVersion: accessSecretVersion,
  secret_versions_disableSecretVersion: disableSecretVersion,
  secret_versions_enableSecretVersion: enableSecretVersion,
  secret_versions_destroySecretVersion: destroySecretVersion,
  iam_setIamPolicy: setIamPolicy,
  iam_getIamPolicy: getIamPolicy,
  iam_testIamPermissions: testIamPermissions,
};
