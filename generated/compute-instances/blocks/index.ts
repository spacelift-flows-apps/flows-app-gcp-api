import acceleratorTypesAggregatedList from "./accelerator_types/acceleratorTypesAggregatedList.ts";
import acceleratorTypesGet from "./accelerator_types/acceleratorTypesGet.ts";
import acceleratorTypesList from "./accelerator_types/acceleratorTypesList.ts";
import autoscalersAggregatedList from "./autoscalers/autoscalersAggregatedList.ts";
import autoscalersDelete from "./autoscalers/autoscalersDelete.ts";
import autoscalersGet from "./autoscalers/autoscalersGet.ts";
import autoscalersInsert from "./autoscalers/autoscalersInsert.ts";
import autoscalersList from "./autoscalers/autoscalersList.ts";
import autoscalersPatch from "./autoscalers/autoscalersPatch.ts";
import autoscalersUpdate from "./autoscalers/autoscalersUpdate.ts";
import instanceGroupManagerResizeRequestsCancel from "./instance_group_manager_resize_requests/instanceGroupManagerResizeRequestsCancel.ts";
import instanceGroupManagerResizeRequestsDelete from "./instance_group_manager_resize_requests/instanceGroupManagerResizeRequestsDelete.ts";
import instanceGroupManagerResizeRequestsGet from "./instance_group_manager_resize_requests/instanceGroupManagerResizeRequestsGet.ts";
import instanceGroupManagerResizeRequestsInsert from "./instance_group_manager_resize_requests/instanceGroupManagerResizeRequestsInsert.ts";
import instanceGroupManagerResizeRequestsList from "./instance_group_manager_resize_requests/instanceGroupManagerResizeRequestsList.ts";
import instanceGroupManagersAbandonInstances from "./instance_group_managers/instanceGroupManagersAbandonInstances.ts";
import instanceGroupManagersAggregatedList from "./instance_group_managers/instanceGroupManagersAggregatedList.ts";
import instanceGroupManagersApplyUpdatesToInstances from "./instance_group_managers/instanceGroupManagersApplyUpdatesToInstances.ts";
import instanceGroupManagersCreateInstances from "./instance_group_managers/instanceGroupManagersCreateInstances.ts";
import instanceGroupManagersDelete from "./instance_group_managers/instanceGroupManagersDelete.ts";
import instanceGroupManagersDeleteInstances from "./instance_group_managers/instanceGroupManagersDeleteInstances.ts";
import instanceGroupManagersDeletePerInstanceConfigs from "./instance_group_managers/instanceGroupManagersDeletePerInstanceConfigs.ts";
import instanceGroupManagersGet from "./instance_group_managers/instanceGroupManagersGet.ts";
import instanceGroupManagersInsert from "./instance_group_managers/instanceGroupManagersInsert.ts";
import instanceGroupManagersList from "./instance_group_managers/instanceGroupManagersList.ts";
import instanceGroupManagersListErrors from "./instance_group_managers/instanceGroupManagersListErrors.ts";
import instanceGroupManagersListManagedInstances from "./instance_group_managers/instanceGroupManagersListManagedInstances.ts";
import instanceGroupManagersListPerInstanceConfigs from "./instance_group_managers/instanceGroupManagersListPerInstanceConfigs.ts";
import instanceGroupManagersPatch from "./instance_group_managers/instanceGroupManagersPatch.ts";
import instanceGroupManagersPatchPerInstanceConfigs from "./instance_group_managers/instanceGroupManagersPatchPerInstanceConfigs.ts";
import instanceGroupManagersRecreateInstances from "./instance_group_managers/instanceGroupManagersRecreateInstances.ts";
import instanceGroupManagersResize from "./instance_group_managers/instanceGroupManagersResize.ts";
import instanceGroupManagersResumeInstances from "./instance_group_managers/instanceGroupManagersResumeInstances.ts";
import instanceGroupManagersSetInstanceTemplate from "./instance_group_managers/instanceGroupManagersSetInstanceTemplate.ts";
import instanceGroupManagersSetTargetPools from "./instance_group_managers/instanceGroupManagersSetTargetPools.ts";
import instanceGroupManagersStartInstances from "./instance_group_managers/instanceGroupManagersStartInstances.ts";
import instanceGroupManagersStopInstances from "./instance_group_managers/instanceGroupManagersStopInstances.ts";
import instanceGroupManagersSuspendInstances from "./instance_group_managers/instanceGroupManagersSuspendInstances.ts";
import instanceGroupManagersUpdatePerInstanceConfigs from "./instance_group_managers/instanceGroupManagersUpdatePerInstanceConfigs.ts";
import instanceGroupsAddInstances from "./instance_groups/instanceGroupsAddInstances.ts";
import instanceGroupsAggregatedList from "./instance_groups/instanceGroupsAggregatedList.ts";
import instanceGroupsDelete from "./instance_groups/instanceGroupsDelete.ts";
import instanceGroupsGet from "./instance_groups/instanceGroupsGet.ts";
import instanceGroupsInsert from "./instance_groups/instanceGroupsInsert.ts";
import instanceGroupsList from "./instance_groups/instanceGroupsList.ts";
import instanceGroupsListInstances from "./instance_groups/instanceGroupsListInstances.ts";
import instanceGroupsRemoveInstances from "./instance_groups/instanceGroupsRemoveInstances.ts";
import instanceGroupsSetNamedPorts from "./instance_groups/instanceGroupsSetNamedPorts.ts";
import instanceSettingsServiceGet from "./instance_settings_service/instanceSettingsServiceGet.ts";
import instanceSettingsServicePatch from "./instance_settings_service/instanceSettingsServicePatch.ts";
import instanceTemplatesAggregatedList from "./instance_templates/instanceTemplatesAggregatedList.ts";
import instanceTemplatesDelete from "./instance_templates/instanceTemplatesDelete.ts";
import instanceTemplatesGet from "./instance_templates/instanceTemplatesGet.ts";
import instanceTemplatesInsert from "./instance_templates/instanceTemplatesInsert.ts";
import instanceTemplatesList from "./instance_templates/instanceTemplatesList.ts";
import instancesAddAccessConfig from "./instances/instancesAddAccessConfig.ts";
import instancesAddNetworkInterface from "./instances/instancesAddNetworkInterface.ts";
import instancesAddResourcePolicies from "./instances/instancesAddResourcePolicies.ts";
import instancesAggregatedList from "./instances/instancesAggregatedList.ts";
import instancesAttachDisk from "./instances/instancesAttachDisk.ts";
import instancesBulkInsert from "./instances/instancesBulkInsert.ts";
import instancesDelete from "./instances/instancesDelete.ts";
import instancesDeleteAccessConfig from "./instances/instancesDeleteAccessConfig.ts";
import instancesDeleteNetworkInterface from "./instances/instancesDeleteNetworkInterface.ts";
import instancesDetachDisk from "./instances/instancesDetachDisk.ts";
import instancesGet from "./instances/instancesGet.ts";
import instancesGetEffectiveFirewalls from "./instances/instancesGetEffectiveFirewalls.ts";
import instancesGetGuestAttributes from "./instances/instancesGetGuestAttributes.ts";
import instancesGetScreenshot from "./instances/instancesGetScreenshot.ts";
import instancesGetSerialPortOutput from "./instances/instancesGetSerialPortOutput.ts";
import instancesGetShieldedInstanceIdentity from "./instances/instancesGetShieldedInstanceIdentity.ts";
import instancesInsert from "./instances/instancesInsert.ts";
import instancesList from "./instances/instancesList.ts";
import instancesListReferrers from "./instances/instancesListReferrers.ts";
import instancesPerformMaintenance from "./instances/instancesPerformMaintenance.ts";
import instancesRemoveResourcePolicies from "./instances/instancesRemoveResourcePolicies.ts";
import instancesReportHostAsFaulty from "./instances/instancesReportHostAsFaulty.ts";
import instancesReset from "./instances/instancesReset.ts";
import instancesResume from "./instances/instancesResume.ts";
import instancesSendDiagnosticInterrupt from "./instances/instancesSendDiagnosticInterrupt.ts";
import instancesSetDeletionProtection from "./instances/instancesSetDeletionProtection.ts";
import instancesSetDiskAutoDelete from "./instances/instancesSetDiskAutoDelete.ts";
import instancesSetLabels from "./instances/instancesSetLabels.ts";
import instancesSetMachineResources from "./instances/instancesSetMachineResources.ts";
import instancesSetMachineType from "./instances/instancesSetMachineType.ts";
import instancesSetMetadata from "./instances/instancesSetMetadata.ts";
import instancesSetMinCpuPlatform from "./instances/instancesSetMinCpuPlatform.ts";
import instancesSetName from "./instances/instancesSetName.ts";
import instancesSetScheduling from "./instances/instancesSetScheduling.ts";
import instancesSetSecurityPolicy from "./instances/instancesSetSecurityPolicy.ts";
import instancesSetServiceAccount from "./instances/instancesSetServiceAccount.ts";
import instancesSetShieldedInstanceIntegrityPolicy from "./instances/instancesSetShieldedInstanceIntegrityPolicy.ts";
import instancesSetTags from "./instances/instancesSetTags.ts";
import instancesSimulateMaintenanceEvent from "./instances/instancesSimulateMaintenanceEvent.ts";
import instancesStart from "./instances/instancesStart.ts";
import instancesStartWithEncryptionKey from "./instances/instancesStartWithEncryptionKey.ts";
import instancesStop from "./instances/instancesStop.ts";
import instancesSuspend from "./instances/instancesSuspend.ts";
import instancesUpdate from "./instances/instancesUpdate.ts";
import instancesUpdateAccessConfig from "./instances/instancesUpdateAccessConfig.ts";
import instancesUpdateDisplayDevice from "./instances/instancesUpdateDisplayDevice.ts";
import instancesUpdateNetworkInterface from "./instances/instancesUpdateNetworkInterface.ts";
import instancesUpdateShieldedInstanceConfig from "./instances/instancesUpdateShieldedInstanceConfig.ts";
import machineImagesDelete from "./machine_images/machineImagesDelete.ts";
import machineImagesGet from "./machine_images/machineImagesGet.ts";
import machineImagesInsert from "./machine_images/machineImagesInsert.ts";
import machineImagesList from "./machine_images/machineImagesList.ts";
import machineImagesSetLabels from "./machine_images/machineImagesSetLabels.ts";
import machineTypesAggregatedList from "./machine_types/machineTypesAggregatedList.ts";
import machineTypesGet from "./machine_types/machineTypesGet.ts";
import machineTypesList from "./machine_types/machineTypesList.ts";
import regionAutoscalersDelete from "./region_autoscalers/regionAutoscalersDelete.ts";
import regionAutoscalersGet from "./region_autoscalers/regionAutoscalersGet.ts";
import regionAutoscalersInsert from "./region_autoscalers/regionAutoscalersInsert.ts";
import regionAutoscalersList from "./region_autoscalers/regionAutoscalersList.ts";
import regionAutoscalersPatch from "./region_autoscalers/regionAutoscalersPatch.ts";
import regionAutoscalersUpdate from "./region_autoscalers/regionAutoscalersUpdate.ts";
import regionInstanceGroupManagersAbandonInstances from "./region_instance_group_managers/regionInstanceGroupManagersAbandonInstances.ts";
import regionInstanceGroupManagersApplyUpdatesToInstances from "./region_instance_group_managers/regionInstanceGroupManagersApplyUpdatesToInstances.ts";
import regionInstanceGroupManagersCreateInstances from "./region_instance_group_managers/regionInstanceGroupManagersCreateInstances.ts";
import regionInstanceGroupManagersDelete from "./region_instance_group_managers/regionInstanceGroupManagersDelete.ts";
import regionInstanceGroupManagersDeleteInstances from "./region_instance_group_managers/regionInstanceGroupManagersDeleteInstances.ts";
import regionInstanceGroupManagersDeletePerInstanceConfigs from "./region_instance_group_managers/regionInstanceGroupManagersDeletePerInstanceConfigs.ts";
import regionInstanceGroupManagersGet from "./region_instance_group_managers/regionInstanceGroupManagersGet.ts";
import regionInstanceGroupManagersInsert from "./region_instance_group_managers/regionInstanceGroupManagersInsert.ts";
import regionInstanceGroupManagersList from "./region_instance_group_managers/regionInstanceGroupManagersList.ts";
import regionInstanceGroupManagersListErrors from "./region_instance_group_managers/regionInstanceGroupManagersListErrors.ts";
import regionInstanceGroupManagersListManagedInstances from "./region_instance_group_managers/regionInstanceGroupManagersListManagedInstances.ts";
import regionInstanceGroupManagersListPerInstanceConfigs from "./region_instance_group_managers/regionInstanceGroupManagersListPerInstanceConfigs.ts";
import regionInstanceGroupManagersPatch from "./region_instance_group_managers/regionInstanceGroupManagersPatch.ts";
import regionInstanceGroupManagersPatchPerInstanceConfigs from "./region_instance_group_managers/regionInstanceGroupManagersPatchPerInstanceConfigs.ts";
import regionInstanceGroupManagersRecreateInstances from "./region_instance_group_managers/regionInstanceGroupManagersRecreateInstances.ts";
import regionInstanceGroupManagersResize from "./region_instance_group_managers/regionInstanceGroupManagersResize.ts";
import regionInstanceGroupManagersResumeInstances from "./region_instance_group_managers/regionInstanceGroupManagersResumeInstances.ts";
import regionInstanceGroupManagersSetInstanceTemplate from "./region_instance_group_managers/regionInstanceGroupManagersSetInstanceTemplate.ts";
import regionInstanceGroupManagersSetTargetPools from "./region_instance_group_managers/regionInstanceGroupManagersSetTargetPools.ts";
import regionInstanceGroupManagersStartInstances from "./region_instance_group_managers/regionInstanceGroupManagersStartInstances.ts";
import regionInstanceGroupManagersStopInstances from "./region_instance_group_managers/regionInstanceGroupManagersStopInstances.ts";
import regionInstanceGroupManagersSuspendInstances from "./region_instance_group_managers/regionInstanceGroupManagersSuspendInstances.ts";
import regionInstanceGroupManagersUpdatePerInstanceConfigs from "./region_instance_group_managers/regionInstanceGroupManagersUpdatePerInstanceConfigs.ts";
import regionInstanceGroupsGet from "./region_instance_groups/regionInstanceGroupsGet.ts";
import regionInstanceGroupsList from "./region_instance_groups/regionInstanceGroupsList.ts";
import regionInstanceGroupsListInstances from "./region_instance_groups/regionInstanceGroupsListInstances.ts";
import regionInstanceGroupsSetNamedPorts from "./region_instance_groups/regionInstanceGroupsSetNamedPorts.ts";
import regionInstanceTemplatesDelete from "./region_instance_templates/regionInstanceTemplatesDelete.ts";
import regionInstanceTemplatesGet from "./region_instance_templates/regionInstanceTemplatesGet.ts";
import regionInstanceTemplatesInsert from "./region_instance_templates/regionInstanceTemplatesInsert.ts";
import regionInstanceTemplatesList from "./region_instance_templates/regionInstanceTemplatesList.ts";
import regionInstancesBulkInsert from "./region_instances/regionInstancesBulkInsert.ts";
import zoneOperationsDelete from "./zone_operations/zoneOperationsDelete.ts";
import zoneOperationsGet from "./zone_operations/zoneOperationsGet.ts";
import zoneOperationsList from "./zone_operations/zoneOperationsList.ts";
import zoneOperationsWait from "./zone_operations/zoneOperationsWait.ts";

