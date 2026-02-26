import secret_versions_accessSecretVersion from "./secret_versions/accessSecretVersion.ts";
import secret_versions_addSecretVersion from "./secret_versions/addSecretVersion.ts";
import secret_versions_destroySecretVersion from "./secret_versions/destroySecretVersion.ts";
import secret_versions_disableSecretVersion from "./secret_versions/disableSecretVersion.ts";
import secret_versions_enableSecretVersion from "./secret_versions/enableSecretVersion.ts";
import secret_versions_getSecretVersion from "./secret_versions/getSecretVersion.ts";
import secret_versions_listSecretVersions from "./secret_versions/listSecretVersions.ts";
import secrets_createSecret from "./secrets/createSecret.ts";
import secrets_deleteSecret from "./secrets/deleteSecret.ts";
import secrets_getSecret from "./secrets/getSecret.ts";
import secrets_listSecrets from "./secrets/listSecrets.ts";
import secrets_updateSecret from "./secrets/updateSecret.ts";

export const blocks = {
  secret_versions_accessSecretVersion: secret_versions_accessSecretVersion,
  secret_versions_addSecretVersion: secret_versions_addSecretVersion,
  secret_versions_destroySecretVersion: secret_versions_destroySecretVersion,
  secret_versions_disableSecretVersion: secret_versions_disableSecretVersion,
  secret_versions_enableSecretVersion: secret_versions_enableSecretVersion,
  secret_versions_getSecretVersion: secret_versions_getSecretVersion,
  secret_versions_listSecretVersions: secret_versions_listSecretVersions,
  secrets_createSecret: secrets_createSecret,
  secrets_deleteSecret: secrets_deleteSecret,
  secrets_getSecret: secrets_getSecret,
  secrets_listSecrets: secrets_listSecrets,
  secrets_updateSecret: secrets_updateSecret,
};
