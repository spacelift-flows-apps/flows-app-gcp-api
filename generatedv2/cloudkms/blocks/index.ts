import createKeyHandle from "./autokey/createKeyHandle.ts";
import getKeyHandle from "./autokey/getKeyHandle.ts";
import listKeyHandles from "./autokey/listKeyHandles.ts";
import updateAutokeyConfig from "./autokey/updateAutokeyConfig.ts";
import getAutokeyConfig from "./autokey/getAutokeyConfig.ts";
import showEffectiveAutokeyConfig from "./autokey/showEffectiveAutokeyConfig.ts";
import listSingleTenantHsmInstances from "./general/listSingleTenantHsmInstances.ts";
import getSingleTenantHsmInstance from "./general/getSingleTenantHsmInstance.ts";
import createSingleTenantHsmInstance from "./general/createSingleTenantHsmInstance.ts";
import createSingleTenantHsmInstanceProposal from "./general/createSingleTenantHsmInstanceProposal.ts";
import approveSingleTenantHsmInstanceProposal from "./general/approveSingleTenantHsmInstanceProposal.ts";
import executeSingleTenantHsmInstanceProposal from "./general/executeSingleTenantHsmInstanceProposal.ts";
import getSingleTenantHsmInstanceProposal from "./general/getSingleTenantHsmInstanceProposal.ts";
import listSingleTenantHsmInstanceProposals from "./general/listSingleTenantHsmInstanceProposals.ts";
import deleteSingleTenantHsmInstanceProposal from "./general/deleteSingleTenantHsmInstanceProposal.ts";
import listKeyRings from "./key_rings/listKeyRings.ts";
import listCryptoKeys from "./crypto_keys/listCryptoKeys.ts";
import listCryptoKeyVersions from "./crypto_key_versions/listCryptoKeyVersions.ts";
import listImportJobs from "./import_jobs/listImportJobs.ts";
import listRetiredResources from "./crypto_keys/listRetiredResources.ts";
import getKeyRing from "./key_rings/getKeyRing.ts";
import getCryptoKey from "./crypto_keys/getCryptoKey.ts";
import getCryptoKeyVersion from "./crypto_key_versions/getCryptoKeyVersion.ts";
import getPublicKey from "./crypto_keys/getPublicKey.ts";
import getImportJob from "./import_jobs/getImportJob.ts";
import getRetiredResource from "./crypto_keys/getRetiredResource.ts";
import createKeyRing from "./key_rings/createKeyRing.ts";
import createCryptoKey from "./crypto_keys/createCryptoKey.ts";
import createCryptoKeyVersion from "./crypto_key_versions/createCryptoKeyVersion.ts";
import deleteCryptoKey from "./crypto_keys/deleteCryptoKey.ts";
import deleteCryptoKeyVersion from "./crypto_key_versions/deleteCryptoKeyVersion.ts";
import importCryptoKeyVersion from "./crypto_key_versions/importCryptoKeyVersion.ts";
import createImportJob from "./import_jobs/createImportJob.ts";
import updateCryptoKey from "./crypto_keys/updateCryptoKey.ts";
import updateCryptoKeyVersion from "./crypto_key_versions/updateCryptoKeyVersion.ts";
import updateCryptoKeyPrimaryVersion from "./crypto_keys/updateCryptoKeyPrimaryVersion.ts";
import destroyCryptoKeyVersion from "./crypto_key_versions/destroyCryptoKeyVersion.ts";
import restoreCryptoKeyVersion from "./crypto_key_versions/restoreCryptoKeyVersion.ts";
import encrypt from "./crypto_keys/encrypt.ts";
import decrypt from "./crypto_keys/decrypt.ts";
import rawEncrypt from "./crypto_keys/rawEncrypt.ts";
import rawDecrypt from "./crypto_keys/rawDecrypt.ts";
import asymmetricSign from "./crypto_keys/asymmetricSign.ts";
import asymmetricDecrypt from "./crypto_keys/asymmetricDecrypt.ts";
import macSign from "./crypto_keys/macSign.ts";
import macVerify from "./crypto_keys/macVerify.ts";
import decapsulate from "./crypto_keys/decapsulate.ts";
import generateRandomBytes from "./crypto_keys/generateRandomBytes.ts";
import listEkmConnections from "./connections/listEkmConnections.ts";
import getEkmConnection from "./connections/getEkmConnection.ts";
import createEkmConnection from "./connections/createEkmConnection.ts";
import updateEkmConnection from "./connections/updateEkmConnection.ts";
import getEkmConfig from "./ekm/getEkmConfig.ts";
import updateEkmConfig from "./ekm/updateEkmConfig.ts";
import verifyConnectivity from "./ekm/verifyConnectivity.ts";

