import clusters_listClusters from "./clusters/listClusters.ts";
import clusters_getCluster from "./clusters/getCluster.ts";
import clusters_createCluster from "./clusters/createCluster.ts";
import clusters_updateCluster from "./clusters/updateCluster.ts";
import node_pools_updateNodePool from "./node_pools/updateNodePool.ts";
import node_pools_setNodePoolAutoscaling from "./node_pools/setNodePoolAutoscaling.ts";
import clusters_setLoggingService from "./clusters/setLoggingService.ts";
import clusters_setMonitoringService from "./clusters/setMonitoringService.ts";
import clusters_setAddonsConfig from "./clusters/setAddonsConfig.ts";
import clusters_setLocations from "./clusters/setLocations.ts";
import clusters_updateMaster from "./clusters/updateMaster.ts";
import clusters_setMasterAuth from "./clusters/setMasterAuth.ts";
import clusters_deleteCluster from "./clusters/deleteCluster.ts";
import clusters_listOperations from "./clusters/listOperations.ts";
import clusters_getOperation from "./clusters/getOperation.ts";
import clusters_cancelOperation from "./clusters/cancelOperation.ts";
import clusters_getServerConfig from "./clusters/getServerConfig.ts";
import clusters_getJSONWebKeys from "./clusters/getJSONWebKeys.ts";
import node_pools_listNodePools from "./node_pools/listNodePools.ts";
import node_pools_getNodePool from "./node_pools/getNodePool.ts";
import node_pools_createNodePool from "./node_pools/createNodePool.ts";
import node_pools_deleteNodePool from "./node_pools/deleteNodePool.ts";
import node_pools_completeNodePoolUpgrade from "./node_pools/completeNodePoolUpgrade.ts";
import node_pools_rollbackNodePoolUpgrade from "./node_pools/rollbackNodePoolUpgrade.ts";
import node_pools_setNodePoolManagement from "./node_pools/setNodePoolManagement.ts";
import clusters_setLabels from "./clusters/setLabels.ts";
import clusters_setLegacyAbac from "./clusters/setLegacyAbac.ts";
import clusters_startIPRotation from "./clusters/startIPRotation.ts";
import clusters_completeIPRotation from "./clusters/completeIPRotation.ts";
import node_pools_setNodePoolSize from "./node_pools/setNodePoolSize.ts";
import clusters_setNetworkPolicy from "./clusters/setNetworkPolicy.ts";
import clusters_setMaintenancePolicy from "./clusters/setMaintenancePolicy.ts";
import clusters_listUsableSubnetworks from "./clusters/listUsableSubnetworks.ts";
import clusters_checkAutopilotCompatibility from "./clusters/checkAutopilotCompatibility.ts";
import clusters_fetchClusterUpgradeInfo from "./clusters/fetchClusterUpgradeInfo.ts";
import node_pools_fetchNodePoolUpgradeInfo from "./node_pools/fetchNodePoolUpgradeInfo.ts";

export const blocks = {
  clusters_listClusters: clusters_listClusters,
  clusters_getCluster: clusters_getCluster,
  clusters_createCluster: clusters_createCluster,
  clusters_updateCluster: clusters_updateCluster,
  node_pools_updateNodePool: node_pools_updateNodePool,
  node_pools_setNodePoolAutoscaling: node_pools_setNodePoolAutoscaling,
  clusters_setLoggingService: clusters_setLoggingService,
  clusters_setMonitoringService: clusters_setMonitoringService,
  clusters_setAddonsConfig: clusters_setAddonsConfig,
  clusters_setLocations: clusters_setLocations,
  clusters_updateMaster: clusters_updateMaster,
  clusters_setMasterAuth: clusters_setMasterAuth,
  clusters_deleteCluster: clusters_deleteCluster,
  clusters_listOperations: clusters_listOperations,
  clusters_getOperation: clusters_getOperation,
  clusters_cancelOperation: clusters_cancelOperation,
  clusters_getServerConfig: clusters_getServerConfig,
  clusters_getJSONWebKeys: clusters_getJSONWebKeys,
  node_pools_listNodePools: node_pools_listNodePools,
  node_pools_getNodePool: node_pools_getNodePool,
  node_pools_createNodePool: node_pools_createNodePool,
  node_pools_deleteNodePool: node_pools_deleteNodePool,
  node_pools_completeNodePoolUpgrade: node_pools_completeNodePoolUpgrade,
  node_pools_rollbackNodePoolUpgrade: node_pools_rollbackNodePoolUpgrade,
  node_pools_setNodePoolManagement: node_pools_setNodePoolManagement,
  clusters_setLabels: clusters_setLabels,
  clusters_setLegacyAbac: clusters_setLegacyAbac,
  clusters_startIPRotation: clusters_startIPRotation,
  clusters_completeIPRotation: clusters_completeIPRotation,
  node_pools_setNodePoolSize: node_pools_setNodePoolSize,
  clusters_setNetworkPolicy: clusters_setNetworkPolicy,
  clusters_setMaintenancePolicy: clusters_setMaintenancePolicy,
  clusters_listUsableSubnetworks: clusters_listUsableSubnetworks,
  clusters_checkAutopilotCompatibility: clusters_checkAutopilotCompatibility,
  clusters_fetchClusterUpgradeInfo: clusters_fetchClusterUpgradeInfo,
  node_pools_fetchNodePoolUpgradeInfo: node_pools_fetchNodePoolUpgradeInfo,
};
