import deleteBucket from "./buckets/deleteBucket.ts";
import getBucket from "./buckets/getBucket.ts";
import createBucket from "./buckets/createBucket.ts";
import listBuckets from "./buckets/listBuckets.ts";
import lockBucketRetentionPolicy from "./buckets/lockBucketRetentionPolicy.ts";
import getIamPolicy from "./iam/getIamPolicy.ts";
import setIamPolicy from "./iam/setIamPolicy.ts";
import testIamPermissions from "./iam/testIamPermissions.ts";
import updateBucket from "./buckets/updateBucket.ts";
import composeObject from "./objects/composeObject.ts";
import deleteObject from "./objects/deleteObject.ts";
import restoreObject from "./objects/restoreObject.ts";
import cancelResumableWrite from "./objects/cancelResumableWrite.ts";
import getObject from "./objects/getObject.ts";
import updateObject from "./objects/updateObject.ts";
import listObjects from "./objects/listObjects.ts";
import rewriteObject from "./objects/rewriteObject.ts";
import startResumableWrite from "./objects/startResumableWrite.ts";
import queryWriteStatus from "./objects/queryWriteStatus.ts";
import moveObject from "./objects/moveObject.ts";

export const blocks = {
  buckets_deleteBucket: deleteBucket,
  buckets_getBucket: getBucket,
  buckets_createBucket: createBucket,
  buckets_listBuckets: listBuckets,
  buckets_lockBucketRetentionPolicy: lockBucketRetentionPolicy,
  iam_getIamPolicy: getIamPolicy,
  iam_setIamPolicy: setIamPolicy,
  iam_testIamPermissions: testIamPermissions,
  buckets_updateBucket: updateBucket,
  objects_composeObject: composeObject,
  objects_deleteObject: deleteObject,
  objects_restoreObject: restoreObject,
  objects_cancelResumableWrite: cancelResumableWrite,
  objects_getObject: getObject,
  objects_updateObject: updateObject,
  objects_listObjects: listObjects,
  objects_rewriteObject: rewriteObject,
  objects_startResumableWrite: startResumableWrite,
  objects_queryWriteStatus: queryWriteStatus,
  objects_moveObject: moveObject,
};
