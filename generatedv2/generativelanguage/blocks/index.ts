import cached_content_createCachedContent from "./cached_content/createCachedContent.ts";
import cached_content_deleteCachedContent from "./cached_content/deleteCachedContent.ts";
import cached_content_getCachedContent from "./cached_content/getCachedContent.ts";
import cached_content_listCachedContents from "./cached_content/listCachedContents.ts";
import cached_content_updateCachedContent from "./cached_content/updateCachedContent.ts";
import chunks_batchCreateChunks from "./chunks/batchCreateChunks.ts";
import chunks_batchDeleteChunks from "./chunks/batchDeleteChunks.ts";
import chunks_batchUpdateChunks from "./chunks/batchUpdateChunks.ts";
import chunks_createChunk from "./chunks/createChunk.ts";
import chunks_deleteChunk from "./chunks/deleteChunk.ts";
import chunks_getChunk from "./chunks/getChunk.ts";
import chunks_listChunks from "./chunks/listChunks.ts";
import chunks_updateChunk from "./chunks/updateChunk.ts";
import corpora_createCorpus from "./corpora/createCorpus.ts";
import corpora_deleteCorpus from "./corpora/deleteCorpus.ts";
import corpora_getCorpus from "./corpora/getCorpus.ts";
import corpora_listCorpora from "./corpora/listCorpora.ts";
import corpora_queryCorpus from "./corpora/queryCorpus.ts";
import corpora_updateCorpus from "./corpora/updateCorpus.ts";
import documents_createDocument from "./documents/createDocument.ts";
import documents_deleteDocument from "./documents/deleteDocument.ts";
import documents_getDocument from "./documents/getDocument.ts";
import documents_listDocuments from "./documents/listDocuments.ts";
import documents_queryDocument from "./documents/queryDocument.ts";
import documents_updateDocument from "./documents/updateDocument.ts";
import embeddings_batchEmbedContents from "./embeddings/batchEmbedContents.ts";
import embeddings_embedContent from "./embeddings/embedContent.ts";
import files_createFile from "./files/createFile.ts";
import files_deleteFile from "./files/deleteFile.ts";
import files_downloadFile from "./files/downloadFile.ts";
import files_getFile from "./files/getFile.ts";
import files_listFiles from "./files/listFiles.ts";
import generation_countTokens from "./generation/countTokens.ts";
import generation_generateAnswer from "./generation/generateAnswer.ts";
import generation_generateContent from "./generation/generateContent.ts";
import models_getModel from "./models/getModel.ts";
import models_listModels from "./models/listModels.ts";
import permissions_createPermission from "./permissions/createPermission.ts";
import permissions_deletePermission from "./permissions/deletePermission.ts";
import permissions_getPermission from "./permissions/getPermission.ts";
import permissions_listPermissions from "./permissions/listPermissions.ts";
import permissions_transferOwnership from "./permissions/transferOwnership.ts";
import permissions_updatePermission from "./permissions/updatePermission.ts";
import tuned_models_createTunedModel from "./tuned_models/createTunedModel.ts";
import tuned_models_deleteTunedModel from "./tuned_models/deleteTunedModel.ts";
import tuned_models_getTunedModel from "./tuned_models/getTunedModel.ts";
import tuned_models_listTunedModels from "./tuned_models/listTunedModels.ts";
import tuned_models_updateTunedModel from "./tuned_models/updateTunedModel.ts";

export const blocks = {
  cached_content_createCachedContent: cached_content_createCachedContent,
  cached_content_deleteCachedContent: cached_content_deleteCachedContent,
  cached_content_getCachedContent: cached_content_getCachedContent,
  cached_content_listCachedContents: cached_content_listCachedContents,
  cached_content_updateCachedContent: cached_content_updateCachedContent,
  chunks_batchCreateChunks: chunks_batchCreateChunks,
  chunks_batchDeleteChunks: chunks_batchDeleteChunks,
  chunks_batchUpdateChunks: chunks_batchUpdateChunks,
  chunks_createChunk: chunks_createChunk,
  chunks_deleteChunk: chunks_deleteChunk,
  chunks_getChunk: chunks_getChunk,
  chunks_listChunks: chunks_listChunks,
  chunks_updateChunk: chunks_updateChunk,
  corpora_createCorpus: corpora_createCorpus,
  corpora_deleteCorpus: corpora_deleteCorpus,
  corpora_getCorpus: corpora_getCorpus,
  corpora_listCorpora: corpora_listCorpora,
  corpora_queryCorpus: corpora_queryCorpus,
  corpora_updateCorpus: corpora_updateCorpus,
  documents_createDocument: documents_createDocument,
  documents_deleteDocument: documents_deleteDocument,
  documents_getDocument: documents_getDocument,
  documents_listDocuments: documents_listDocuments,
  documents_queryDocument: documents_queryDocument,
  documents_updateDocument: documents_updateDocument,
  embeddings_batchEmbedContents: embeddings_batchEmbedContents,
  embeddings_embedContent: embeddings_embedContent,
  files_createFile: files_createFile,
  files_deleteFile: files_deleteFile,
  files_downloadFile: files_downloadFile,
  files_getFile: files_getFile,
  files_listFiles: files_listFiles,
  generation_countTokens: generation_countTokens,
  generation_generateAnswer: generation_generateAnswer,
  generation_generateContent: generation_generateContent,
  models_getModel: models_getModel,
  models_listModels: models_listModels,
  permissions_createPermission: permissions_createPermission,
  permissions_deletePermission: permissions_deletePermission,
  permissions_getPermission: permissions_getPermission,
  permissions_listPermissions: permissions_listPermissions,
  permissions_transferOwnership: permissions_transferOwnership,
  permissions_updatePermission: permissions_updatePermission,
  tuned_models_createTunedModel: tuned_models_createTunedModel,
  tuned_models_deleteTunedModel: tuned_models_deleteTunedModel,
  tuned_models_getTunedModel: tuned_models_getTunedModel,
  tuned_models_listTunedModels: tuned_models_listTunedModels,
  tuned_models_updateTunedModel: tuned_models_updateTunedModel,
};
