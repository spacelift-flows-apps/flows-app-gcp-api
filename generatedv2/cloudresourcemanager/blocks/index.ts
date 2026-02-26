import folders_getFolder from "./folders/getFolder.ts";
import folders_listFolders from "./folders/listFolders.ts";
import folders_searchFolders from "./folders/searchFolders.ts";
import folders_createFolder from "./folders/createFolder.ts";
import folders_updateFolder from "./folders/updateFolder.ts";
import folders_moveFolder from "./folders/moveFolder.ts";
import folders_deleteFolder from "./folders/deleteFolder.ts";
import folders_undeleteFolder from "./folders/undeleteFolder.ts";
import organizations_getOrganization from "./organizations/getOrganization.ts";
import organizations_searchOrganizations from "./organizations/searchOrganizations.ts";
import projects_getProject from "./projects/getProject.ts";
import projects_listProjects from "./projects/listProjects.ts";
import projects_searchProjects from "./projects/searchProjects.ts";
import projects_createProject from "./projects/createProject.ts";
import projects_updateProject from "./projects/updateProject.ts";
import projects_moveProject from "./projects/moveProject.ts";
import projects_deleteProject from "./projects/deleteProject.ts";
import projects_undeleteProject from "./projects/undeleteProject.ts";
import tag_bindings_listTagBindings from "./tag_bindings/listTagBindings.ts";
import tag_bindings_createTagBinding from "./tag_bindings/createTagBinding.ts";
import tag_bindings_deleteTagBinding from "./tag_bindings/deleteTagBinding.ts";
import tag_bindings_listEffectiveTags from "./tag_bindings/listEffectiveTags.ts";
import tag_keys_listTagKeys from "./tag_keys/listTagKeys.ts";
import tag_keys_getTagKey from "./tag_keys/getTagKey.ts";
import tag_keys_getNamespacedTagKey from "./tag_keys/getNamespacedTagKey.ts";
import tag_keys_createTagKey from "./tag_keys/createTagKey.ts";
import tag_keys_updateTagKey from "./tag_keys/updateTagKey.ts";
import tag_keys_deleteTagKey from "./tag_keys/deleteTagKey.ts";
import tag_values_listTagValues from "./tag_values/listTagValues.ts";
import tag_values_getTagValue from "./tag_values/getTagValue.ts";
import tag_values_getNamespacedTagValue from "./tag_values/getNamespacedTagValue.ts";
import tag_values_createTagValue from "./tag_values/createTagValue.ts";
import tag_values_updateTagValue from "./tag_values/updateTagValue.ts";
import tag_values_deleteTagValue from "./tag_values/deleteTagValue.ts";
import tag_holds_createTagHold from "./tag_holds/createTagHold.ts";
import tag_holds_deleteTagHold from "./tag_holds/deleteTagHold.ts";
import tag_holds_listTagHolds from "./tag_holds/listTagHolds.ts";

export const blocks = {
  folders_getFolder: folders_getFolder,
  folders_listFolders: folders_listFolders,
  folders_searchFolders: folders_searchFolders,
  folders_createFolder: folders_createFolder,
  folders_updateFolder: folders_updateFolder,
  folders_moveFolder: folders_moveFolder,
  folders_deleteFolder: folders_deleteFolder,
  folders_undeleteFolder: folders_undeleteFolder,
  organizations_getOrganization: organizations_getOrganization,
  organizations_searchOrganizations: organizations_searchOrganizations,
  projects_getProject: projects_getProject,
  projects_listProjects: projects_listProjects,
  projects_searchProjects: projects_searchProjects,
  projects_createProject: projects_createProject,
  projects_updateProject: projects_updateProject,
  projects_moveProject: projects_moveProject,
  projects_deleteProject: projects_deleteProject,
  projects_undeleteProject: projects_undeleteProject,
  tag_bindings_listTagBindings: tag_bindings_listTagBindings,
  tag_bindings_createTagBinding: tag_bindings_createTagBinding,
  tag_bindings_deleteTagBinding: tag_bindings_deleteTagBinding,
  tag_bindings_listEffectiveTags: tag_bindings_listEffectiveTags,
  tag_keys_listTagKeys: tag_keys_listTagKeys,
  tag_keys_getTagKey: tag_keys_getTagKey,
  tag_keys_getNamespacedTagKey: tag_keys_getNamespacedTagKey,
  tag_keys_createTagKey: tag_keys_createTagKey,
  tag_keys_updateTagKey: tag_keys_updateTagKey,
  tag_keys_deleteTagKey: tag_keys_deleteTagKey,
  tag_values_listTagValues: tag_values_listTagValues,
  tag_values_getTagValue: tag_values_getTagValue,
  tag_values_getNamespacedTagValue: tag_values_getNamespacedTagValue,
  tag_values_createTagValue: tag_values_createTagValue,
  tag_values_updateTagValue: tag_values_updateTagValue,
  tag_values_deleteTagValue: tag_values_deleteTagValue,
  tag_holds_createTagHold: tag_holds_createTagHold,
  tag_holds_deleteTagHold: tag_holds_deleteTagHold,
  tag_holds_listTagHolds: tag_holds_listTagHolds,
};
