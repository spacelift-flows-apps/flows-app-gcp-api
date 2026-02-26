import backup_runs_deleteOperation from "./backup_runs/deleteOperation.ts";
import backup_runs_get from "./backup_runs/get.ts";
import backup_runs_insert from "./backup_runs/insert.ts";
import backup_runs_list from "./backup_runs/list.ts";
import backups_createBackup from "./backups/createBackup.ts";
import backups_getBackup from "./backups/getBackup.ts";
import backups_listBackups from "./backups/listBackups.ts";
import backups_updateBackup from "./backups/updateBackup.ts";
import backups_deleteBackup from "./backups/deleteBackup.ts";
import databases_deleteOperation from "./databases/deleteOperation.ts";
import databases_get from "./databases/get.ts";
import databases_insert from "./databases/insert.ts";
import databases_list from "./databases/list.ts";
import databases_patch from "./databases/patch.ts";
import databases_update from "./databases/update.ts";
import flags_list from "./flags/list.ts";
import instances_addServerCa from "./instances/addServerCa.ts";
import instances_addServerCertificate from "./instances/addServerCertificate.ts";
import instances_addEntraIdCertificate from "./instances/addEntraIdCertificate.ts";
import instances_clone from "./instances/clone.ts";
import instances_deleteOperation from "./instances/deleteOperation.ts";
import instances_demoteMaster from "./instances/demoteMaster.ts";
import instances_demote from "./instances/demote.ts";
import instances_exportOperation from "./instances/exportOperation.ts";
import instances_failover from "./instances/failover.ts";
import instances_reencrypt from "./instances/reencrypt.ts";
import instances_get from "./instances/get.ts";
import instances_importOperation from "./instances/importOperation.ts";
import instances_insert from "./instances/insert.ts";
import instances_list from "./instances/list.ts";
import instances_listServerCas from "./instances/listServerCas.ts";
import instances_listServerCertificates from "./instances/listServerCertificates.ts";
import instances_listEntraIdCertificates from "./instances/listEntraIdCertificates.ts";
import instances_patch from "./instances/patch.ts";
import instances_promoteReplica from "./instances/promoteReplica.ts";
import instances_switchover from "./instances/switchover.ts";
import instances_resetSslConfig from "./instances/resetSslConfig.ts";
import instances_restart from "./instances/restart.ts";
import backups_restoreBackup from "./backups/restoreBackup.ts";
import instances_rotateServerCa from "./instances/rotateServerCa.ts";
import instances_rotateServerCertificate from "./instances/rotateServerCertificate.ts";
import instances_rotateEntraIdCertificate from "./instances/rotateEntraIdCertificate.ts";
import instances_startReplica from "./instances/startReplica.ts";
import instances_stopReplica from "./instances/stopReplica.ts";
import instances_truncateLog from "./instances/truncateLog.ts";
import instances_update from "./instances/update.ts";
import instances_createEphemeral from "./instances/createEphemeral.ts";
import instances_rescheduleMaintenance from "./instances/rescheduleMaintenance.ts";
import instances_verifyExternalSyncSettings from "./instances/verifyExternalSyncSettings.ts";
import instances_startExternalSync from "./instances/startExternalSync.ts";
import instances_performDiskShrink from "./instances/performDiskShrink.ts";
import instances_getDiskShrinkConfig from "./instances/getDiskShrinkConfig.ts";
import instances_resetReplicaSize from "./instances/resetReplicaSize.ts";
import instances_getLatestRecoveryTime from "./instances/getLatestRecoveryTime.ts";
import instances_executeSql from "./instances/executeSql.ts";
import instances_acquireSsrsLease from "./instances/acquireSsrsLease.ts";
import instances_releaseSsrsLease from "./instances/releaseSsrsLease.ts";
import instances_preCheckMajorVersionUpgrade from "./instances/preCheckMajorVersionUpgrade.ts";
import instances_pointInTimeRestore from "./instances/pointInTimeRestore.ts";
import operations_get from "./operations/get.ts";
import operations_list from "./operations/list.ts";
import operations_cancel from "./operations/cancel.ts";
import tiers_list from "./tiers/list.ts";
import ssl_certificates_deleteOperation from "./ssl_certificates/deleteOperation.ts";
import ssl_certificates_get from "./ssl_certificates/get.ts";
import ssl_certificates_insert from "./ssl_certificates/insert.ts";
import ssl_certificates_list from "./ssl_certificates/list.ts";
import connect_getConnectSettings from "./connect/getConnectSettings.ts";
import connect_generateEphemeralCert from "./connect/generateEphemeralCert.ts";
import users_deleteOperation from "./users/deleteOperation.ts";
import users_get from "./users/get.ts";
import users_insert from "./users/insert.ts";
import users_list from "./users/list.ts";
import users_update from "./users/update.ts";

