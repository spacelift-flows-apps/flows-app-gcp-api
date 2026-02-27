import diskTypesAggregatedList from "./disk_types/diskTypesAggregatedList.ts";
import diskTypesGet from "./disk_types/diskTypesGet.ts";
import diskTypesList from "./disk_types/diskTypesList.ts";
import disksAddResourcePolicies from "./disks/disksAddResourcePolicies.ts";
import disksAggregatedList from "./disks/disksAggregatedList.ts";
import disksBulkInsert from "./disks/disksBulkInsert.ts";
import disksBulkSetLabels from "./disks/disksBulkSetLabels.ts";
import disksCreateSnapshot from "./disks/disksCreateSnapshot.ts";
import disksDelete from "./disks/disksDelete.ts";
import disksGet from "./disks/disksGet.ts";
import disksInsert from "./disks/disksInsert.ts";
import disksList from "./disks/disksList.ts";
import disksRemoveResourcePolicies from "./disks/disksRemoveResourcePolicies.ts";
import disksResize from "./disks/disksResize.ts";
import disksSetLabels from "./disks/disksSetLabels.ts";
import disksStartAsyncReplication from "./disks/disksStartAsyncReplication.ts";
import disksStopAsyncReplication from "./disks/disksStopAsyncReplication.ts";
import disksStopGroupAsyncReplication from "./disks/disksStopGroupAsyncReplication.ts";
import disksUpdate from "./disks/disksUpdate.ts";
import imageFamilyViewsGet from "./image_family_views/imageFamilyViewsGet.ts";
import imagesDelete from "./images/imagesDelete.ts";
import imagesDeprecate from "./images/imagesDeprecate.ts";
import imagesGet from "./images/imagesGet.ts";
import imagesGetFromFamily from "./images/imagesGetFromFamily.ts";
import imagesInsert from "./images/imagesInsert.ts";
import imagesList from "./images/imagesList.ts";
import imagesPatch from "./images/imagesPatch.ts";
import imagesSetLabels from "./images/imagesSetLabels.ts";
import instantSnapshotsAggregatedList from "./instant_snapshots/instantSnapshotsAggregatedList.ts";
import instantSnapshotsDelete from "./instant_snapshots/instantSnapshotsDelete.ts";
import instantSnapshotsGet from "./instant_snapshots/instantSnapshotsGet.ts";
import instantSnapshotsInsert from "./instant_snapshots/instantSnapshotsInsert.ts";
import instantSnapshotsList from "./instant_snapshots/instantSnapshotsList.ts";
import instantSnapshotsSetLabels from "./instant_snapshots/instantSnapshotsSetLabels.ts";
import regionDiskTypesGet from "./region_disk_types/regionDiskTypesGet.ts";
import regionDiskTypesList from "./region_disk_types/regionDiskTypesList.ts";
import regionDisksAddResourcePolicies from "./region_disks/regionDisksAddResourcePolicies.ts";
import regionDisksBulkInsert from "./region_disks/regionDisksBulkInsert.ts";
import regionDisksCreateSnapshot from "./region_disks/regionDisksCreateSnapshot.ts";
import regionDisksDelete from "./region_disks/regionDisksDelete.ts";
import regionDisksGet from "./region_disks/regionDisksGet.ts";
import regionDisksInsert from "./region_disks/regionDisksInsert.ts";
import regionDisksList from "./region_disks/regionDisksList.ts";
import regionDisksRemoveResourcePolicies from "./region_disks/regionDisksRemoveResourcePolicies.ts";
import regionDisksResize from "./region_disks/regionDisksResize.ts";
import regionDisksSetLabels from "./region_disks/regionDisksSetLabels.ts";
import regionDisksStartAsyncReplication from "./region_disks/regionDisksStartAsyncReplication.ts";
import regionDisksStopAsyncReplication from "./region_disks/regionDisksStopAsyncReplication.ts";
import regionDisksStopGroupAsyncReplication from "./region_disks/regionDisksStopGroupAsyncReplication.ts";
import regionDisksUpdate from "./region_disks/regionDisksUpdate.ts";
import regionInstantSnapshotsDelete from "./region_instant_snapshots/regionInstantSnapshotsDelete.ts";
import regionInstantSnapshotsGet from "./region_instant_snapshots/regionInstantSnapshotsGet.ts";
import regionInstantSnapshotsInsert from "./region_instant_snapshots/regionInstantSnapshotsInsert.ts";
import regionInstantSnapshotsList from "./region_instant_snapshots/regionInstantSnapshotsList.ts";
import regionInstantSnapshotsSetLabels from "./region_instant_snapshots/regionInstantSnapshotsSetLabels.ts";
import resourcePoliciesAggregatedList from "./resource_policies/resourcePoliciesAggregatedList.ts";
import resourcePoliciesDelete from "./resource_policies/resourcePoliciesDelete.ts";
import resourcePoliciesGet from "./resource_policies/resourcePoliciesGet.ts";
import resourcePoliciesInsert from "./resource_policies/resourcePoliciesInsert.ts";
import resourcePoliciesList from "./resource_policies/resourcePoliciesList.ts";
import resourcePoliciesPatch from "./resource_policies/resourcePoliciesPatch.ts";
import snapshotSettingsServiceGet from "./snapshot_settings_service/snapshotSettingsServiceGet.ts";
import snapshotSettingsServicePatch from "./snapshot_settings_service/snapshotSettingsServicePatch.ts";
import snapshotsDelete from "./snapshots/snapshotsDelete.ts";
import snapshotsGet from "./snapshots/snapshotsGet.ts";
import snapshotsInsert from "./snapshots/snapshotsInsert.ts";
import snapshotsList from "./snapshots/snapshotsList.ts";
import snapshotsSetLabels from "./snapshots/snapshotsSetLabels.ts";
import storagePoolTypesAggregatedList from "./storage_pool_types/storagePoolTypesAggregatedList.ts";
import storagePoolTypesGet from "./storage_pool_types/storagePoolTypesGet.ts";
import storagePoolTypesList from "./storage_pool_types/storagePoolTypesList.ts";
import storagePoolsAggregatedList from "./storage_pools/storagePoolsAggregatedList.ts";
import storagePoolsDelete from "./storage_pools/storagePoolsDelete.ts";
import storagePoolsGet from "./storage_pools/storagePoolsGet.ts";
import storagePoolsInsert from "./storage_pools/storagePoolsInsert.ts";
import storagePoolsList from "./storage_pools/storagePoolsList.ts";
import storagePoolsListDisks from "./storage_pools/storagePoolsListDisks.ts";
import storagePoolsUpdate from "./storage_pools/storagePoolsUpdate.ts";