export const blocks = {
  autokey_createKeyHandle: createKeyHandle,
  autokey_getKeyHandle: getKeyHandle,
  autokey_listKeyHandles: listKeyHandles,
  autokey_updateAutokeyConfig: updateAutokeyConfig,
  autokey_getAutokeyConfig: getAutokeyConfig,
  autokey_showEffectiveAutokeyConfig: showEffectiveAutokeyConfig,
  general_listSingleTenantHsmInstances: listSingleTenantHsmInstances,
  general_getSingleTenantHsmInstance: getSingleTenantHsmInstance,
  general_createSingleTenantHsmInstance: createSingleTenantHsmInstance,
  general_createSingleTenantHsmInstanceProposal:
    createSingleTenantHsmInstanceProposal,
  general_approveSingleTenantHsmInstanceProposal:
    approveSingleTenantHsmInstanceProposal,
  general_executeSingleTenantHsmInstanceProposal:
    executeSingleTenantHsmInstanceProposal,
  general_getSingleTenantHsmInstanceProposal:
    getSingleTenantHsmInstanceProposal,
  general_listSingleTenantHsmInstanceProposals:
    listSingleTenantHsmInstanceProposals,
  general_deleteSingleTenantHsmInstanceProposal:
    deleteSingleTenantHsmInstanceProposal,
  key_rings_listKeyRings: listKeyRings,
  crypto_keys_listCryptoKeys: listCryptoKeys,
  crypto_key_versions_listCryptoKeyVersions: listCryptoKeyVersions,
  import_jobs_listImportJobs: listImportJobs,
  crypto_keys_listRetiredResources: listRetiredResources,
  key_rings_getKeyRing: getKeyRing,
  crypto_keys_getCryptoKey: getCryptoKey,
  crypto_key_versions_getCryptoKeyVersion: getCryptoKeyVersion,
  crypto_keys_getPublicKey: getPublicKey,
  import_jobs_getImportJob: getImportJob,
  crypto_keys_getRetiredResource: getRetiredResource,
  key_rings_createKeyRing: createKeyRing,
  crypto_keys_createCryptoKey: createCryptoKey,
  crypto_key_versions_createCryptoKeyVersion: createCryptoKeyVersion,
  crypto_keys_deleteCryptoKey: deleteCryptoKey,
  crypto_key_versions_deleteCryptoKeyVersion: deleteCryptoKeyVersion,
  crypto_key_versions_importCryptoKeyVersion: importCryptoKeyVersion,
  import_jobs_createImportJob: createImportJob,
  crypto_keys_updateCryptoKey: updateCryptoKey,
  crypto_key_versions_updateCryptoKeyVersion: updateCryptoKeyVersion,
  crypto_keys_updateCryptoKeyPrimaryVersion: updateCryptoKeyPrimaryVersion,
  crypto_key_versions_destroyCryptoKeyVersion: destroyCryptoKeyVersion,
  crypto_key_versions_restoreCryptoKeyVersion: restoreCryptoKeyVersion,
  crypto_keys_encrypt: encrypt,
  crypto_keys_decrypt: decrypt,
  crypto_keys_rawEncrypt: rawEncrypt,
  crypto_keys_rawDecrypt: rawDecrypt,
  crypto_keys_asymmetricSign: asymmetricSign,
  crypto_keys_asymmetricDecrypt: asymmetricDecrypt,
  crypto_keys_macSign: macSign,
  crypto_keys_macVerify: macVerify,
  crypto_keys_decapsulate: decapsulate,
  crypto_keys_generateRandomBytes: generateRandomBytes,
  connections_listEkmConnections: listEkmConnections,
  connections_getEkmConnection: getEkmConnection,
  connections_createEkmConnection: createEkmConnection,
  connections_updateEkmConnection: updateEkmConnection,
  ekm_getEkmConfig: getEkmConfig,
  ekm_updateEkmConfig: updateEkmConfig,
  ekm_verifyConnectivity: verifyConnectivity,
};
