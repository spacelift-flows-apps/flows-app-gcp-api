import backend_buckets_addSignedUrlKey from "./backend_buckets/addSignedUrlKey.ts";
import backend_buckets_deleteOperation from "./backend_buckets/deleteOperation.ts";
import backend_buckets_deleteSignedUrlKey from "./backend_buckets/deleteSignedUrlKey.ts";
import backend_buckets_get from "./backend_buckets/get.ts";
import backend_buckets_insert from "./backend_buckets/insert.ts";
import backend_buckets_list from "./backend_buckets/list.ts";
import backend_buckets_patch from "./backend_buckets/patch.ts";
import backend_buckets_setEdgeSecurityPolicy from "./backend_buckets/setEdgeSecurityPolicy.ts";
import backend_buckets_update from "./backend_buckets/update.ts";
import backend_services_addSignedUrlKey from "./backend_services/addSignedUrlKey.ts";
import backend_services_aggregatedList from "./backend_services/aggregatedList.ts";
import backend_services_deleteOperation from "./backend_services/deleteOperation.ts";
import backend_services_deleteSignedUrlKey from "./backend_services/deleteSignedUrlKey.ts";
import backend_services_get from "./backend_services/get.ts";
import backend_services_getEffectiveSecurityPolicies from "./backend_services/getEffectiveSecurityPolicies.ts";
import backend_services_getHealth from "./backend_services/getHealth.ts";
import backend_services_insert from "./backend_services/insert.ts";
import backend_services_list from "./backend_services/list.ts";
import backend_services_listUsable from "./backend_services/listUsable.ts";
import backend_services_patch from "./backend_services/patch.ts";
import backend_services_setEdgeSecurityPolicy from "./backend_services/setEdgeSecurityPolicy.ts";
import backend_services_setSecurityPolicy from "./backend_services/setSecurityPolicy.ts";
import backend_services_update from "./backend_services/update.ts";
import forwarding_rules_aggregatedList from "./forwarding_rules/aggregatedList.ts";
import forwarding_rules_deleteOperation from "./forwarding_rules/deleteOperation.ts";
import forwarding_rules_get from "./forwarding_rules/get.ts";
import forwarding_rules_insert from "./forwarding_rules/insert.ts";
import forwarding_rules_list from "./forwarding_rules/list.ts";
import forwarding_rules_patch from "./forwarding_rules/patch.ts";
import forwarding_rules_setLabels from "./forwarding_rules/setLabels.ts";
import forwarding_rules_setTarget from "./forwarding_rules/setTarget.ts";
import global_forwarding_rules_deleteOperation from "./global_forwarding_rules/deleteOperation.ts";
import global_forwarding_rules_get from "./global_forwarding_rules/get.ts";
import global_forwarding_rules_insert from "./global_forwarding_rules/insert.ts";
import global_forwarding_rules_list from "./global_forwarding_rules/list.ts";
import global_forwarding_rules_patch from "./global_forwarding_rules/patch.ts";
import global_forwarding_rules_setLabels from "./global_forwarding_rules/setLabels.ts";
import global_forwarding_rules_setTarget from "./global_forwarding_rules/setTarget.ts";
import health_checks_aggregatedList from "./health_checks/aggregatedList.ts";
import health_checks_deleteOperation from "./health_checks/deleteOperation.ts";
import health_checks_get from "./health_checks/get.ts";
import health_checks_insert from "./health_checks/insert.ts";
import health_checks_list from "./health_checks/list.ts";
import health_checks_patch from "./health_checks/patch.ts";
import health_checks_update from "./health_checks/update.ts";
import region_backend_services_deleteOperation from "./region_backend_services/deleteOperation.ts";
import region_backend_services_get from "./region_backend_services/get.ts";
import region_backend_services_getHealth from "./region_backend_services/getHealth.ts";
import region_backend_services_insert from "./region_backend_services/insert.ts";
import region_backend_services_list from "./region_backend_services/list.ts";
import region_backend_services_listUsable from "./region_backend_services/listUsable.ts";
import region_backend_services_patch from "./region_backend_services/patch.ts";
import region_backend_services_setSecurityPolicy from "./region_backend_services/setSecurityPolicy.ts";
import region_backend_services_update from "./region_backend_services/update.ts";
import region_health_checks_deleteOperation from "./region_health_checks/deleteOperation.ts";
import region_health_checks_get from "./region_health_checks/get.ts";
import region_health_checks_insert from "./region_health_checks/insert.ts";
import region_health_checks_list from "./region_health_checks/list.ts";
import region_health_checks_patch from "./region_health_checks/patch.ts";
import region_health_checks_update from "./region_health_checks/update.ts";
import region_target_http_proxies_deleteOperation from "./region_target_http_proxies/deleteOperation.ts";
import region_target_http_proxies_get from "./region_target_http_proxies/get.ts";
import region_target_http_proxies_insert from "./region_target_http_proxies/insert.ts";
import region_target_http_proxies_list from "./region_target_http_proxies/list.ts";
import region_target_http_proxies_setUrlMap from "./region_target_http_proxies/setUrlMap.ts";
import region_target_https_proxies_deleteOperation from "./region_target_https_proxies/deleteOperation.ts";
import region_target_https_proxies_get from "./region_target_https_proxies/get.ts";
import region_target_https_proxies_insert from "./region_target_https_proxies/insert.ts";
import region_target_https_proxies_list from "./region_target_https_proxies/list.ts";
import region_target_https_proxies_patch from "./region_target_https_proxies/patch.ts";
import region_target_https_proxies_setSslCertificates from "./region_target_https_proxies/setSslCertificates.ts";
import region_target_https_proxies_setUrlMap from "./region_target_https_proxies/setUrlMap.ts";
import region_target_tcp_proxies_deleteOperation from "./region_target_tcp_proxies/deleteOperation.ts";
import region_target_tcp_proxies_get from "./region_target_tcp_proxies/get.ts";
import region_target_tcp_proxies_insert from "./region_target_tcp_proxies/insert.ts";
import region_target_tcp_proxies_list from "./region_target_tcp_proxies/list.ts";
import region_url_maps_deleteOperation from "./region_url_maps/deleteOperation.ts";
import region_url_maps_get from "./region_url_maps/get.ts";
import region_url_maps_insert from "./region_url_maps/insert.ts";
import region_url_maps_list from "./region_url_maps/list.ts";
import region_url_maps_patch from "./region_url_maps/patch.ts";
import region_url_maps_update from "./region_url_maps/update.ts";
import region_url_maps_validate from "./region_url_maps/validate.ts";
import target_grpc_proxies_deleteOperation from "./target_grpc_proxies/deleteOperation.ts";
import target_grpc_proxies_get from "./target_grpc_proxies/get.ts";
import target_grpc_proxies_insert from "./target_grpc_proxies/insert.ts";
import target_grpc_proxies_list from "./target_grpc_proxies/list.ts";
import target_grpc_proxies_patch from "./target_grpc_proxies/patch.ts";
import target_http_proxies_aggregatedList from "./target_http_proxies/aggregatedList.ts";
import target_http_proxies_deleteOperation from "./target_http_proxies/deleteOperation.ts";
import target_http_proxies_get from "./target_http_proxies/get.ts";
import target_http_proxies_insert from "./target_http_proxies/insert.ts";
import target_http_proxies_list from "./target_http_proxies/list.ts";
import target_http_proxies_patch from "./target_http_proxies/patch.ts";
import target_http_proxies_setUrlMap from "./target_http_proxies/setUrlMap.ts";
import target_https_proxies_aggregatedList from "./target_https_proxies/aggregatedList.ts";
import target_https_proxies_deleteOperation from "./target_https_proxies/deleteOperation.ts";
import target_https_proxies_get from "./target_https_proxies/get.ts";
import target_https_proxies_insert from "./target_https_proxies/insert.ts";
import target_https_proxies_list from "./target_https_proxies/list.ts";
import target_https_proxies_patch from "./target_https_proxies/patch.ts";
import target_https_proxies_setCertificateMap from "./target_https_proxies/setCertificateMap.ts";
import target_https_proxies_setQuicOverride from "./target_https_proxies/setQuicOverride.ts";
import target_https_proxies_setSslCertificates from "./target_https_proxies/setSslCertificates.ts";
import target_https_proxies_setSslPolicy from "./target_https_proxies/setSslPolicy.ts";
import target_https_proxies_setUrlMap from "./target_https_proxies/setUrlMap.ts";
import target_instances_aggregatedList from "./target_instances/aggregatedList.ts";
import target_instances_deleteOperation from "./target_instances/deleteOperation.ts";
import target_instances_get from "./target_instances/get.ts";
import target_instances_insert from "./target_instances/insert.ts";
import target_instances_list from "./target_instances/list.ts";
import target_instances_setSecurityPolicy from "./target_instances/setSecurityPolicy.ts";
import target_pools_addHealthCheck from "./target_pools/addHealthCheck.ts";
import target_pools_addInstance from "./target_pools/addInstance.ts";
import target_pools_aggregatedList from "./target_pools/aggregatedList.ts";
import target_pools_deleteOperation from "./target_pools/deleteOperation.ts";
import target_pools_get from "./target_pools/get.ts";
import target_pools_getHealth from "./target_pools/getHealth.ts";
import target_pools_insert from "./target_pools/insert.ts";
import target_pools_list from "./target_pools/list.ts";
import target_pools_removeHealthCheck from "./target_pools/removeHealthCheck.ts";
import target_pools_removeInstance from "./target_pools/removeInstance.ts";
import target_pools_setBackup from "./target_pools/setBackup.ts";
import target_pools_setSecurityPolicy from "./target_pools/setSecurityPolicy.ts";
import target_ssl_proxies_deleteOperation from "./target_ssl_proxies/deleteOperation.ts";
import target_ssl_proxies_get from "./target_ssl_proxies/get.ts";
import target_ssl_proxies_insert from "./target_ssl_proxies/insert.ts";
import target_ssl_proxies_list from "./target_ssl_proxies/list.ts";
import target_ssl_proxies_setBackendService from "./target_ssl_proxies/setBackendService.ts";
import target_ssl_proxies_setCertificateMap from "./target_ssl_proxies/setCertificateMap.ts";
import target_ssl_proxies_setProxyHeader from "./target_ssl_proxies/setProxyHeader.ts";
import target_ssl_proxies_setSslCertificates from "./target_ssl_proxies/setSslCertificates.ts";
import target_ssl_proxies_setSslPolicy from "./target_ssl_proxies/setSslPolicy.ts";
import target_tcp_proxies_aggregatedList from "./target_tcp_proxies/aggregatedList.ts";
import target_tcp_proxies_deleteOperation from "./target_tcp_proxies/deleteOperation.ts";
import target_tcp_proxies_get from "./target_tcp_proxies/get.ts";
import target_tcp_proxies_insert from "./target_tcp_proxies/insert.ts";
import target_tcp_proxies_list from "./target_tcp_proxies/list.ts";
import target_tcp_proxies_setBackendService from "./target_tcp_proxies/setBackendService.ts";
import target_tcp_proxies_setProxyHeader from "./target_tcp_proxies/setProxyHeader.ts";
import url_maps_aggregatedList from "./url_maps/aggregatedList.ts";
import url_maps_deleteOperation from "./url_maps/deleteOperation.ts";
import url_maps_get from "./url_maps/get.ts";
import url_maps_insert from "./url_maps/insert.ts";
import url_maps_invalidateCache from "./url_maps/invalidateCache.ts";
import url_maps_list from "./url_maps/list.ts";
import url_maps_patch from "./url_maps/patch.ts";
import url_maps_update from "./url_maps/update.ts";
import url_maps_validate from "./url_maps/validate.ts";

