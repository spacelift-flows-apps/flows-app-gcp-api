import iam_lintPolicy from "./iam/lintPolicy.ts";
import iam_queryAuditableServices from "./iam/queryAuditableServices.ts";
import iam_signBlob from "./iam/signBlob.ts";
import iam_signJwt from "./iam/signJwt.ts";
import permissions_queryTestablePermissions from "./permissions/queryTestablePermissions.ts";
import roles_createRole from "./roles/createRole.ts";
import roles_deleteRole from "./roles/deleteRole.ts";
import roles_getRole from "./roles/getRole.ts";
import roles_listRoles from "./roles/listRoles.ts";
import roles_queryGrantableRoles from "./roles/queryGrantableRoles.ts";
import roles_undeleteRole from "./roles/undeleteRole.ts";
import roles_updateRole from "./roles/updateRole.ts";
import service_account_keys_createServiceAccountKey from "./service_account_keys/createServiceAccountKey.ts";
import service_account_keys_deleteServiceAccountKey from "./service_account_keys/deleteServiceAccountKey.ts";
import service_account_keys_disableServiceAccountKey from "./service_account_keys/disableServiceAccountKey.ts";
import service_account_keys_enableServiceAccountKey from "./service_account_keys/enableServiceAccountKey.ts";
import service_account_keys_getServiceAccountKey from "./service_account_keys/getServiceAccountKey.ts";
import service_account_keys_listServiceAccountKeys from "./service_account_keys/listServiceAccountKeys.ts";
import service_account_keys_uploadServiceAccountKey from "./service_account_keys/uploadServiceAccountKey.ts";
import service_accounts_createServiceAccount from "./service_accounts/createServiceAccount.ts";
import service_accounts_deleteServiceAccount from "./service_accounts/deleteServiceAccount.ts";
import service_accounts_disableServiceAccount from "./service_accounts/disableServiceAccount.ts";
import service_accounts_enableServiceAccount from "./service_accounts/enableServiceAccount.ts";
import service_accounts_getServiceAccount from "./service_accounts/getServiceAccount.ts";
import service_accounts_listServiceAccounts from "./service_accounts/listServiceAccounts.ts";
import service_accounts_patchServiceAccount from "./service_accounts/patchServiceAccount.ts";
import service_accounts_undeleteServiceAccount from "./service_accounts/undeleteServiceAccount.ts";
import service_accounts_updateServiceAccount from "./service_accounts/updateServiceAccount.ts";

export const blocks = {
  iam_lintPolicy: iam_lintPolicy,
  iam_queryAuditableServices: iam_queryAuditableServices,
  iam_signBlob: iam_signBlob,
  iam_signJwt: iam_signJwt,
  permissions_queryTestablePermissions: permissions_queryTestablePermissions,
  roles_createRole: roles_createRole,
  roles_deleteRole: roles_deleteRole,
  roles_getRole: roles_getRole,
  roles_listRoles: roles_listRoles,
  roles_queryGrantableRoles: roles_queryGrantableRoles,
  roles_undeleteRole: roles_undeleteRole,
  roles_updateRole: roles_updateRole,
  service_account_keys_createServiceAccountKey:
    service_account_keys_createServiceAccountKey,
  service_account_keys_deleteServiceAccountKey:
    service_account_keys_deleteServiceAccountKey,
  service_account_keys_disableServiceAccountKey:
    service_account_keys_disableServiceAccountKey,
  service_account_keys_enableServiceAccountKey:
    service_account_keys_enableServiceAccountKey,
  service_account_keys_getServiceAccountKey:
    service_account_keys_getServiceAccountKey,
  service_account_keys_listServiceAccountKeys:
    service_account_keys_listServiceAccountKeys,
  service_account_keys_uploadServiceAccountKey:
    service_account_keys_uploadServiceAccountKey,
  service_accounts_createServiceAccount: service_accounts_createServiceAccount,
  service_accounts_deleteServiceAccount: service_accounts_deleteServiceAccount,
  service_accounts_disableServiceAccount:
    service_accounts_disableServiceAccount,
  service_accounts_enableServiceAccount: service_accounts_enableServiceAccount,
  service_accounts_getServiceAccount: service_accounts_getServiceAccount,
  service_accounts_listServiceAccounts: service_accounts_listServiceAccounts,
  service_accounts_patchServiceAccount: service_accounts_patchServiceAccount,
  service_accounts_undeleteServiceAccount:
    service_accounts_undeleteServiceAccount,
  service_accounts_updateServiceAccount: service_accounts_updateServiceAccount,
};
