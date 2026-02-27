import builds_submitBuild from "./builds/submitBuild.ts";
import executions_cancelExecution from "./executions/cancelExecution.ts";
import executions_deleteExecution from "./executions/deleteExecution.ts";
import executions_getExecution from "./executions/getExecution.ts";
import executions_listExecutions from "./executions/listExecutions.ts";
import instances_createInstance from "./instances/createInstance.ts";
import instances_deleteInstance from "./instances/deleteInstance.ts";
import instances_getInstance from "./instances/getInstance.ts";
import instances_listInstances from "./instances/listInstances.ts";
import instances_startInstance from "./instances/startInstance.ts";
import instances_stopInstance from "./instances/stopInstance.ts";
import jobs_createJob from "./jobs/createJob.ts";
import jobs_deleteJob from "./jobs/deleteJob.ts";
import jobs_getJob from "./jobs/getJob.ts";
import jobs_listJobs from "./jobs/listJobs.ts";
import jobs_runJob from "./jobs/runJob.ts";
import jobs_updateJob from "./jobs/updateJob.ts";
import revisions_deleteRevision from "./revisions/deleteRevision.ts";
import revisions_getRevision from "./revisions/getRevision.ts";
import revisions_listRevisions from "./revisions/listRevisions.ts";
import services_createService from "./services/createService.ts";
import services_deleteService from "./services/deleteService.ts";
import services_getService from "./services/getService.ts";
import services_listServices from "./services/listServices.ts";
import services_updateService from "./services/updateService.ts";
import tasks_getTask from "./tasks/getTask.ts";
import tasks_listTasks from "./tasks/listTasks.ts";
import worker_pools_createWorkerPool from "./worker_pools/createWorkerPool.ts";
import worker_pools_deleteWorkerPool from "./worker_pools/deleteWorkerPool.ts";
import worker_pools_getWorkerPool from "./worker_pools/getWorkerPool.ts";
import worker_pools_listWorkerPools from "./worker_pools/listWorkerPools.ts";
import worker_pools_updateWorkerPool from "./worker_pools/updateWorkerPool.ts";

export const blocks = {
  builds_submitBuild: builds_submitBuild,
  executions_cancelExecution: executions_cancelExecution,
  executions_deleteExecution: executions_deleteExecution,
  executions_getExecution: executions_getExecution,
  executions_listExecutions: executions_listExecutions,
  instances_createInstance: instances_createInstance,
  instances_deleteInstance: instances_deleteInstance,
  instances_getInstance: instances_getInstance,
  instances_listInstances: instances_listInstances,
  instances_startInstance: instances_startInstance,
  instances_stopInstance: instances_stopInstance,
  jobs_createJob: jobs_createJob,
  jobs_deleteJob: jobs_deleteJob,
  jobs_getJob: jobs_getJob,
  jobs_listJobs: jobs_listJobs,
  jobs_runJob: jobs_runJob,
  jobs_updateJob: jobs_updateJob,
  revisions_deleteRevision: revisions_deleteRevision,
  revisions_getRevision: revisions_getRevision,
  revisions_listRevisions: revisions_listRevisions,
  services_createService: services_createService,
  services_deleteService: services_deleteService,
  services_getService: services_getService,
  services_listServices: services_listServices,
  services_updateService: services_updateService,
  tasks_getTask: tasks_getTask,
  tasks_listTasks: tasks_listTasks,
  worker_pools_createWorkerPool: worker_pools_createWorkerPool,
  worker_pools_deleteWorkerPool: worker_pools_deleteWorkerPool,
  worker_pools_getWorkerPool: worker_pools_getWorkerPool,
  worker_pools_listWorkerPools: worker_pools_listWorkerPools,
  worker_pools_updateWorkerPool: worker_pools_updateWorkerPool,
};
