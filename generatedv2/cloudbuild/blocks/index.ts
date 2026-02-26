import createBuild from "./builds/createBuild.ts";
import getBuild from "./builds/getBuild.ts";
import listBuilds from "./builds/listBuilds.ts";
import cancelBuild from "./builds/cancelBuild.ts";
import retryBuild from "./builds/retryBuild.ts";
import approveBuild from "./builds/approveBuild.ts";
import createBuildTrigger from "./build_triggers/createBuildTrigger.ts";
import getBuildTrigger from "./build_triggers/getBuildTrigger.ts";
import listBuildTriggers from "./build_triggers/listBuildTriggers.ts";
import deleteBuildTrigger from "./build_triggers/deleteBuildTrigger.ts";
import updateBuildTrigger from "./build_triggers/updateBuildTrigger.ts";
import runBuildTrigger from "./build_triggers/runBuildTrigger.ts";
import receiveTriggerWebhook from "./build_triggers/receiveTriggerWebhook.ts";
import createWorkerPool from "./worker_pools/createWorkerPool.ts";
import getWorkerPool from "./worker_pools/getWorkerPool.ts";
import deleteWorkerPool from "./worker_pools/deleteWorkerPool.ts";
import updateWorkerPool from "./worker_pools/updateWorkerPool.ts";
import listWorkerPools from "./worker_pools/listWorkerPools.ts";
import getDefaultServiceAccount from "./service_accounts/getDefaultServiceAccount.ts";
import createConnection from "./connections/createConnection.ts";
import getConnection from "./connections/getConnection.ts";
import listConnections from "./connections/listConnections.ts";
import updateConnection from "./connections/updateConnection.ts";
import deleteConnection from "./connections/deleteConnection.ts";
import createRepository from "./repositories/createRepository.ts";
import batchCreateRepositories from "./repositories/batchCreateRepositories.ts";
import getRepository from "./repositories/getRepository.ts";
import listRepositories from "./repositories/listRepositories.ts";
import deleteRepository from "./repositories/deleteRepository.ts";
import fetchReadWriteToken from "./repositories/fetchReadWriteToken.ts";
import fetchReadToken from "./repositories/fetchReadToken.ts";
import fetchLinkableRepositories from "./repositories/fetchLinkableRepositories.ts";
import fetchGitRefs from "./repositories/fetchGitRefs.ts";

export const blocks = {
  builds_createBuild: createBuild,
  builds_getBuild: getBuild,
  builds_listBuilds: listBuilds,
  builds_cancelBuild: cancelBuild,
  builds_retryBuild: retryBuild,
  builds_approveBuild: approveBuild,
  build_triggers_createBuildTrigger: createBuildTrigger,
  build_triggers_getBuildTrigger: getBuildTrigger,
  build_triggers_listBuildTriggers: listBuildTriggers,
  build_triggers_deleteBuildTrigger: deleteBuildTrigger,
  build_triggers_updateBuildTrigger: updateBuildTrigger,
  build_triggers_runBuildTrigger: runBuildTrigger,
  build_triggers_receiveTriggerWebhook: receiveTriggerWebhook,
  worker_pools_createWorkerPool: createWorkerPool,
  worker_pools_getWorkerPool: getWorkerPool,
  worker_pools_deleteWorkerPool: deleteWorkerPool,
  worker_pools_updateWorkerPool: updateWorkerPool,
  worker_pools_listWorkerPools: listWorkerPools,
  service_accounts_getDefaultServiceAccount: getDefaultServiceAccount,
  connections_createConnection: createConnection,
  connections_getConnection: getConnection,
  connections_listConnections: listConnections,
  connections_updateConnection: updateConnection,
  connections_deleteConnection: deleteConnection,
  repositories_createRepository: createRepository,
  repositories_batchCreateRepositories: batchCreateRepositories,
  repositories_getRepository: getRepository,
  repositories_listRepositories: listRepositories,
  repositories_deleteRepository: deleteRepository,
  repositories_fetchReadWriteToken: fetchReadWriteToken,
  repositories_fetchReadToken: fetchReadToken,
  repositories_fetchLinkableRepositories: fetchLinkableRepositories,
  repositories_fetchGitRefs: fetchGitRefs,
};
