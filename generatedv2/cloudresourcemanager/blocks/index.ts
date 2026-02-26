import folders_getFolder from "./folders/getFolder.ts";
import folders_listFolders from "./folders/listFolders.ts";
import folders_searchFolders from "./folders/searchFolders.ts";
import folders_createFolder from "./folders/createFolder.ts";
import folders_updateFolder from "./folders/updateFolder.ts";
import folders_moveFolder from "./folders/moveFolder.ts";
import folders_deleteFolder from "./folders/deleteFolder.ts";
import folders_undeleteFolder from "./folders/undeleteFolder.ts";
import iam_foldersGetIamPolicy from "./iam/foldersGetIamPolicy.ts";
import iam_foldersSetIamPolicy from "./iam/foldersSetIamPolicy.ts";
import iam_foldersTestIamPermissions from "./iam/foldersTestIamPermissions.ts";
import tag_bindings_listTagBindings from "./tag_bindings/listTagBindings.ts";
import tag_bindings_createTagBinding from "./tag_bindings/createTagBinding.ts";
import tag_bindings_deleteTagBinding from "./tag_bindings/deleteTagBinding.ts";
import tag_bindings_listEffectiveTags from "./tag_bindings/listEffectiveTags.ts";
import tag_holds_createTagHold from "./tag_holds/createTagHold.ts";
import tag_holds_deleteTagHold from "./tag_holds/deleteTagHold.ts";
import tag_holds_listTagHolds from "./tag_holds/listTagHolds.ts";
import tag_values_listTagValues from "./tag_values/listTagValues.ts";
import tag_values_getTagValue from "./tag_values/getTagValue.ts";
import tag_values_getNamespacedTagValue from "./tag_values/getNamespacedTagValue.ts";
import tag_values_createTagValue from "./tag_values/createTagValue.ts";
import tag_values_updateTagValue from "./tag_values/updateTagValue.ts";
import tag_values_deleteTagValue from "./tag_values/deleteTagValue.ts";
import iam_tagValuesGetIamPolicy from "./iam/tagValuesGetIamPolicy.ts";
import iam_tagValuesSetIamPolicy from "./iam/tagValuesSetIamPolicy.ts";
import iam_tagValuesTestIamPermissions from "./iam/tagValuesTestIamPermissions.ts";
import tag_keys_listTagKeys from "./tag_keys/listTagKeys.ts";
import tag_keys_getTagKey from "./tag_keys/getTagKey.ts";
import tag_keys_getNamespacedTagKey from "./tag_keys/getNamespacedTagKey.ts";
import tag_keys_createTagKey from "./tag_keys/createTagKey.ts";
import tag_keys_updateTagKey from "./tag_keys/updateTagKey.ts";
import tag_keys_deleteTagKey from "./tag_keys/deleteTagKey.ts";
import iam_tagKeysGetIamPolicy from "./iam/tagKeysGetIamPolicy.ts";
import iam_tagKeysSetIamPolicy from "./iam/tagKeysSetIamPolicy.ts";
import iam_tagKeysTestIamPermissions from "./iam/tagKeysTestIamPermissions.ts";
import organizations_getOrganization from "./organizations/getOrganization.ts";
import organizations_searchOrganizations from "./organizations/searchOrganizations.ts";
import iam_organizationsGetIamPolicy from "./iam/organizationsGetIamPolicy.ts";
import iam_organizationsSetIamPolicy from "./iam/organizationsSetIamPolicy.ts";
import iam_organizationsTestIamPermissions from "./iam/organizationsTestIamPermissions.ts";
import projects_getProject from "./projects/getProject.ts";
import projects_listProjects from "./projects/listProjects.ts";
import projects_searchProjects from "./projects/searchProjects.ts";
import projects_createProject from "./projects/createProject.ts";
import projects_updateProject from "./projects/updateProject.ts";
import projects_moveProject from "./projects/moveProject.ts";
import projects_deleteProject from "./projects/deleteProject.ts";
import projects_undeleteProject from "./projects/undeleteProject.ts";
import iam_projectsGetIamPolicy from "./iam/projectsGetIamPolicy.ts";
import iam_projectsSetIamPolicy from "./iam/projectsSetIamPolicy.ts";
import iam_projectsTestIamPermissions from "./iam/projectsTestIamPermissions.ts";