export const blocks = {
  backend_buckets_addSignedUrlKey: backend_buckets_addSignedUrlKey,
  backend_buckets_deleteOperation: backend_buckets_deleteOperation,
  backend_buckets_deleteSignedUrlKey: backend_buckets_deleteSignedUrlKey,
  backend_buckets_get: backend_buckets_get,
  backend_buckets_insert: backend_buckets_insert,
  backend_buckets_list: backend_buckets_list,
  backend_buckets_patch: backend_buckets_patch,
  backend_buckets_setEdgeSecurityPolicy: backend_buckets_setEdgeSecurityPolicy,
  backend_buckets_update: backend_buckets_update,
  backend_services_addSignedUrlKey: backend_services_addSignedUrlKey,
  backend_services_aggregatedList: backend_services_aggregatedList,
  backend_services_deleteOperation: backend_services_deleteOperation,
  backend_services_deleteSignedUrlKey: backend_services_deleteSignedUrlKey,
  backend_services_get: backend_services_get,
  backend_services_getEffectiveSecurityPolicies:
    backend_services_getEffectiveSecurityPolicies,
  backend_services_getHealth: backend_services_getHealth,
  backend_services_insert: backend_services_insert,
  backend_services_list: backend_services_list,
  backend_services_listUsable: backend_services_listUsable,
  backend_services_patch: backend_services_patch,
  backend_services_setEdgeSecurityPolicy:
    backend_services_setEdgeSecurityPolicy,
  backend_services_setSecurityPolicy: backend_services_setSecurityPolicy,
  backend_services_update: backend_services_update,
  forwarding_rules_aggregatedList: forwarding_rules_aggregatedList,
  forwarding_rules_deleteOperation: forwarding_rules_deleteOperation,
  forwarding_rules_get: forwarding_rules_get,
  forwarding_rules_insert: forwarding_rules_insert,
  forwarding_rules_list: forwarding_rules_list,
  forwarding_rules_patch: forwarding_rules_patch,
  forwarding_rules_setLabels: forwarding_rules_setLabels,
  forwarding_rules_setTarget: forwarding_rules_setTarget,
  global_forwarding_rules_deleteOperation:
    global_forwarding_rules_deleteOperation,
  global_forwarding_rules_get: global_forwarding_rules_get,
  global_forwarding_rules_insert: global_forwarding_rules_insert,
  global_forwarding_rules_list: global_forwarding_rules_list,
  global_forwarding_rules_patch: global_forwarding_rules_patch,
  global_forwarding_rules_setLabels: global_forwarding_rules_setLabels,
  global_forwarding_rules_setTarget: global_forwarding_rules_setTarget,
  health_checks_aggregatedList: health_checks_aggregatedList,
  health_checks_deleteOperation: health_checks_deleteOperation,
  health_checks_get: health_checks_get,
  health_checks_insert: health_checks_insert,
  health_checks_list: health_checks_list,
  health_checks_patch: health_checks_patch,
  health_checks_update: health_checks_update,
  region_backend_services_deleteOperation:
    region_backend_services_deleteOperation,
  region_backend_services_get: region_backend_services_get,
  region_backend_services_getHealth: region_backend_services_getHealth,
  region_backend_services_insert: region_backend_services_insert,
  region_backend_services_list: region_backend_services_list,
  region_backend_services_listUsable: region_backend_services_listUsable,
  region_backend_services_patch: region_backend_services_patch,
  region_backend_services_setSecurityPolicy:
    region_backend_services_setSecurityPolicy,
  region_backend_services_update: region_backend_services_update,
  region_health_checks_deleteOperation: region_health_checks_deleteOperation,
  region_health_checks_get: region_health_checks_get,
  region_health_checks_insert: region_health_checks_insert,
  region_health_checks_list: region_health_checks_list,
  region_health_checks_patch: region_health_checks_patch,
  region_health_checks_update: region_health_checks_update,
  region_target_http_proxies_deleteOperation:
    region_target_http_proxies_deleteOperation,
  region_target_http_proxies_get: region_target_http_proxies_get,
  region_target_http_proxies_insert: region_target_http_proxies_insert,
  region_target_http_proxies_list: region_target_http_proxies_list,
  region_target_http_proxies_setUrlMap: region_target_http_proxies_setUrlMap,
  region_target_https_proxies_deleteOperation:
    region_target_https_proxies_deleteOperation,
  region_target_https_proxies_get: region_target_https_proxies_get,
  region_target_https_proxies_insert: region_target_https_proxies_insert,
  region_target_https_proxies_list: region_target_https_proxies_list,
  region_target_https_proxies_patch: region_target_https_proxies_patch,
  region_target_https_proxies_setSslCertificates:
    region_target_https_proxies_setSslCertificates,
  region_target_https_proxies_setUrlMap: region_target_https_proxies_setUrlMap,
  region_target_tcp_proxies_deleteOperation:
    region_target_tcp_proxies_deleteOperation,
  region_target_tcp_proxies_get: region_target_tcp_proxies_get,
  region_target_tcp_proxies_insert: region_target_tcp_proxies_insert,
  region_target_tcp_proxies_list: region_target_tcp_proxies_list,
  region_url_maps_deleteOperation: region_url_maps_deleteOperation,
  region_url_maps_get: region_url_maps_get,
  region_url_maps_insert: region_url_maps_insert,
  region_url_maps_list: region_url_maps_list,
  region_url_maps_patch: region_url_maps_patch,
  region_url_maps_update: region_url_maps_update,
  region_url_maps_validate: region_url_maps_validate,
  target_grpc_proxies_deleteOperation: target_grpc_proxies_deleteOperation,
  target_grpc_proxies_get: target_grpc_proxies_get,
  target_grpc_proxies_insert: target_grpc_proxies_insert,
  target_grpc_proxies_list: target_grpc_proxies_list,
  target_grpc_proxies_patch: target_grpc_proxies_patch,
  target_http_proxies_aggregatedList: target_http_proxies_aggregatedList,
  target_http_proxies_deleteOperation: target_http_proxies_deleteOperation,
  target_http_proxies_get: target_http_proxies_get,
  target_http_proxies_insert: target_http_proxies_insert,
  target_http_proxies_list: target_http_proxies_list,
  target_http_proxies_patch: target_http_proxies_patch,
  target_http_proxies_setUrlMap: target_http_proxies_setUrlMap,
  target_https_proxies_aggregatedList: target_https_proxies_aggregatedList,
  target_https_proxies_deleteOperation: target_https_proxies_deleteOperation,
  target_https_proxies_get: target_https_proxies_get,
  target_https_proxies_insert: target_https_proxies_insert,
  target_https_proxies_list: target_https_proxies_list,
  target_https_proxies_patch: target_https_proxies_patch,
  target_https_proxies_setCertificateMap:
    target_https_proxies_setCertificateMap,
  target_https_proxies_setQuicOverride: target_https_proxies_setQuicOverride,
  target_https_proxies_setSslCertificates:
    target_https_proxies_setSslCertificates,
  target_https_proxies_setSslPolicy: target_https_proxies_setSslPolicy,
  target_https_proxies_setUrlMap: target_https_proxies_setUrlMap,
  target_instances_aggregatedList: target_instances_aggregatedList,
  target_instances_deleteOperation: target_instances_deleteOperation,
  target_instances_get: target_instances_get,
  target_instances_insert: target_instances_insert,
  target_instances_list: target_instances_list,
  target_instances_setSecurityPolicy: target_instances_setSecurityPolicy,
  target_pools_addHealthCheck: target_pools_addHealthCheck,
  target_pools_addInstance: target_pools_addInstance,
  target_pools_aggregatedList: target_pools_aggregatedList,
  target_pools_deleteOperation: target_pools_deleteOperation,
  target_pools_get: target_pools_get,
  target_pools_getHealth: target_pools_getHealth,
  target_pools_insert: target_pools_insert,
  target_pools_list: target_pools_list,
  target_pools_removeHealthCheck: target_pools_removeHealthCheck,
  target_pools_removeInstance: target_pools_removeInstance,
  target_pools_setBackup: target_pools_setBackup,
  target_pools_setSecurityPolicy: target_pools_setSecurityPolicy,
  target_ssl_proxies_deleteOperation: target_ssl_proxies_deleteOperation,
  target_ssl_proxies_get: target_ssl_proxies_get,
  target_ssl_proxies_insert: target_ssl_proxies_insert,
  target_ssl_proxies_list: target_ssl_proxies_list,
  target_ssl_proxies_setBackendService: target_ssl_proxies_setBackendService,
  target_ssl_proxies_setCertificateMap: target_ssl_proxies_setCertificateMap,
  target_ssl_proxies_setProxyHeader: target_ssl_proxies_setProxyHeader,
  target_ssl_proxies_setSslCertificates: target_ssl_proxies_setSslCertificates,
  target_ssl_proxies_setSslPolicy: target_ssl_proxies_setSslPolicy,
  target_tcp_proxies_aggregatedList: target_tcp_proxies_aggregatedList,
  target_tcp_proxies_deleteOperation: target_tcp_proxies_deleteOperation,
  target_tcp_proxies_get: target_tcp_proxies_get,
  target_tcp_proxies_insert: target_tcp_proxies_insert,
  target_tcp_proxies_list: target_tcp_proxies_list,
  target_tcp_proxies_setBackendService: target_tcp_proxies_setBackendService,
  target_tcp_proxies_setProxyHeader: target_tcp_proxies_setProxyHeader,
  url_maps_aggregatedList: url_maps_aggregatedList,
  url_maps_deleteOperation: url_maps_deleteOperation,
  url_maps_get: url_maps_get,
  url_maps_insert: url_maps_insert,
  url_maps_invalidateCache: url_maps_invalidateCache,
  url_maps_list: url_maps_list,
  url_maps_patch: url_maps_patch,
  url_maps_update: url_maps_update,
  url_maps_validate: url_maps_validate,
};
