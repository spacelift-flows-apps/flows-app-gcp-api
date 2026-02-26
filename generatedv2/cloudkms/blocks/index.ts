import autokey_createKeyHandle from "./autokey/createKeyHandle.ts";
import autokey_getAutokeyConfig from "./autokey/getAutokeyConfig.ts";
import autokey_getKeyHandle from "./autokey/getKeyHandle.ts";
import autokey_listKeyHandles from "./autokey/listKeyHandles.ts";
import autokey_showEffectiveAutokeyConfig from "./autokey/showEffectiveAutokeyConfig.ts";
import autokey_updateAutokeyConfig from "./autokey/updateAutokeyConfig.ts";
import connections_createEkmConnection from "./connections/createEkmConnection.ts";
import connections_getEkmConnection from "./connections/getEkmConnection.ts";
import connections_listEkmConnections from "./connections/listEkmConnections.ts";
import connections_updateEkmConnection from "./connections/updateEkmConnection.ts";
import crypto_key_versions_createCryptoKeyVersion from "./crypto_key_versions/createCryptoKeyVersion.ts";
import crypto_key_versions_deleteCryptoKeyVersion from "./crypto_key_versions/deleteCryptoKeyVersion.ts";
import crypto_key_versions_destroyCryptoKeyVersion from "./crypto_key_versions/destroyCryptoKeyVersion.ts";
import crypto_key_versions_getCryptoKeyVersion from "./crypto_key_versions/getCryptoKeyVersion.ts";
import crypto_key_versions_importCryptoKeyVersion from "./crypto_key_versions/importCryptoKeyVersion.ts";
import crypto_key_versions_listCryptoKeyVersions from "./crypto_key_versions/listCryptoKeyVersions.ts";
import crypto_key_versions_restoreCryptoKeyVersion from "./crypto_key_versions/restoreCryptoKeyVersion.ts";
import crypto_key_versions_updateCryptoKeyVersion from "./crypto_key_versions/updateCryptoKeyVersion.ts";
import crypto_keys_asymmetricDecrypt from "./crypto_keys/asymmetricDecrypt.ts";
import crypto_keys_asymmetricSign from "./crypto_keys/asymmetricSign.ts";
import crypto_keys_createCryptoKey from "./crypto_keys/createCryptoKey.ts";
import crypto_keys_decapsulate from "./crypto_keys/decapsulate.ts";
import crypto_keys_decrypt from "./crypto_keys/decrypt.ts";
import crypto_keys_deleteCryptoKey from "./crypto_keys/deleteCryptoKey.ts";
import crypto_keys_encrypt from "./crypto_keys/encrypt.ts";
import crypto_keys_generateRandomBytes from "./crypto_keys/generateRandomBytes.ts";
import crypto_keys_getCryptoKey from "./crypto_keys/getCryptoKey.ts";
import crypto_keys_getPublicKey from "./crypto_keys/getPublicKey.ts";
import crypto_keys_getRetiredResource from "./crypto_keys/getRetiredResource.ts";
import crypto_keys_listCryptoKeys from "./crypto_keys/listCryptoKeys.ts";
import crypto_keys_listRetiredResources from "./crypto_keys/listRetiredResources.ts";
import crypto_keys_macSign from "./crypto_keys/macSign.ts";
import crypto_keys_macVerify from "./crypto_keys/macVerify.ts";
import crypto_keys_rawDecrypt from "./crypto_keys/rawDecrypt.ts";
import crypto_keys_rawEncrypt from "./crypto_keys/rawEncrypt.ts";
import crypto_keys_updateCryptoKey from "./crypto_keys/updateCryptoKey.ts";
import crypto_keys_updateCryptoKeyPrimaryVersion from "./crypto_keys/updateCryptoKeyPrimaryVersion.ts";
import ekm_getEkmConfig from "./ekm/getEkmConfig.ts";
import ekm_updateEkmConfig from "./ekm/updateEkmConfig.ts";
import ekm_verifyConnectivity from "./ekm/verifyConnectivity.ts";
import general_approveSingleTenantHsmInstanceProposal from "./general/approveSingleTenantHsmInstanceProposal.ts";
import general_createSingleTenantHsmInstance from "./general/createSingleTenantHsmInstance.ts";
import general_createSingleTenantHsmInstanceProposal from "./general/createSingleTenantHsmInstanceProposal.ts";
import general_deleteSingleTenantHsmInstanceProposal from "./general/deleteSingleTenantHsmInstanceProposal.ts";
import general_executeSingleTenantHsmInstanceProposal from "./general/executeSingleTenantHsmInstanceProposal.ts";
import general_getSingleTenantHsmInstance from "./general/getSingleTenantHsmInstance.ts";
import general_getSingleTenantHsmInstanceProposal from "./general/getSingleTenantHsmInstanceProposal.ts";
import general_listSingleTenantHsmInstanceProposals from "./general/listSingleTenantHsmInstanceProposals.ts";
import general_listSingleTenantHsmInstances from "./general/listSingleTenantHsmInstances.ts";
import import_jobs_createImportJob from "./import_jobs/createImportJob.ts";
import import_jobs_getImportJob from "./import_jobs/getImportJob.ts";
import import_jobs_listImportJobs from "./import_jobs/listImportJobs.ts";
import key_rings_createKeyRing from "./key_rings/createKeyRing.ts";
import key_rings_getKeyRing from "./key_rings/getKeyRing.ts";
import key_rings_listKeyRings from "./key_rings/listKeyRings.ts";