export const blocks = {
  backup_runs_deleteOperation: backup_runs_deleteOperation,
  backup_runs_get: backup_runs_get,
  backup_runs_insert: backup_runs_insert,
  backup_runs_list: backup_runs_list,
  backups_createBackup: backups_createBackup,
  backups_getBackup: backups_getBackup,
  backups_listBackups: backups_listBackups,
  backups_updateBackup: backups_updateBackup,
  backups_deleteBackup: backups_deleteBackup,
  databases_deleteOperation: databases_deleteOperation,
  databases_get: databases_get,
  databases_insert: databases_insert,
  databases_list: databases_list,
  databases_patch: databases_patch,
  databases_update: databases_update,
  flags_list: flags_list,
  instances_addServerCa: instances_addServerCa,
  instances_addServerCertificate: instances_addServerCertificate,
  instances_addEntraIdCertificate: instances_addEntraIdCertificate,
  instances_clone: instances_clone,
  instances_deleteOperation: instances_deleteOperation,
  instances_demoteMaster: instances_demoteMaster,
  instances_demote: instances_demote,
  instances_exportOperation: instances_exportOperation,
  instances_failover: instances_failover,
  instances_reencrypt: instances_reencrypt,
  instances_get: instances_get,
  instances_importOperation: instances_importOperation,
  instances_insert: instances_insert,
  instances_list: instances_list,
  instances_listServerCas: instances_listServerCas,
  instances_listServerCertificates: instances_listServerCertificates,
  instances_listEntraIdCertificates: instances_listEntraIdCertificates,
  instances_patch: instances_patch,
  instances_promoteReplica: instances_promoteReplica,
  instances_switchover: instances_switchover,
  instances_resetSslConfig: instances_resetSslConfig,
  instances_restart: instances_restart,
  backups_restoreBackup: backups_restoreBackup,
  instances_rotateServerCa: instances_rotateServerCa,
  instances_rotateServerCertificate: instances_rotateServerCertificate,
  instances_rotateEntraIdCertificate: instances_rotateEntraIdCertificate,
  instances_startReplica: instances_startReplica,
  instances_stopReplica: instances_stopReplica,
  instances_truncateLog: instances_truncateLog,
  instances_update: instances_update,
  instances_createEphemeral: instances_createEphemeral,
  instances_rescheduleMaintenance: instances_rescheduleMaintenance,
  instances_verifyExternalSyncSettings: instances_verifyExternalSyncSettings,
  instances_startExternalSync: instances_startExternalSync,
  instances_performDiskShrink: instances_performDiskShrink,
  instances_getDiskShrinkConfig: instances_getDiskShrinkConfig,
  instances_resetReplicaSize: instances_resetReplicaSize,
  instances_getLatestRecoveryTime: instances_getLatestRecoveryTime,
  instances_executeSql: instances_executeSql,
  instances_acquireSsrsLease: instances_acquireSsrsLease,
  instances_releaseSsrsLease: instances_releaseSsrsLease,
  instances_preCheckMajorVersionUpgrade: instances_preCheckMajorVersionUpgrade,
  instances_pointInTimeRestore: instances_pointInTimeRestore,
  operations_get: operations_get,
  operations_list: operations_list,
  operations_cancel: operations_cancel,
  tiers_list: tiers_list,
  ssl_certificates_deleteOperation: ssl_certificates_deleteOperation,
  ssl_certificates_get: ssl_certificates_get,
  ssl_certificates_insert: ssl_certificates_insert,
  ssl_certificates_list: ssl_certificates_list,
  connect_getConnectSettings: connect_getConnectSettings,
  connect_generateEphemeralCert: connect_generateEphemeralCert,
  users_deleteOperation: users_deleteOperation,
  users_get: users_get,
  users_insert: users_insert,
  users_list: users_list,
  users_update: users_update,
};
