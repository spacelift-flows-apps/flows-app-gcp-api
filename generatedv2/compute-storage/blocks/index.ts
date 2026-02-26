import disk_types_aggregatedList from "./disk_types/aggregatedList.ts";
import disk_types_get from "./disk_types/get.ts";
import disk_types_list from "./disk_types/list.ts";
import disks_addResourcePolicies from "./disks/addResourcePolicies.ts";
import disks_aggregatedList from "./disks/aggregatedList.ts";
import disks_bulkInsert from "./disks/bulkInsert.ts";
import disks_bulkSetLabels from "./disks/bulkSetLabels.ts";
import disks_createSnapshot from "./disks/createSnapshot.ts";
import disks_deleteOperation from "./disks/deleteOperation.ts";
import disks_get from "./disks/get.ts";
import disks_insert from "./disks/insert.ts";
import disks_list from "./disks/list.ts";
import disks_removeResourcePolicies from "./disks/removeResourcePolicies.ts";
import disks_resize from "./disks/resize.ts";
import disks_setLabels from "./disks/setLabels.ts";
import disks_startAsyncReplication from "./disks/startAsyncReplication.ts";
import disks_stopAsyncReplication from "./disks/stopAsyncReplication.ts";
import disks_stopGroupAsyncReplication from "./disks/stopGroupAsyncReplication.ts";
import disks_update from "./disks/update.ts";
import image_family_views_get from "./image_family_views/get.ts";
import images_deleteOperation from "./images/deleteOperation.ts";
import images_deprecate from "./images/deprecate.ts";
import images_get from "./images/get.ts";
import images_getFromFamily from "./images/getFromFamily.ts";
import images_insert from "./images/insert.ts";
import images_list from "./images/list.ts";
import images_patch from "./images/patch.ts";
import images_setLabels from "./images/setLabels.ts";
import instant_snapshots_aggregatedList from "./instant_snapshots/aggregatedList.ts";
import instant_snapshots_deleteOperation from "./instant_snapshots/deleteOperation.ts";
import instant_snapshots_get from "./instant_snapshots/get.ts";
import instant_snapshots_insert from "./instant_snapshots/insert.ts";
import instant_snapshots_list from "./instant_snapshots/list.ts";
import instant_snapshots_setLabels from "./instant_snapshots/setLabels.ts";
import region_disk_types_get from "./region_disk_types/get.ts";
import region_disk_types_list from "./region_disk_types/list.ts";
import region_disks_addResourcePolicies from "./region_disks/addResourcePolicies.ts";
import region_disks_bulkInsert from "./region_disks/bulkInsert.ts";
import region_disks_createSnapshot from "./region_disks/createSnapshot.ts";
import region_disks_deleteOperation from "./region_disks/deleteOperation.ts";
import region_disks_get from "./region_disks/get.ts";
import region_disks_insert from "./region_disks/insert.ts";
import region_disks_list from "./region_disks/list.ts";
import region_disks_removeResourcePolicies from "./region_disks/removeResourcePolicies.ts";
import region_disks_resize from "./region_disks/resize.ts";
import region_disks_setLabels from "./region_disks/setLabels.ts";
import region_disks_startAsyncReplication from "./region_disks/startAsyncReplication.ts";
import region_disks_stopAsyncReplication from "./region_disks/stopAsyncReplication.ts";
import region_disks_stopGroupAsyncReplication from "./region_disks/stopGroupAsyncReplication.ts";
import region_disks_update from "./region_disks/update.ts";
import region_instant_snapshots_deleteOperation from "./region_instant_snapshots/deleteOperation.ts";
import region_instant_snapshots_get from "./region_instant_snapshots/get.ts";
import region_instant_snapshots_insert from "./region_instant_snapshots/insert.ts";
import region_instant_snapshots_list from "./region_instant_snapshots/list.ts";
import region_instant_snapshots_setLabels from "./region_instant_snapshots/setLabels.ts";
import resource_policies_aggregatedList from "./resource_policies/aggregatedList.ts";
import resource_policies_deleteOperation from "./resource_policies/deleteOperation.ts";
import resource_policies_get from "./resource_policies/get.ts";
import resource_policies_insert from "./resource_policies/insert.ts";
import resource_policies_list from "./resource_policies/list.ts";
import resource_policies_patch from "./resource_policies/patch.ts";
import snapshot_settings_service_get from "./snapshot_settings_service/get.ts";
import snapshot_settings_service_patch from "./snapshot_settings_service/patch.ts";
import snapshots_deleteOperation from "./snapshots/deleteOperation.ts";
import snapshots_get from "./snapshots/get.ts";
import snapshots_insert from "./snapshots/insert.ts";
import snapshots_list from "./snapshots/list.ts";
import snapshots_setLabels from "./snapshots/setLabels.ts";
import storage_pool_types_aggregatedList from "./storage_pool_types/aggregatedList.ts";
import storage_pool_types_get from "./storage_pool_types/get.ts";
import storage_pool_types_list from "./storage_pool_types/list.ts";
import storage_pools_aggregatedList from "./storage_pools/aggregatedList.ts";
import storage_pools_deleteOperation from "./storage_pools/deleteOperation.ts";
import storage_pools_get from "./storage_pools/get.ts";
import storage_pools_insert from "./storage_pools/insert.ts";
import storage_pools_list from "./storage_pools/list.ts";
import storage_pools_listDisks from "./storage_pools/listDisks.ts";
import storage_pools_update from "./storage_pools/update.ts";

