import alert_policies_listAlertPolicies from "./alert_policies/listAlertPolicies.ts";
import alert_policies_getAlertPolicy from "./alert_policies/getAlertPolicy.ts";
import alert_policies_createAlertPolicy from "./alert_policies/createAlertPolicy.ts";
import alert_policies_deleteAlertPolicy from "./alert_policies/deleteAlertPolicy.ts";
import alert_policies_updateAlertPolicy from "./alert_policies/updateAlertPolicy.ts";
import groups_listGroups from "./groups/listGroups.ts";
import groups_getGroup from "./groups/getGroup.ts";
import groups_createGroup from "./groups/createGroup.ts";
import groups_updateGroup from "./groups/updateGroup.ts";
import groups_deleteGroup from "./groups/deleteGroup.ts";
import groups_listGroupMembers from "./groups/listGroupMembers.ts";
import monitored_resources_listMonitoredResourceDescriptors from "./monitored_resources/listMonitoredResourceDescriptors.ts";
import monitored_resources_getMonitoredResourceDescriptor from "./monitored_resources/getMonitoredResourceDescriptor.ts";
import metric_descriptors_listMetricDescriptors from "./metric_descriptors/listMetricDescriptors.ts";
import metric_descriptors_getMetricDescriptor from "./metric_descriptors/getMetricDescriptor.ts";
import metric_descriptors_createMetricDescriptor from "./metric_descriptors/createMetricDescriptor.ts";
import metric_descriptors_deleteMetricDescriptor from "./metric_descriptors/deleteMetricDescriptor.ts";
import time_series_listTimeSeries from "./time_series/listTimeSeries.ts";
import time_series_createTimeSeries from "./time_series/createTimeSeries.ts";
import time_series_createServiceTimeSeries from "./time_series/createServiceTimeSeries.ts";
import services_createService from "./services/createService.ts";
import services_getService from "./services/getService.ts";
import services_listServices from "./services/listServices.ts";
import services_updateService from "./services/updateService.ts";
import services_deleteService from "./services/deleteService.ts";
import objects_createServiceLevelObjective from "./objects/createServiceLevelObjective.ts";
import objects_getServiceLevelObjective from "./objects/getServiceLevelObjective.ts";
import objects_listServiceLevelObjectives from "./objects/listServiceLevelObjectives.ts";
import objects_updateServiceLevelObjective from "./objects/updateServiceLevelObjective.ts";
import objects_deleteServiceLevelObjective from "./objects/deleteServiceLevelObjective.ts";
import time_series_queryTimeSeries from "./time_series/queryTimeSeries.ts";
import snoozes_createSnooze from "./snoozes/createSnooze.ts";
import snoozes_listSnoozes from "./snoozes/listSnoozes.ts";
import snoozes_getSnooze from "./snoozes/getSnooze.ts";
import snoozes_updateSnooze from "./snoozes/updateSnooze.ts";
import notification_channels_listNotificationChannelDescriptors from "./notification_channels/listNotificationChannelDescriptors.ts";
import notification_channels_getNotificationChannelDescriptor from "./notification_channels/getNotificationChannelDescriptor.ts";
import notification_channels_listNotificationChannels from "./notification_channels/listNotificationChannels.ts";
import notification_channels_getNotificationChannel from "./notification_channels/getNotificationChannel.ts";
import notification_channels_createNotificationChannel from "./notification_channels/createNotificationChannel.ts";
import notification_channels_updateNotificationChannel from "./notification_channels/updateNotificationChannel.ts";
import notification_channels_deleteNotificationChannel from "./notification_channels/deleteNotificationChannel.ts";
import notification_channels_sendNotificationChannelVerificationCode from "./notification_channels/sendNotificationChannelVerificationCode.ts";
import notification_channels_getNotificationChannelVerificationCode from "./notification_channels/getNotificationChannelVerificationCode.ts";
import notification_channels_verifyNotificationChannel from "./notification_channels/verifyNotificationChannel.ts";
import uptime_checks_listUptimeCheckConfigs from "./uptime_checks/listUptimeCheckConfigs.ts";
import uptime_checks_getUptimeCheckConfig from "./uptime_checks/getUptimeCheckConfig.ts";
import uptime_checks_createUptimeCheckConfig from "./uptime_checks/createUptimeCheckConfig.ts";
import uptime_checks_updateUptimeCheckConfig from "./uptime_checks/updateUptimeCheckConfig.ts";
import uptime_checks_deleteUptimeCheckConfig from "./uptime_checks/deleteUptimeCheckConfig.ts";
import uptime_checks_listUptimeCheckIps from "./uptime_checks/listUptimeCheckIps.ts";