export const blocks = {
  autokey_createKeyHandle: autokey_createKeyHandle,
  autokey_getAutokeyConfig: autokey_getAutokeyConfig,
  autokey_getKeyHandle: autokey_getKeyHandle,
  autokey_listKeyHandles: autokey_listKeyHandles,
  autokey_showEffectiveAutokeyConfig: autokey_showEffectiveAutokeyConfig,
  autokey_updateAutokeyConfig: autokey_updateAutokeyConfig,
  connections_createEkmConnection: connections_createEkmConnection,
  connections_getEkmConnection: connections_getEkmConnection,
  connections_listEkmConnections: connections_listEkmConnections,
  connections_updateEkmConnection: connections_updateEkmConnection,
  crypto_key_versions_createCryptoKeyVersion:
    crypto_key_versions_createCryptoKeyVersion,
  crypto_key_versions_deleteCryptoKeyVersion:
    crypto_key_versions_deleteCryptoKeyVersion,
  crypto_key_versions_destroyCryptoKeyVersion:
    crypto_key_versions_destroyCryptoKeyVersion,
  crypto_key_versions_getCryptoKeyVersion:
    crypto_key_versions_getCryptoKeyVersion,
  crypto_key_versions_importCryptoKeyVersion:
    crypto_key_versions_importCryptoKeyVersion,
  crypto_key_versions_listCryptoKeyVersions:
    crypto_key_versions_listCryptoKeyVersions,
  crypto_key_versions_restoreCryptoKeyVersion:
    crypto_key_versions_restoreCryptoKeyVersion,
  crypto_key_versions_updateCryptoKeyVersion:
    crypto_key_versions_updateCryptoKeyVersion,
  crypto_keys_asymmetricDecrypt: crypto_keys_asymmetricDecrypt,
  crypto_keys_asymmetricSign: crypto_keys_asymmetricSign,
  crypto_keys_createCryptoKey: crypto_keys_createCryptoKey,
  crypto_keys_decapsulate: crypto_keys_decapsulate,
  crypto_keys_decrypt: crypto_keys_decrypt,
  crypto_keys_deleteCryptoKey: crypto_keys_deleteCryptoKey,
  crypto_keys_encrypt: crypto_keys_encrypt,
  crypto_keys_generateRandomBytes: crypto_keys_generateRandomBytes,
  crypto_keys_getCryptoKey: crypto_keys_getCryptoKey,
  crypto_keys_getPublicKey: crypto_keys_getPublicKey,
  crypto_keys_getRetiredResource: crypto_keys_getRetiredResource,
  crypto_keys_listCryptoKeys: crypto_keys_listCryptoKeys,
  crypto_keys_listRetiredResources: crypto_keys_listRetiredResources,
  crypto_keys_macSign: crypto_keys_macSign,
  crypto_keys_macVerify: crypto_keys_macVerify,
  crypto_keys_rawDecrypt: crypto_keys_rawDecrypt,
  crypto_keys_rawEncrypt: crypto_keys_rawEncrypt,
  crypto_keys_updateCryptoKey: crypto_keys_updateCryptoKey,
  crypto_keys_updateCryptoKeyPrimaryVersion:
    crypto_keys_updateCryptoKeyPrimaryVersion,
  ekm_getEkmConfig: ekm_getEkmConfig,
  ekm_updateEkmConfig: ekm_updateEkmConfig,
  ekm_verifyConnectivity: ekm_verifyConnectivity,
  general_approveSingleTenantHsmInstanceProposal:
    general_approveSingleTenantHsmInstanceProposal,
  general_createSingleTenantHsmInstance: general_createSingleTenantHsmInstance,
  general_createSingleTenantHsmInstanceProposal:
    general_createSingleTenantHsmInstanceProposal,
  general_deleteSingleTenantHsmInstanceProposal:
    general_deleteSingleTenantHsmInstanceProposal,
  general_executeSingleTenantHsmInstanceProposal:
    general_executeSingleTenantHsmInstanceProposal,
  general_getSingleTenantHsmInstance: general_getSingleTenantHsmInstance,
  general_getSingleTenantHsmInstanceProposal:
    general_getSingleTenantHsmInstanceProposal,
  general_listSingleTenantHsmInstanceProposals:
    general_listSingleTenantHsmInstanceProposals,
  general_listSingleTenantHsmInstances: general_listSingleTenantHsmInstances,
  import_jobs_createImportJob: import_jobs_createImportJob,
  import_jobs_getImportJob: import_jobs_getImportJob,
  import_jobs_listImportJobs: import_jobs_listImportJobs,
  key_rings_createKeyRing: key_rings_createKeyRing,
  key_rings_getKeyRing: key_rings_getKeyRing,
  key_rings_listKeyRings: key_rings_listKeyRings,
};