export const blocks = {
  diskTypesAggregatedList: diskTypesAggregatedList,
  diskTypesGet: diskTypesGet,
  diskTypesList: diskTypesList,
  disksAddResourcePolicies: disksAddResourcePolicies,
  disksAggregatedList: disksAggregatedList,
  disksBulkInsert: disksBulkInsert,
  disksBulkSetLabels: disksBulkSetLabels,
  disksCreateSnapshot: disksCreateSnapshot,
  disksDelete: disksDelete,
  disksGet: disksGet,
  disksInsert: disksInsert,
  disksList: disksList,
  disksRemoveResourcePolicies: disksRemoveResourcePolicies,
  disksResize: disksResize,
  disksSetLabels: disksSetLabels,
  disksStartAsyncReplication: disksStartAsyncReplication,
  disksStopAsyncReplication: disksStopAsyncReplication,
  disksStopGroupAsyncReplication: disksStopGroupAsyncReplication,
  disksUpdate: disksUpdate,
  imageFamilyViewsGet: imageFamilyViewsGet,
  imagesDelete: imagesDelete,
  imagesDeprecate: imagesDeprecate,
  imagesGet: imagesGet,
  imagesGetFromFamily: imagesGetFromFamily,
  imagesInsert: imagesInsert,
  imagesList: imagesList,
  imagesPatch: imagesPatch,
  imagesSetLabels: imagesSetLabels,
  instantSnapshotsAggregatedList: instantSnapshotsAggregatedList,
  instantSnapshotsDelete: instantSnapshotsDelete,
  instantSnapshotsGet: instantSnapshotsGet,
  instantSnapshotsInsert: instantSnapshotsInsert,
  instantSnapshotsList: instantSnapshotsList,
  instantSnapshotsSetLabels: instantSnapshotsSetLabels,
  regionDiskTypesGet: regionDiskTypesGet,
  regionDiskTypesList: regionDiskTypesList,
  regionDisksAddResourcePolicies: regionDisksAddResourcePolicies,
  regionDisksBulkInsert: regionDisksBulkInsert,
  regionDisksCreateSnapshot: regionDisksCreateSnapshot,
  regionDisksDelete: regionDisksDelete,
  regionDisksGet: regionDisksGet,
  regionDisksInsert: regionDisksInsert,
  regionDisksList: regionDisksList,
  regionDisksRemoveResourcePolicies: regionDisksRemoveResourcePolicies,
  regionDisksResize: regionDisksResize,
  regionDisksSetLabels: regionDisksSetLabels,
  regionDisksStartAsyncReplication: regionDisksStartAsyncReplication,
  regionDisksStopAsyncReplication: regionDisksStopAsyncReplication,
  regionDisksStopGroupAsyncReplication: regionDisksStopGroupAsyncReplication,
  regionDisksUpdate: regionDisksUpdate,
  regionInstantSnapshotsDelete: regionInstantSnapshotsDelete,
  regionInstantSnapshotsGet: regionInstantSnapshotsGet,
  regionInstantSnapshotsInsert: regionInstantSnapshotsInsert,
  regionInstantSnapshotsList: regionInstantSnapshotsList,
  regionInstantSnapshotsSetLabels: regionInstantSnapshotsSetLabels,
  resourcePoliciesAggregatedList: resourcePoliciesAggregatedList,
  resourcePoliciesDelete: resourcePoliciesDelete,
  resourcePoliciesGet: resourcePoliciesGet,
  resourcePoliciesInsert: resourcePoliciesInsert,
  resourcePoliciesList: resourcePoliciesList,
  resourcePoliciesPatch: resourcePoliciesPatch,
  snapshotSettingsServiceGet: snapshotSettingsServiceGet,
  snapshotSettingsServicePatch: snapshotSettingsServicePatch,
  snapshotsDelete: snapshotsDelete,
  snapshotsGet: snapshotsGet,
  snapshotsInsert: snapshotsInsert,
  snapshotsList: snapshotsList,
  snapshotsSetLabels: snapshotsSetLabels,
  storagePoolTypesAggregatedList: storagePoolTypesAggregatedList,
  storagePoolTypesGet: storagePoolTypesGet,
  storagePoolTypesList: storagePoolTypesList,
  storagePoolsAggregatedList: storagePoolsAggregatedList,
  storagePoolsDelete: storagePoolsDelete,
  storagePoolsGet: storagePoolsGet,
  storagePoolsInsert: storagePoolsInsert,
  storagePoolsList: storagePoolsList,
  storagePoolsListDisks: storagePoolsListDisks,
  storagePoolsUpdate: storagePoolsUpdate,
};
