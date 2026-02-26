import builds_createBuild from "./builds/createBuild.ts";
import builds_getBuild from "./builds/getBuild.ts";
import builds_listBuilds from "./builds/listBuilds.ts";
import builds_cancelBuild from "./builds/cancelBuild.ts";
import builds_retryBuild from "./builds/retryBuild.ts";
import builds_approveBuild from "./builds/approveBuild.ts";
import build_triggers_createBuildTrigger from "./build_triggers/createBuildTrigger.ts";
import build_triggers_getBuildTrigger from "./build_triggers/getBuildTrigger.ts";
import build_triggers_listBuildTriggers from "./build_triggers/listBuildTriggers.ts";
import build_triggers_deleteBuildTrigger from "./build_triggers/deleteBuildTrigger.ts";
import build_triggers_updateBuildTrigger from "./build_triggers/updateBuildTrigger.ts";
import build_triggers_runBuildTrigger from "./build_triggers/runBuildTrigger.ts";
import build_triggers_receiveTriggerWebhook from "./build_triggers/receiveTriggerWebhook.ts";
import worker_pools_createWorkerPool from "./worker_pools/createWorkerPool.ts";
import worker_pools_getWorkerPool from "./worker_pools/getWorkerPool.ts";
import worker_pools_deleteWorkerPool from "./worker_pools/deleteWorkerPool.ts";
import worker_pools_updateWorkerPool from "./worker_pools/updateWorkerPool.ts";
import worker_pools_listWorkerPools from "./worker_pools/listWorkerPools.ts";
import service_accounts_getDefaultServiceAccount from "./service_accounts/getDefaultServiceAccount.ts";
import connections_createConnection from "./connections/createConnection.ts";
import connections_getConnection from "./connections/getConnection.ts";
import connections_listConnections from "./connections/listConnections.ts";
import connections_updateConnection from "./connections/updateConnection.ts";
import connections_deleteConnection from "./connections/deleteConnection.ts";
import repositories_createRepository from "./repositories/createRepository.ts";
import repositories_batchCreateRepositories from "./repositories/batchCreateRepositories.ts";
import repositories_getRepository from "./repositories/getRepository.ts";
import repositories_listRepositories from "./repositories/listRepositories.ts";
import repositories_deleteRepository from "./repositories/deleteRepository.ts";
import repositories_fetchReadWriteToken from "./repositories/fetchReadWriteToken.ts";
import repositories_fetchReadToken from "./repositories/fetchReadToken.ts";
import repositories_fetchLinkableRepositories from "./repositories/fetchLinkableRepositories.ts";
import repositories_fetchGitRefs from "./repositories/fetchGitRefs.ts";

export const blocks = {
  builds_createBuild: builds_createBuild,
  builds_getBuild: builds_getBuild,
  builds_listBuilds: builds_listBuilds,
  builds_cancelBuild: builds_cancelBuild,
  builds_retryBuild: builds_retryBuild,
  builds_approveBuild: builds_approveBuild,
  build_triggers_createBuildTrigger: build_triggers_createBuildTrigger,
  build_triggers_getBuildTrigger: build_triggers_getBuildTrigger,
  build_triggers_listBuildTriggers: build_triggers_listBuildTriggers,
  build_triggers_deleteBuildTrigger: build_triggers_deleteBuildTrigger,
  build_triggers_updateBuildTrigger: build_triggers_updateBuildTrigger,
  build_triggers_runBuildTrigger: build_triggers_runBuildTrigger,
  build_triggers_receiveTriggerWebhook: build_triggers_receiveTriggerWebhook,
  worker_pools_createWorkerPool: worker_pools_createWorkerPool,
  worker_pools_getWorkerPool: worker_pools_getWorkerPool,
  worker_pools_deleteWorkerPool: worker_pools_deleteWorkerPool,
  worker_pools_updateWorkerPool: worker_pools_updateWorkerPool,
  worker_pools_listWorkerPools: worker_pools_listWorkerPools,
  service_accounts_getDefaultServiceAccount:
    service_accounts_getDefaultServiceAccount,
  connections_createConnection: connections_createConnection,
  connections_getConnection: connections_getConnection,
  connections_listConnections: connections_listConnections,
  connections_updateConnection: connections_updateConnection,
  connections_deleteConnection: connections_deleteConnection,
  repositories_createRepository: repositories_createRepository,
  repositories_batchCreateRepositories: repositories_batchCreateRepositories,
  repositories_getRepository: repositories_getRepository,
  repositories_listRepositories: repositories_listRepositories,
  repositories_deleteRepository: repositories_deleteRepository,
  repositories_fetchReadWriteToken: repositories_fetchReadWriteToken,
  repositories_fetchReadToken: repositories_fetchReadToken,
  repositories_fetchLinkableRepositories:
    repositories_fetchLinkableRepositories,
  repositories_fetchGitRefs: repositories_fetchGitRefs,
};
