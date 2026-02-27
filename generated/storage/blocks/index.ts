import buckets_createBucket from "./buckets/createBucket.ts";
import buckets_deleteBucket from "./buckets/deleteBucket.ts";
import buckets_getBucket from "./buckets/getBucket.ts";
import buckets_listBuckets from "./buckets/listBuckets.ts";
import buckets_lockBucketRetentionPolicy from "./buckets/lockBucketRetentionPolicy.ts";
import buckets_updateBucket from "./buckets/updateBucket.ts";
import objects_cancelResumableWrite from "./objects/cancelResumableWrite.ts";
import objects_composeObject from "./objects/composeObject.ts";
import objects_deleteObject from "./objects/deleteObject.ts";
import objects_getObject from "./objects/getObject.ts";
import objects_listObjects from "./objects/listObjects.ts";
import objects_moveObject from "./objects/moveObject.ts";
import objects_queryWriteStatus from "./objects/queryWriteStatus.ts";
import objects_restoreObject from "./objects/restoreObject.ts";
import objects_rewriteObject from "./objects/rewriteObject.ts";
import objects_startResumableWrite from "./objects/startResumableWrite.ts";
import objects_updateObject from "./objects/updateObject.ts";

export const blocks = {
  buckets_createBucket: buckets_createBucket,
  buckets_deleteBucket: buckets_deleteBucket,
  buckets_getBucket: buckets_getBucket,
  buckets_listBuckets: buckets_listBuckets,
  buckets_lockBucketRetentionPolicy: buckets_lockBucketRetentionPolicy,
  buckets_updateBucket: buckets_updateBucket,
  objects_cancelResumableWrite: objects_cancelResumableWrite,
  objects_composeObject: objects_composeObject,
  objects_deleteObject: objects_deleteObject,
  objects_getObject: objects_getObject,
  objects_listObjects: objects_listObjects,
  objects_moveObject: objects_moveObject,
  objects_queryWriteStatus: objects_queryWriteStatus,
  objects_restoreObject: objects_restoreObject,
  objects_rewriteObject: objects_rewriteObject,
  objects_startResumableWrite: objects_startResumableWrite,
  objects_updateObject: objects_updateObject,
};