export const blocks = {
  disk_types_aggregatedList: disk_types_aggregatedList,
  disk_types_get: disk_types_get,
  disk_types_list: disk_types_list,
  disks_addResourcePolicies: disks_addResourcePolicies,
  disks_aggregatedList: disks_aggregatedList,
  disks_bulkInsert: disks_bulkInsert,
  disks_bulkSetLabels: disks_bulkSetLabels,
  disks_createSnapshot: disks_createSnapshot,
  disks_deleteOperation: disks_deleteOperation,
  disks_get: disks_get,
  disks_insert: disks_insert,
  disks_list: disks_list,
  disks_removeResourcePolicies: disks_removeResourcePolicies,
  disks_resize: disks_resize,
  disks_setLabels: disks_setLabels,
  disks_startAsyncReplication: disks_startAsyncReplication,
  disks_stopAsyncReplication: disks_stopAsyncReplication,
  disks_stopGroupAsyncReplication: disks_stopGroupAsyncReplication,
  disks_update: disks_update,
  image_family_views_get: image_family_views_get,
  images_deleteOperation: images_deleteOperation,
  images_deprecate: images_deprecate,
  images_get: images_get,
  images_getFromFamily: images_getFromFamily,
  images_insert: images_insert,
  images_list: images_list,
  images_patch: images_patch,
  images_setLabels: images_setLabels,
  instant_snapshots_aggregatedList: instant_snapshots_aggregatedList,
  instant_snapshots_deleteOperation: instant_snapshots_deleteOperation,
  instant_snapshots_get: instant_snapshots_get,
  instant_snapshots_insert: instant_snapshots_insert,
  instant_snapshots_list: instant_snapshots_list,
  instant_snapshots_setLabels: instant_snapshots_setLabels,
  region_disk_types_get: region_disk_types_get,
  region_disk_types_list: region_disk_types_list,
  region_disks_addResourcePolicies: region_disks_addResourcePolicies,
  region_disks_bulkInsert: region_disks_bulkInsert,
  region_disks_createSnapshot: region_disks_createSnapshot,
  region_disks_deleteOperation: region_disks_deleteOperation,
  region_disks_get: region_disks_get,
  region_disks_insert: region_disks_insert,
  region_disks_list: region_disks_list,
  region_disks_removeResourcePolicies: region_disks_removeResourcePolicies,
  region_disks_resize: region_disks_resize,
  region_disks_setLabels: region_disks_setLabels,
  region_disks_startAsyncReplication: region_disks_startAsyncReplication,
  region_disks_stopAsyncReplication: region_disks_stopAsyncReplication,
  region_disks_stopGroupAsyncReplication:
    region_disks_stopGroupAsyncReplication,
  region_disks_update: region_disks_update,
  region_instant_snapshots_deleteOperation:
    region_instant_snapshots_deleteOperation,
  region_instant_snapshots_get: region_instant_snapshots_get,
  region_instant_snapshots_insert: region_instant_snapshots_insert,
  region_instant_snapshots_list: region_instant_snapshots_list,
  region_instant_snapshots_setLabels: region_instant_snapshots_setLabels,
  resource_policies_aggregatedList: resource_policies_aggregatedList,
  resource_policies_deleteOperation: resource_policies_deleteOperation,
  resource_policies_get: resource_policies_get,
  resource_policies_insert: resource_policies_insert,
  resource_policies_list: resource_policies_list,
  resource_policies_patch: resource_policies_patch,
  snapshot_settings_service_get: snapshot_settings_service_get,
  snapshot_settings_service_patch: snapshot_settings_service_patch,
  snapshots_deleteOperation: snapshots_deleteOperation,
  snapshots_get: snapshots_get,
  snapshots_insert: snapshots_insert,
  snapshots_list: snapshots_list,
  snapshots_setLabels: snapshots_setLabels,
  storage_pool_types_aggregatedList: storage_pool_types_aggregatedList,
  storage_pool_types_get: storage_pool_types_get,
  storage_pool_types_list: storage_pool_types_list,
  storage_pools_aggregatedList: storage_pools_aggregatedList,
  storage_pools_deleteOperation: storage_pools_deleteOperation,
  storage_pools_get: storage_pools_get,
  storage_pools_insert: storage_pools_insert,
  storage_pools_list: storage_pools_list,
  storage_pools_listDisks: storage_pools_listDisks,
  storage_pools_update: storage_pools_update,
};
