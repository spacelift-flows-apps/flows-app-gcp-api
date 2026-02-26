import schemas_commitSchema from "./schemas/commitSchema.ts";
import schemas_createSchema from "./schemas/createSchema.ts";
import schemas_deleteSchema from "./schemas/deleteSchema.ts";
import schemas_deleteSchemaRevision from "./schemas/deleteSchemaRevision.ts";
import schemas_getSchema from "./schemas/getSchema.ts";
import schemas_listSchemaRevisions from "./schemas/listSchemaRevisions.ts";
import schemas_listSchemas from "./schemas/listSchemas.ts";
import schemas_rollbackSchema from "./schemas/rollbackSchema.ts";
import schemas_validateMessage from "./schemas/validateMessage.ts";
import schemas_validateSchema from "./schemas/validateSchema.ts";
import snapshots_createSnapshot from "./snapshots/createSnapshot.ts";
import snapshots_deleteSnapshot from "./snapshots/deleteSnapshot.ts";
import snapshots_getSnapshot from "./snapshots/getSnapshot.ts";
import snapshots_listSnapshots from "./snapshots/listSnapshots.ts";
import snapshots_updateSnapshot from "./snapshots/updateSnapshot.ts";
import subscriptions_acknowledge from "./subscriptions/acknowledge.ts";
import subscriptions_createSubscription from "./subscriptions/createSubscription.ts";
import subscriptions_deleteSubscription from "./subscriptions/deleteSubscription.ts";
import subscriptions_getSubscription from "./subscriptions/getSubscription.ts";
import subscriptions_listSubscriptions from "./subscriptions/listSubscriptions.ts";
import subscriptions_modifyAckDeadline from "./subscriptions/modifyAckDeadline.ts";
import subscriptions_modifyPushConfig from "./subscriptions/modifyPushConfig.ts";
import subscriptions_pull from "./subscriptions/pull.ts";
import subscriptions_seek from "./subscriptions/seek.ts";
import subscriptions_updateSubscription from "./subscriptions/updateSubscription.ts";
import topics_createTopic from "./topics/createTopic.ts";
import topics_deleteTopic from "./topics/deleteTopic.ts";
import topics_detachSubscription from "./topics/detachSubscription.ts";
import topics_getTopic from "./topics/getTopic.ts";
import topics_listTopics from "./topics/listTopics.ts";
import topics_listTopicSnapshots from "./topics/listTopicSnapshots.ts";
import topics_listTopicSubscriptions from "./topics/listTopicSubscriptions.ts";
import topics_publish from "./topics/publish.ts";
import topics_updateTopic from "./topics/updateTopic.ts";

export const blocks = {
  schemas_commitSchema: schemas_commitSchema,
  schemas_createSchema: schemas_createSchema,
  schemas_deleteSchema: schemas_deleteSchema,
  schemas_deleteSchemaRevision: schemas_deleteSchemaRevision,
  schemas_getSchema: schemas_getSchema,
  schemas_listSchemaRevisions: schemas_listSchemaRevisions,
  schemas_listSchemas: schemas_listSchemas,
  schemas_rollbackSchema: schemas_rollbackSchema,
  schemas_validateMessage: schemas_validateMessage,
  schemas_validateSchema: schemas_validateSchema,
  snapshots_createSnapshot: snapshots_createSnapshot,
  snapshots_deleteSnapshot: snapshots_deleteSnapshot,
  snapshots_getSnapshot: snapshots_getSnapshot,
  snapshots_listSnapshots: snapshots_listSnapshots,
  snapshots_updateSnapshot: snapshots_updateSnapshot,
  subscriptions_acknowledge: subscriptions_acknowledge,
  subscriptions_createSubscription: subscriptions_createSubscription,
  subscriptions_deleteSubscription: subscriptions_deleteSubscription,
  subscriptions_getSubscription: subscriptions_getSubscription,
  subscriptions_listSubscriptions: subscriptions_listSubscriptions,
  subscriptions_modifyAckDeadline: subscriptions_modifyAckDeadline,
  subscriptions_modifyPushConfig: subscriptions_modifyPushConfig,
  subscriptions_pull: subscriptions_pull,
  subscriptions_seek: subscriptions_seek,
  subscriptions_updateSubscription: subscriptions_updateSubscription,
  topics_createTopic: topics_createTopic,
  topics_deleteTopic: topics_deleteTopic,
  topics_detachSubscription: topics_detachSubscription,
  topics_getTopic: topics_getTopic,
  topics_listTopics: topics_listTopics,
  topics_listTopicSnapshots: topics_listTopicSnapshots,
  topics_listTopicSubscriptions: topics_listTopicSubscriptions,
  topics_publish: topics_publish,
  topics_updateTopic: topics_updateTopic,
};
