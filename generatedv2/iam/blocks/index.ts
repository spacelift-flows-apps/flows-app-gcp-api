import listServiceAccounts from "./service_accounts/listServiceAccounts.ts";
import getServiceAccount from "./service_accounts/getServiceAccount.ts";
import createServiceAccount from "./service_accounts/createServiceAccount.ts";
import updateServiceAccount from "./service_accounts/updateServiceAccount.ts";
import patchServiceAccount from "./service_accounts/patchServiceAccount.ts";
import deleteServiceAccount from "./service_accounts/deleteServiceAccount.ts";
import undeleteServiceAccount from "./service_accounts/undeleteServiceAccount.ts";
import enableServiceAccount from "./service_accounts/enableServiceAccount.ts";
import disableServiceAccount from "./service_accounts/disableServiceAccount.ts";
import listServiceAccountKeys from "./service_account_keys/listServiceAccountKeys.ts";
import getServiceAccountKey from "./service_account_keys/getServiceAccountKey.ts";
import createServiceAccountKey from "./service_account_keys/createServiceAccountKey.ts";
import uploadServiceAccountKey from "./service_account_keys/uploadServiceAccountKey.ts";
import deleteServiceAccountKey from "./service_account_keys/deleteServiceAccountKey.ts";
import disableServiceAccountKey from "./service_account_keys/disableServiceAccountKey.ts";
import enableServiceAccountKey from "./service_account_keys/enableServiceAccountKey.ts";
import signBlob from "./iam/signBlob.ts";
import signJwt from "./iam/signJwt.ts";
import getIamPolicy from "./iam/getIamPolicy.ts";
import setIamPolicy from "./iam/setIamPolicy.ts";
import testIamPermissions from "./iam/testIamPermissions.ts";
import queryGrantableRoles from "./roles/queryGrantableRoles.ts";
import listRoles from "./roles/listRoles.ts";
import getRole from "./roles/getRole.ts";
import createRole from "./roles/createRole.ts";
import updateRole from "./roles/updateRole.ts";
import deleteRole from "./roles/deleteRole.ts";
import undeleteRole from "./roles/undeleteRole.ts";
import queryTestablePermissions from "./iam/queryTestablePermissions.ts";
import queryAuditableServices from "./iam/queryAuditableServices.ts";
import lintPolicy from "./iam/lintPolicy.ts";

export const blocks = {
  service_accounts_listServiceAccounts: listServiceAccounts,
  service_accounts_getServiceAccount: getServiceAccount,
  service_accounts_createServiceAccount: createServiceAccount,
  service_accounts_updateServiceAccount: updateServiceAccount,
  service_accounts_patchServiceAccount: patchServiceAccount,
  service_accounts_deleteServiceAccount: deleteServiceAccount,
  service_accounts_undeleteServiceAccount: undeleteServiceAccount,
  service_accounts_enableServiceAccount: enableServiceAccount,
  service_accounts_disableServiceAccount: disableServiceAccount,
  service_account_keys_listServiceAccountKeys: listServiceAccountKeys,
  service_account_keys_getServiceAccountKey: getServiceAccountKey,
  service_account_keys_createServiceAccountKey: createServiceAccountKey,
  service_account_keys_uploadServiceAccountKey: uploadServiceAccountKey,
  service_account_keys_deleteServiceAccountKey: deleteServiceAccountKey,
  service_account_keys_disableServiceAccountKey: disableServiceAccountKey,
  service_account_keys_enableServiceAccountKey: enableServiceAccountKey,
  iam_signBlob: signBlob,
  iam_signJwt: signJwt,
  iam_getIamPolicy: getIamPolicy,
  iam_setIamPolicy: setIamPolicy,
  iam_testIamPermissions: testIamPermissions,
  roles_queryGrantableRoles: queryGrantableRoles,
  roles_listRoles: listRoles,
  roles_getRole: getRole,
  roles_createRole: createRole,
  roles_updateRole: updateRole,
  roles_deleteRole: deleteRole,
  roles_undeleteRole: undeleteRole,
  iam_queryTestablePermissions: queryTestablePermissions,
  iam_queryAuditableServices: queryAuditableServices,
  iam_lintPolicy: lintPolicy,
};