export const blocks = {
  acceleratorTypesAggregatedList: acceleratorTypesAggregatedList,
  acceleratorTypesGet: acceleratorTypesGet,
  acceleratorTypesList: acceleratorTypesList,
  autoscalersAggregatedList: autoscalersAggregatedList,
  autoscalersDelete: autoscalersDelete,
  autoscalersGet: autoscalersGet,
  autoscalersInsert: autoscalersInsert,
  autoscalersList: autoscalersList,
  autoscalersPatch: autoscalersPatch,
  autoscalersUpdate: autoscalersUpdate,
  instanceGroupManagerResizeRequestsCancel:
    instanceGroupManagerResizeRequestsCancel,
  instanceGroupManagerResizeRequestsDelete:
    instanceGroupManagerResizeRequestsDelete,
  instanceGroupManagerResizeRequestsGet: instanceGroupManagerResizeRequestsGet,
  instanceGroupManagerResizeRequestsInsert:
    instanceGroupManagerResizeRequestsInsert,
  instanceGroupManagerResizeRequestsList:
    instanceGroupManagerResizeRequestsList,
  instanceGroupManagersAbandonInstances: instanceGroupManagersAbandonInstances,
  instanceGroupManagersAggregatedList: instanceGroupManagersAggregatedList,
  instanceGroupManagersApplyUpdatesToInstances:
    instanceGroupManagersApplyUpdatesToInstances,
  instanceGroupManagersCreateInstances: instanceGroupManagersCreateInstances,
  instanceGroupManagersDelete: instanceGroupManagersDelete,
  instanceGroupManagersDeleteInstances: instanceGroupManagersDeleteInstances,
  instanceGroupManagersDeletePerInstanceConfigs:
    instanceGroupManagersDeletePerInstanceConfigs,
  instanceGroupManagersGet: instanceGroupManagersGet,
  instanceGroupManagersInsert: instanceGroupManagersInsert,
  instanceGroupManagersList: instanceGroupManagersList,
  instanceGroupManagersListErrors: instanceGroupManagersListErrors,
  instanceGroupManagersListManagedInstances:
    instanceGroupManagersListManagedInstances,
  instanceGroupManagersListPerInstanceConfigs:
    instanceGroupManagersListPerInstanceConfigs,
  instanceGroupManagersPatch: instanceGroupManagersPatch,
  instanceGroupManagersPatchPerInstanceConfigs:
    instanceGroupManagersPatchPerInstanceConfigs,
  instanceGroupManagersRecreateInstances:
    instanceGroupManagersRecreateInstances,
  instanceGroupManagersResize: instanceGroupManagersResize,
  instanceGroupManagersResumeInstances: instanceGroupManagersResumeInstances,
  instanceGroupManagersSetInstanceTemplate:
    instanceGroupManagersSetInstanceTemplate,
  instanceGroupManagersSetTargetPools: instanceGroupManagersSetTargetPools,
  instanceGroupManagersStartInstances: instanceGroupManagersStartInstances,
  instanceGroupManagersStopInstances: instanceGroupManagersStopInstances,
  instanceGroupManagersSuspendInstances: instanceGroupManagersSuspendInstances,
  instanceGroupManagersUpdatePerInstanceConfigs:
    instanceGroupManagersUpdatePerInstanceConfigs,
  instanceGroupsAddInstances: instanceGroupsAddInstances,
  instanceGroupsAggregatedList: instanceGroupsAggregatedList,
  instanceGroupsDelete: instanceGroupsDelete,
  instanceGroupsGet: instanceGroupsGet,
  instanceGroupsInsert: instanceGroupsInsert,
  instanceGroupsList: instanceGroupsList,
  instanceGroupsListInstances: instanceGroupsListInstances,
  instanceGroupsRemoveInstances: instanceGroupsRemoveInstances,
  instanceGroupsSetNamedPorts: instanceGroupsSetNamedPorts,
  instanceSettingsServiceGet: instanceSettingsServiceGet,
  instanceSettingsServicePatch: instanceSettingsServicePatch,
  instanceTemplatesAggregatedList: instanceTemplatesAggregatedList,
  instanceTemplatesDelete: instanceTemplatesDelete,
  instanceTemplatesGet: instanceTemplatesGet,
  instanceTemplatesInsert: instanceTemplatesInsert,
  instanceTemplatesList: instanceTemplatesList,
  instancesAddAccessConfig: instancesAddAccessConfig,
  instancesAddNetworkInterface: instancesAddNetworkInterface,
  instancesAddResourcePolicies: instancesAddResourcePolicies,
  instancesAggregatedList: instancesAggregatedList,
  instancesAttachDisk: instancesAttachDisk,
  instancesBulkInsert: instancesBulkInsert,
  instancesDelete: instancesDelete,
  instancesDeleteAccessConfig: instancesDeleteAccessConfig,
  instancesDeleteNetworkInterface: instancesDeleteNetworkInterface,
  instancesDetachDisk: instancesDetachDisk,
  instancesGet: instancesGet,
  instancesGetEffectiveFirewalls: instancesGetEffectiveFirewalls,
  instancesGetGuestAttributes: instancesGetGuestAttributes,
  instancesGetScreenshot: instancesGetScreenshot,
  instancesGetSerialPortOutput: instancesGetSerialPortOutput,
  instancesGetShieldedInstanceIdentity: instancesGetShieldedInstanceIdentity,
  instancesInsert: instancesInsert,
  instancesList: instancesList,
  instancesListReferrers: instancesListReferrers,
  instancesPerformMaintenance: instancesPerformMaintenance,
  instancesRemoveResourcePolicies: instancesRemoveResourcePolicies,
  instancesReportHostAsFaulty: instancesReportHostAsFaulty,
  instancesReset: instancesReset,
  instancesResume: instancesResume,
  instancesSendDiagnosticInterrupt: instancesSendDiagnosticInterrupt,
  instancesSetDeletionProtection: instancesSetDeletionProtection,
  instancesSetDiskAutoDelete: instancesSetDiskAutoDelete,
  instancesSetLabels: instancesSetLabels,
  instancesSetMachineResources: instancesSetMachineResources,
  instancesSetMachineType: instancesSetMachineType,
  instancesSetMetadata: instancesSetMetadata,
  instancesSetMinCpuPlatform: instancesSetMinCpuPlatform,
  instancesSetName: instancesSetName,
  instancesSetScheduling: instancesSetScheduling,
  instancesSetSecurityPolicy: instancesSetSecurityPolicy,
  instancesSetServiceAccount: instancesSetServiceAccount,
  instancesSetShieldedInstanceIntegrityPolicy:
    instancesSetShieldedInstanceIntegrityPolicy,
  instancesSetTags: instancesSetTags,
  instancesSimulateMaintenanceEvent: instancesSimulateMaintenanceEvent,
  instancesStart: instancesStart,
  instancesStartWithEncryptionKey: instancesStartWithEncryptionKey,
  instancesStop: instancesStop,
  instancesSuspend: instancesSuspend,
  instancesUpdate: instancesUpdate,
  instancesUpdateAccessConfig: instancesUpdateAccessConfig,
  instancesUpdateDisplayDevice: instancesUpdateDisplayDevice,
  instancesUpdateNetworkInterface: instancesUpdateNetworkInterface,
  instancesUpdateShieldedInstanceConfig: instancesUpdateShieldedInstanceConfig,
  machineImagesDelete: machineImagesDelete,
  machineImagesGet: machineImagesGet,
  machineImagesInsert: machineImagesInsert,
  machineImagesList: machineImagesList,
  machineImagesSetLabels: machineImagesSetLabels,
  machineTypesAggregatedList: machineTypesAggregatedList,
  machineTypesGet: machineTypesGet,
  machineTypesList: machineTypesList,
  regionAutoscalersDelete: regionAutoscalersDelete,
  regionAutoscalersGet: regionAutoscalersGet,
  regionAutoscalersInsert: regionAutoscalersInsert,
  regionAutoscalersList: regionAutoscalersList,
  regionAutoscalersPatch: regionAutoscalersPatch,
  regionAutoscalersUpdate: regionAutoscalersUpdate,
  regionInstanceGroupManagersAbandonInstances:
    regionInstanceGroupManagersAbandonInstances,
  regionInstanceGroupManagersApplyUpdatesToInstances:
    regionInstanceGroupManagersApplyUpdatesToInstances,
  regionInstanceGroupManagersCreateInstances:
    regionInstanceGroupManagersCreateInstances,
  regionInstanceGroupManagersDelete: regionInstanceGroupManagersDelete,
  regionInstanceGroupManagersDeleteInstances:
    regionInstanceGroupManagersDeleteInstances,
  regionInstanceGroupManagersDeletePerInstanceConfigs:
    regionInstanceGroupManagersDeletePerInstanceConfigs,
  regionInstanceGroupManagersGet: regionInstanceGroupManagersGet,
  regionInstanceGroupManagersInsert: regionInstanceGroupManagersInsert,
  regionInstanceGroupManagersList: regionInstanceGroupManagersList,
  regionInstanceGroupManagersListErrors: regionInstanceGroupManagersListErrors,
  regionInstanceGroupManagersListManagedInstances:
    regionInstanceGroupManagersListManagedInstances,
  regionInstanceGroupManagersListPerInstanceConfigs:
    regionInstanceGroupManagersListPerInstanceConfigs,
  regionInstanceGroupManagersPatch: regionInstanceGroupManagersPatch,
  regionInstanceGroupManagersPatchPerInstanceConfigs:
    regionInstanceGroupManagersPatchPerInstanceConfigs,
  regionInstanceGroupManagersRecreateInstances:
    regionInstanceGroupManagersRecreateInstances,
  regionInstanceGroupManagersResize: regionInstanceGroupManagersResize,
  regionInstanceGroupManagersResumeInstances:
    regionInstanceGroupManagersResumeInstances,
  regionInstanceGroupManagersSetInstanceTemplate:
    regionInstanceGroupManagersSetInstanceTemplate,
  regionInstanceGroupManagersSetTargetPools:
    regionInstanceGroupManagersSetTargetPools,
  regionInstanceGroupManagersStartInstances:
    regionInstanceGroupManagersStartInstances,
  regionInstanceGroupManagersStopInstances:
    regionInstanceGroupManagersStopInstances,
  regionInstanceGroupManagersSuspendInstances:
    regionInstanceGroupManagersSuspendInstances,
  regionInstanceGroupManagersUpdatePerInstanceConfigs:
    regionInstanceGroupManagersUpdatePerInstanceConfigs,
  regionInstanceGroupsGet: regionInstanceGroupsGet,
  regionInstanceGroupsList: regionInstanceGroupsList,
  regionInstanceGroupsListInstances: regionInstanceGroupsListInstances,
  regionInstanceGroupsSetNamedPorts: regionInstanceGroupsSetNamedPorts,
  regionInstanceTemplatesDelete: regionInstanceTemplatesDelete,
  regionInstanceTemplatesGet: regionInstanceTemplatesGet,
  regionInstanceTemplatesInsert: regionInstanceTemplatesInsert,
  regionInstanceTemplatesList: regionInstanceTemplatesList,
  regionInstancesBulkInsert: regionInstancesBulkInsert,
  zoneOperationsDelete: zoneOperationsDelete,
  zoneOperationsGet: zoneOperationsGet,
  zoneOperationsList: zoneOperationsList,
  zoneOperationsWait: zoneOperationsWait,
};
