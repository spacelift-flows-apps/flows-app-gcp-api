import listClusters from "./clusters/listClusters.ts";
import getCluster from "./clusters/getCluster.ts";
import createCluster from "./clusters/createCluster.ts";
import updateCluster from "./clusters/updateCluster.ts";
import updateNodePool from "./node_pools/updateNodePool.ts";
import setNodePoolAutoscaling from "./node_pools/setNodePoolAutoscaling.ts";
import setLoggingService from "./clusters/setLoggingService.ts";
import setMonitoringService from "./clusters/setMonitoringService.ts";
import setAddonsConfig from "./clusters/setAddonsConfig.ts";
import setLocations from "./clusters/setLocations.ts";
import updateMaster from "./clusters/updateMaster.ts";
import setMasterAuth from "./clusters/setMasterAuth.ts";
import deleteCluster from "./clusters/deleteCluster.ts";
import listOperations from "./clusters/listOperations.ts";
import getOperation from "./clusters/getOperation.ts";
import cancelOperation from "./clusters/cancelOperation.ts";
import getServerConfig from "./clusters/getServerConfig.ts";
import getJSONWebKeys from "./clusters/getJSONWebKeys.ts";
import listNodePools from "./node_pools/listNodePools.ts";
import getNodePool from "./node_pools/getNodePool.ts";
import createNodePool from "./node_pools/createNodePool.ts";
import deleteNodePool from "./node_pools/deleteNodePool.ts";
import completeNodePoolUpgrade from "./node_pools/completeNodePoolUpgrade.ts";
import rollbackNodePoolUpgrade from "./node_pools/rollbackNodePoolUpgrade.ts";
import setNodePoolManagement from "./node_pools/setNodePoolManagement.ts";
import setLabels from "./clusters/setLabels.ts";
import setLegacyAbac from "./clusters/setLegacyAbac.ts";
import startIPRotation from "./clusters/startIPRotation.ts";
import completeIPRotation from "./clusters/completeIPRotation.ts";
import setNodePoolSize from "./node_pools/setNodePoolSize.ts";
import setNetworkPolicy from "./clusters/setNetworkPolicy.ts";
import setMaintenancePolicy from "./clusters/setMaintenancePolicy.ts";
import listUsableSubnetworks from "./clusters/listUsableSubnetworks.ts";
import checkAutopilotCompatibility from "./clusters/checkAutopilotCompatibility.ts";
import fetchClusterUpgradeInfo from "./clusters/fetchClusterUpgradeInfo.ts";
import fetchNodePoolUpgradeInfo from "./node_pools/fetchNodePoolUpgradeInfo.ts";

export const blocks = {
  clusters_listClusters: listClusters,
  clusters_getCluster: getCluster,
  clusters_createCluster: createCluster,
  clusters_updateCluster: updateCluster,
  node_pools_updateNodePool: updateNodePool,
  node_pools_setNodePoolAutoscaling: setNodePoolAutoscaling,
  clusters_setLoggingService: setLoggingService,
  clusters_setMonitoringService: setMonitoringService,
  clusters_setAddonsConfig: setAddonsConfig,
  clusters_setLocations: setLocations,
  clusters_updateMaster: updateMaster,
  clusters_setMasterAuth: setMasterAuth,
  clusters_deleteCluster: deleteCluster,
  clusters_listOperations: listOperations,
  clusters_getOperation: getOperation,
  clusters_cancelOperation: cancelOperation,
  clusters_getServerConfig: getServerConfig,
  clusters_getJSONWebKeys: getJSONWebKeys,
  node_pools_listNodePools: listNodePools,
  node_pools_getNodePool: getNodePool,
  node_pools_createNodePool: createNodePool,
  node_pools_deleteNodePool: deleteNodePool,
  node_pools_completeNodePoolUpgrade: completeNodePoolUpgrade,
  node_pools_rollbackNodePoolUpgrade: rollbackNodePoolUpgrade,
  node_pools_setNodePoolManagement: setNodePoolManagement,
  clusters_setLabels: setLabels,
  clusters_setLegacyAbac: setLegacyAbac,
  clusters_startIPRotation: startIPRotation,
  clusters_completeIPRotation: completeIPRotation,
  node_pools_setNodePoolSize: setNodePoolSize,
  clusters_setNetworkPolicy: setNetworkPolicy,
  clusters_setMaintenancePolicy: setMaintenancePolicy,
  clusters_listUsableSubnetworks: listUsableSubnetworks,
  clusters_checkAutopilotCompatibility: checkAutopilotCompatibility,
  clusters_fetchClusterUpgradeInfo: fetchClusterUpgradeInfo,
  node_pools_fetchNodePoolUpgradeInfo: fetchNodePoolUpgradeInfo,
};
