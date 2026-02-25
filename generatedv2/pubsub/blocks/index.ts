import createSchema from "./schemas/createSchema.ts";
import getSchema from "./schemas/getSchema.ts";
import listSchemas from "./schemas/listSchemas.ts";
import listSchemaRevisions from "./schemas/listSchemaRevisions.ts";
import commitSchema from "./schemas/commitSchema.ts";
import rollbackSchema from "./schemas/rollbackSchema.ts";
import deleteSchemaRevision from "./schemas/deleteSchemaRevision.ts";
import deleteSchema from "./schemas/deleteSchema.ts";
import validateSchema from "./schemas/validateSchema.ts";
import validateMessage from "./schemas/validateMessage.ts";
import createTopic from "./topics/createTopic.ts";
import updateTopic from "./topics/updateTopic.ts";
import publish from "./topics/publish.ts";
import getTopic from "./topics/getTopic.ts";
import listTopics from "./topics/listTopics.ts";
import listTopicSubscriptions from "./topics/listTopicSubscriptions.ts";
import listTopicSnapshots from "./topics/listTopicSnapshots.ts";
import deleteTopic from "./topics/deleteTopic.ts";
import detachSubscription from "./topics/detachSubscription.ts";
import createSubscription from "./subscriptions/createSubscription.ts";
import getSubscription from "./subscriptions/getSubscription.ts";
import updateSubscription from "./subscriptions/updateSubscription.ts";
import listSubscriptions from "./subscriptions/listSubscriptions.ts";
import deleteSubscription from "./subscriptions/deleteSubscription.ts";
import modifyAckDeadline from "./subscriptions/modifyAckDeadline.ts";
import acknowledge from "./subscriptions/acknowledge.ts";
import pull from "./subscriptions/pull.ts";
import modifyPushConfig from "./subscriptions/modifyPushConfig.ts";
import getSnapshot from "./snapshots/getSnapshot.ts";
import listSnapshots from "./snapshots/listSnapshots.ts";
import createSnapshot from "./snapshots/createSnapshot.ts";
import updateSnapshot from "./snapshots/updateSnapshot.ts";
import deleteSnapshot from "./snapshots/deleteSnapshot.ts";
import seek from "./subscriptions/seek.ts";

export const blocks = {
  schemas_createSchema: createSchema,
  schemas_getSchema: getSchema,
  schemas_listSchemas: listSchemas,
  schemas_listSchemaRevisions: listSchemaRevisions,
  schemas_commitSchema: commitSchema,
  schemas_rollbackSchema: rollbackSchema,
  schemas_deleteSchemaRevision: deleteSchemaRevision,
  schemas_deleteSchema: deleteSchema,
  schemas_validateSchema: validateSchema,
  schemas_validateMessage: validateMessage,
  topics_createTopic: createTopic,
  topics_updateTopic: updateTopic,
  topics_publish: publish,
  topics_getTopic: getTopic,
  topics_listTopics: listTopics,
  topics_listTopicSubscriptions: listTopicSubscriptions,
  topics_listTopicSnapshots: listTopicSnapshots,
  topics_deleteTopic: deleteTopic,
  topics_detachSubscription: detachSubscription,
  subscriptions_createSubscription: createSubscription,
  subscriptions_getSubscription: getSubscription,
  subscriptions_updateSubscription: updateSubscription,
  subscriptions_listSubscriptions: listSubscriptions,
  subscriptions_deleteSubscription: deleteSubscription,
  subscriptions_modifyAckDeadline: modifyAckDeadline,
  subscriptions_acknowledge: acknowledge,
  subscriptions_pull: pull,
  subscriptions_modifyPushConfig: modifyPushConfig,
  snapshots_getSnapshot: getSnapshot,
  snapshots_listSnapshots: listSnapshots,
  snapshots_createSnapshot: createSnapshot,
  snapshots_updateSnapshot: updateSnapshot,
  snapshots_deleteSnapshot: deleteSnapshot,
  subscriptions_seek: seek,
};