export const blocks = {
  folders_getFolder: folders_getFolder,
  folders_listFolders: folders_listFolders,
  folders_searchFolders: folders_searchFolders,
  folders_createFolder: folders_createFolder,
  folders_updateFolder: folders_updateFolder,
  folders_moveFolder: folders_moveFolder,
  folders_deleteFolder: folders_deleteFolder,
  folders_undeleteFolder: folders_undeleteFolder,
  iam_foldersGetIamPolicy: iam_foldersGetIamPolicy,
  iam_foldersSetIamPolicy: iam_foldersSetIamPolicy,
  iam_foldersTestIamPermissions: iam_foldersTestIamPermissions,
  tag_bindings_listTagBindings: tag_bindings_listTagBindings,
  tag_bindings_createTagBinding: tag_bindings_createTagBinding,
  tag_bindings_deleteTagBinding: tag_bindings_deleteTagBinding,
  tag_bindings_listEffectiveTags: tag_bindings_listEffectiveTags,
  tag_holds_createTagHold: tag_holds_createTagHold,
  tag_holds_deleteTagHold: tag_holds_deleteTagHold,
  tag_holds_listTagHolds: tag_holds_listTagHolds,
  tag_values_listTagValues: tag_values_listTagValues,
  tag_values_getTagValue: tag_values_getTagValue,
  tag_values_getNamespacedTagValue: tag_values_getNamespacedTagValue,
  tag_values_createTagValue: tag_values_createTagValue,
  tag_values_updateTagValue: tag_values_updateTagValue,
  tag_values_deleteTagValue: tag_values_deleteTagValue,
  iam_tagValuesGetIamPolicy: iam_tagValuesGetIamPolicy,
  iam_tagValuesSetIamPolicy: iam_tagValuesSetIamPolicy,
  iam_tagValuesTestIamPermissions: iam_tagValuesTestIamPermissions,
  tag_keys_listTagKeys: tag_keys_listTagKeys,
  tag_keys_getTagKey: tag_keys_getTagKey,
  tag_keys_getNamespacedTagKey: tag_keys_getNamespacedTagKey,
  tag_keys_createTagKey: tag_keys_createTagKey,
  tag_keys_updateTagKey: tag_keys_updateTagKey,
  tag_keys_deleteTagKey: tag_keys_deleteTagKey,
  iam_tagKeysGetIamPolicy: iam_tagKeysGetIamPolicy,
  iam_tagKeysSetIamPolicy: iam_tagKeysSetIamPolicy,
  iam_tagKeysTestIamPermissions: iam_tagKeysTestIamPermissions,
  organizations_getOrganization: organizations_getOrganization,
  organizations_searchOrganizations: organizations_searchOrganizations,
  iam_organizationsGetIamPolicy: iam_organizationsGetIamPolicy,
  iam_organizationsSetIamPolicy: iam_organizationsSetIamPolicy,
  iam_organizationsTestIamPermissions: iam_organizationsTestIamPermissions,
  projects_getProject: projects_getProject,
  projects_listProjects: projects_listProjects,
  projects_searchProjects: projects_searchProjects,
  projects_createProject: projects_createProject,
  projects_updateProject: projects_updateProject,
  projects_moveProject: projects_moveProject,
  projects_deleteProject: projects_deleteProject,
  projects_undeleteProject: projects_undeleteProject,
  iam_projectsGetIamPolicy: iam_projectsGetIamPolicy,
  iam_projectsSetIamPolicy: iam_projectsSetIamPolicy,
  iam_projectsTestIamPermissions: iam_projectsTestIamPermissions,
};