export const blocks = {
  alert_policies_listAlertPolicies: alert_policies_listAlertPolicies,
  alert_policies_getAlertPolicy: alert_policies_getAlertPolicy,
  alert_policies_createAlertPolicy: alert_policies_createAlertPolicy,
  alert_policies_deleteAlertPolicy: alert_policies_deleteAlertPolicy,
  alert_policies_updateAlertPolicy: alert_policies_updateAlertPolicy,
  groups_listGroups: groups_listGroups,
  groups_getGroup: groups_getGroup,
  groups_createGroup: groups_createGroup,
  groups_updateGroup: groups_updateGroup,
  groups_deleteGroup: groups_deleteGroup,
  groups_listGroupMembers: groups_listGroupMembers,
  monitored_resources_listMonitoredResourceDescriptors:
    monitored_resources_listMonitoredResourceDescriptors,
  monitored_resources_getMonitoredResourceDescriptor:
    monitored_resources_getMonitoredResourceDescriptor,
  metric_descriptors_listMetricDescriptors:
    metric_descriptors_listMetricDescriptors,
  metric_descriptors_getMetricDescriptor:
    metric_descriptors_getMetricDescriptor,
  metric_descriptors_createMetricDescriptor:
    metric_descriptors_createMetricDescriptor,
  metric_descriptors_deleteMetricDescriptor:
    metric_descriptors_deleteMetricDescriptor,
  time_series_listTimeSeries: time_series_listTimeSeries,
  time_series_createTimeSeries: time_series_createTimeSeries,
  time_series_createServiceTimeSeries: time_series_createServiceTimeSeries,
  services_createService: services_createService,
  services_getService: services_getService,
  services_listServices: services_listServices,
  services_updateService: services_updateService,
  services_deleteService: services_deleteService,
  objects_createServiceLevelObjective: objects_createServiceLevelObjective,
  objects_getServiceLevelObjective: objects_getServiceLevelObjective,
  objects_listServiceLevelObjectives: objects_listServiceLevelObjectives,
  objects_updateServiceLevelObjective: objects_updateServiceLevelObjective,
  objects_deleteServiceLevelObjective: objects_deleteServiceLevelObjective,
  time_series_queryTimeSeries: time_series_queryTimeSeries,
  snoozes_createSnooze: snoozes_createSnooze,
  snoozes_listSnoozes: snoozes_listSnoozes,
  snoozes_getSnooze: snoozes_getSnooze,
  snoozes_updateSnooze: snoozes_updateSnooze,
  notification_channels_listNotificationChannelDescriptors:
    notification_channels_listNotificationChannelDescriptors,
  notification_channels_getNotificationChannelDescriptor:
    notification_channels_getNotificationChannelDescriptor,
  notification_channels_listNotificationChannels:
    notification_channels_listNotificationChannels,
  notification_channels_getNotificationChannel:
    notification_channels_getNotificationChannel,
  notification_channels_createNotificationChannel:
    notification_channels_createNotificationChannel,
  notification_channels_updateNotificationChannel:
    notification_channels_updateNotificationChannel,
  notification_channels_deleteNotificationChannel:
    notification_channels_deleteNotificationChannel,
  notification_channels_sendNotificationChannelVerificationCode:
    notification_channels_sendNotificationChannelVerificationCode,
  notification_channels_getNotificationChannelVerificationCode:
    notification_channels_getNotificationChannelVerificationCode,
  notification_channels_verifyNotificationChannel:
    notification_channels_verifyNotificationChannel,
  uptime_checks_listUptimeCheckConfigs: uptime_checks_listUptimeCheckConfigs,
  uptime_checks_getUptimeCheckConfig: uptime_checks_getUptimeCheckConfig,
  uptime_checks_createUptimeCheckConfig: uptime_checks_createUptimeCheckConfig,
  uptime_checks_updateUptimeCheckConfig: uptime_checks_updateUptimeCheckConfig,
  uptime_checks_deleteUptimeCheckConfig: uptime_checks_deleteUptimeCheckConfig,
  uptime_checks_listUptimeCheckIps: uptime_checks_listUptimeCheckIps,
};
