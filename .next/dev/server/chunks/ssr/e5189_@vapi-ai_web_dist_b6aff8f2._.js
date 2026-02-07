module.exports = [
"[project]/projects/tartanhacks/node_modules/@vapi-ai/web/dist/api.js [app-ssr] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

/* eslint-disable */ /* tslint:disable */ // @ts-nocheck
/*
 * ---------------------------------------------------------------
 * ## THIS FILE WAS GENERATED VIA SWAGGER-TYPESCRIPT-API        ##
 * ##                                                           ##
 * ## AUTHOR: acacode                                           ##
 * ## SOURCE: https://github.com/acacode/swagger-typescript-api ##
 * ---------------------------------------------------------------
 */ Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.Api = exports.HttpClient = exports.ContentType = void 0;
var ContentType;
(function(ContentType) {
    ContentType["Json"] = "application/json";
    ContentType["JsonApi"] = "application/vnd.api+json";
    ContentType["FormData"] = "multipart/form-data";
    ContentType["UrlEncoded"] = "application/x-www-form-urlencoded";
    ContentType["Text"] = "text/plain";
})(ContentType || (exports.ContentType = ContentType = {}));
class HttpClient {
    baseUrl = "https://api.vapi.ai";
    securityData = null;
    securityWorker;
    abortControllers = new Map();
    customFetch = (...fetchParams)=>fetch(...fetchParams);
    baseApiParams = {
        credentials: "same-origin",
        headers: {},
        redirect: "follow",
        referrerPolicy: "no-referrer"
    };
    constructor(apiConfig = {}){
        Object.assign(this, apiConfig);
    }
    setSecurityData = (data)=>{
        this.securityData = data;
    };
    encodeQueryParam(key, value) {
        const encodedKey = encodeURIComponent(key);
        return `${encodedKey}=${encodeURIComponent(typeof value === "number" ? value : `${value}`)}`;
    }
    addQueryParam(query, key) {
        return this.encodeQueryParam(key, query[key]);
    }
    addArrayQueryParam(query, key) {
        const value = query[key];
        return value.map((v)=>this.encodeQueryParam(key, v)).join("&");
    }
    toQueryString(rawQuery) {
        const query = rawQuery || {};
        const keys = Object.keys(query).filter((key)=>"undefined" !== typeof query[key]);
        return keys.map((key)=>Array.isArray(query[key]) ? this.addArrayQueryParam(query, key) : this.addQueryParam(query, key)).join("&");
    }
    addQueryParams(rawQuery) {
        const queryString = this.toQueryString(rawQuery);
        return queryString ? `?${queryString}` : "";
    }
    contentFormatters = {
        [ContentType.Json]: (input)=>input !== null && (typeof input === "object" || typeof input === "string") ? JSON.stringify(input) : input,
        [ContentType.JsonApi]: (input)=>input !== null && (typeof input === "object" || typeof input === "string") ? JSON.stringify(input) : input,
        [ContentType.Text]: (input)=>input !== null && typeof input !== "string" ? JSON.stringify(input) : input,
        [ContentType.FormData]: (input)=>{
            if (input instanceof FormData) {
                return input;
            }
            return Object.keys(input || {}).reduce((formData, key)=>{
                const property = input[key];
                formData.append(key, property instanceof Blob ? property : typeof property === "object" && property !== null ? JSON.stringify(property) : `${property}`);
                return formData;
            }, new FormData());
        },
        [ContentType.UrlEncoded]: (input)=>this.toQueryString(input)
    };
    mergeRequestParams(params1, params2) {
        return {
            ...this.baseApiParams,
            ...params1,
            ...params2 || {},
            headers: {
                ...this.baseApiParams.headers || {},
                ...params1.headers || {},
                ...params2 && params2.headers || {}
            }
        };
    }
    createAbortSignal = (cancelToken)=>{
        if (this.abortControllers.has(cancelToken)) {
            const abortController = this.abortControllers.get(cancelToken);
            if (abortController) {
                return abortController.signal;
            }
            return void 0;
        }
        const abortController = new AbortController();
        this.abortControllers.set(cancelToken, abortController);
        return abortController.signal;
    };
    abortRequest = (cancelToken)=>{
        const abortController = this.abortControllers.get(cancelToken);
        if (abortController) {
            abortController.abort();
            this.abortControllers.delete(cancelToken);
        }
    };
    request = async ({ body, secure, path, type, query, format, baseUrl, cancelToken, ...params })=>{
        const secureParams = (typeof secure === "boolean" ? secure : this.baseApiParams.secure) && this.securityWorker && await this.securityWorker(this.securityData) || {};
        const requestParams = this.mergeRequestParams(params, secureParams);
        const queryString = query && this.toQueryString(query);
        const payloadFormatter = this.contentFormatters[type || ContentType.Json];
        const responseFormat = format || requestParams.format;
        return this.customFetch(`${baseUrl || this.baseUrl || ""}${path}${queryString ? `?${queryString}` : ""}`, {
            ...requestParams,
            headers: {
                ...requestParams.headers || {},
                ...type && type !== ContentType.FormData ? {
                    "Content-Type": type
                } : {}
            },
            signal: (cancelToken ? this.createAbortSignal(cancelToken) : requestParams.signal) || null,
            body: typeof body === "undefined" || body === null ? null : payloadFormatter(body)
        }).then(async (response)=>{
            const r = response;
            r.data = null;
            r.error = null;
            const responseToParse = responseFormat ? response.clone() : response;
            const data = !responseFormat ? r : await responseToParse[responseFormat]().then((data)=>{
                if (r.ok) {
                    r.data = data;
                } else {
                    r.error = data;
                }
                return r;
            }).catch((e)=>{
                r.error = e;
                return r;
            });
            if (cancelToken) {
                this.abortControllers.delete(cancelToken);
            }
            if (!response.ok) throw data;
            return data;
        });
    };
}
exports.HttpClient = HttpClient;
/**
 * @title Vapi API
 * @version 1.0
 * @baseUrl https://api.vapi.ai
 * @contact
 *
 * Voice AI for developers.
 */ class Api extends HttpClient {
    assistant = {
        /**
         * No description
         *
         * @tags Assistants
         * @name AssistantControllerCreate
         * @summary Create Assistant
         * @request POST:/assistant
         * @secure
         */ assistantControllerCreate: (data, params = {})=>this.request({
                path: `/assistant`,
                method: "POST",
                body: data,
                secure: true,
                type: ContentType.Json,
                format: "json",
                ...params
            }),
        /**
         * No description
         *
         * @tags Assistants
         * @name AssistantControllerFindAll
         * @summary List Assistants
         * @request GET:/assistant
         * @secure
         */ assistantControllerFindAll: (query, params = {})=>this.request({
                path: `/assistant`,
                method: "GET",
                query: query,
                secure: true,
                format: "json",
                ...params
            }),
        /**
         * No description
         *
         * @tags Assistants
         * @name AssistantControllerFindOne
         * @summary Get Assistant
         * @request GET:/assistant/{id}
         * @secure
         */ assistantControllerFindOne: (id, params = {})=>this.request({
                path: `/assistant/${id}`,
                method: "GET",
                secure: true,
                format: "json",
                ...params
            }),
        /**
         * No description
         *
         * @tags Assistants
         * @name AssistantControllerUpdate
         * @summary Update Assistant
         * @request PATCH:/assistant/{id}
         * @secure
         */ assistantControllerUpdate: (id, data, params = {})=>this.request({
                path: `/assistant/${id}`,
                method: "PATCH",
                body: data,
                secure: true,
                type: ContentType.Json,
                format: "json",
                ...params
            }),
        /**
         * No description
         *
         * @tags Assistants
         * @name AssistantControllerReplace
         * @summary Replace Assistant
         * @request PUT:/assistant/{id}
         * @secure
         */ assistantControllerReplace: (id, data, params = {})=>this.request({
                path: `/assistant/${id}`,
                method: "PUT",
                body: data,
                secure: true,
                type: ContentType.Json,
                format: "json",
                ...params
            }),
        /**
         * No description
         *
         * @tags Assistants
         * @name AssistantControllerRemove
         * @summary Delete Assistant
         * @request DELETE:/assistant/{id}
         * @secure
         */ assistantControllerRemove: (id, params = {})=>this.request({
                path: `/assistant/${id}`,
                method: "DELETE",
                secure: true,
                format: "json",
                ...params
            }),
        /**
         * No description
         *
         * @tags Assistants
         * @name AssistantControllerFindVersions
         * @summary List Assistant Versions
         * @request GET:/assistant/{id}/version
         * @secure
         */ assistantControllerFindVersions: (id, query, params = {})=>this.request({
                path: `/assistant/${id}/version`,
                method: "GET",
                query: query,
                secure: true,
                format: "json",
                ...params
            })
    };
    v2 = {
        /**
         * No description
         *
         * @tags Assistants
         * @name AssistantControllerFindAllPaginated
         * @summary List Assistants with pagination
         * @request GET:/v2/assistant
         * @secure
         */ assistantControllerFindAllPaginated: (query, params = {})=>this.request({
                path: `/v2/assistant`,
                method: "GET",
                query: query,
                secure: true,
                format: "json",
                ...params
            }),
        /**
         * No description
         *
         * @tags Calls
         * @name CallControllerCallsExport
         * @summary Export Calls to CSV
         * @request GET:/v2/call/export
         * @secure
         */ callControllerCallsExport: (query, params = {})=>this.request({
                path: `/v2/call/export`,
                method: "GET",
                query: query,
                secure: true,
                ...params
            }),
        /**
         * No description
         *
         * @tags Calls
         * @name CallControllerFindAllPaginated
         * @summary List Calls
         * @request GET:/v2/call
         * @secure
         */ callControllerFindAllPaginated: (query, params = {})=>this.request({
                path: `/v2/call`,
                method: "GET",
                query: query,
                secure: true,
                format: "json",
                ...params
            }),
        /**
         * No description
         *
         * @tags Calls
         * @name CallControllerFindAllMetadataPaginated
         * @summary List Call Metadata
         * @request GET:/v2/call/metadata
         * @secure
         */ callControllerFindAllMetadataPaginated: (query, params = {})=>this.request({
                path: `/v2/call/metadata`,
                method: "GET",
                query: query,
                secure: true,
                format: "json",
                ...params
            }),
        /**
         * No description
         *
         * @tags Phone Numbers
         * @name PhoneNumberControllerFindAllPaginated
         * @summary List Phone Numbers
         * @request GET:/v2/phone-number
         * @secure
         */ phoneNumberControllerFindAllPaginated: (query, params = {})=>this.request({
                path: `/v2/phone-number`,
                method: "GET",
                query: query,
                secure: true,
                format: "json",
                ...params
            })
    };
    squad = {
        /**
         * No description
         *
         * @tags Squads
         * @name SquadControllerCreate
         * @summary Create Squad
         * @request POST:/squad
         * @secure
         */ squadControllerCreate: (data, params = {})=>this.request({
                path: `/squad`,
                method: "POST",
                body: data,
                secure: true,
                type: ContentType.Json,
                format: "json",
                ...params
            }),
        /**
         * No description
         *
         * @tags Squads
         * @name SquadControllerFindAll
         * @summary List Squads
         * @request GET:/squad
         * @secure
         */ squadControllerFindAll: (query, params = {})=>this.request({
                path: `/squad`,
                method: "GET",
                query: query,
                secure: true,
                format: "json",
                ...params
            }),
        /**
         * No description
         *
         * @tags Squads
         * @name SquadControllerFindOne
         * @summary Get Squad
         * @request GET:/squad/{id}
         * @secure
         */ squadControllerFindOne: (id, params = {})=>this.request({
                path: `/squad/${id}`,
                method: "GET",
                secure: true,
                format: "json",
                ...params
            }),
        /**
         * No description
         *
         * @tags Squads
         * @name SquadControllerUpdate
         * @summary Update Squad
         * @request PATCH:/squad/{id}
         * @secure
         */ squadControllerUpdate: (id, data, params = {})=>this.request({
                path: `/squad/${id}`,
                method: "PATCH",
                body: data,
                secure: true,
                type: ContentType.Json,
                format: "json",
                ...params
            }),
        /**
         * No description
         *
         * @tags Squads
         * @name SquadControllerRemove
         * @summary Delete Squad
         * @request DELETE:/squad/{id}
         * @secure
         */ squadControllerRemove: (id, params = {})=>this.request({
                path: `/squad/${id}`,
                method: "DELETE",
                secure: true,
                format: "json",
                ...params
            })
    };
    workflow = {
        /**
         * No description
         *
         * @tags Workflow
         * @name WorkflowControllerFindAll
         * @summary Get Workflows
         * @request GET:/workflow
         * @secure
         */ workflowControllerFindAll: (params = {})=>this.request({
                path: `/workflow`,
                method: "GET",
                secure: true,
                format: "json",
                ...params
            }),
        /**
         * No description
         *
         * @tags Workflow
         * @name WorkflowControllerCreate
         * @summary Create Workflow
         * @request POST:/workflow
         * @secure
         */ workflowControllerCreate: (data, params = {})=>this.request({
                path: `/workflow`,
                method: "POST",
                body: data,
                secure: true,
                type: ContentType.Json,
                format: "json",
                ...params
            }),
        /**
         * No description
         *
         * @tags Workflow
         * @name WorkflowControllerFindOne
         * @summary Get Workflow
         * @request GET:/workflow/{id}
         * @secure
         */ workflowControllerFindOne: (id, params = {})=>this.request({
                path: `/workflow/${id}`,
                method: "GET",
                secure: true,
                format: "json",
                ...params
            }),
        /**
         * No description
         *
         * @tags Workflow
         * @name WorkflowControllerDelete
         * @summary Delete Workflow
         * @request DELETE:/workflow/{id}
         * @secure
         */ workflowControllerDelete: (id, params = {})=>this.request({
                path: `/workflow/${id}`,
                method: "DELETE",
                secure: true,
                format: "json",
                ...params
            }),
        /**
         * No description
         *
         * @tags Workflow
         * @name WorkflowControllerUpdate
         * @summary Update Workflow
         * @request PATCH:/workflow/{id}
         * @secure
         */ workflowControllerUpdate: (id, data, params = {})=>this.request({
                path: `/workflow/${id}`,
                method: "PATCH",
                body: data,
                secure: true,
                type: ContentType.Json,
                format: "json",
                ...params
            })
    };
    call = {
        /**
         * No description
         *
         * @tags Calls
         * @name CallControllerCreate
         * @summary Create Call
         * @request POST:/call
         * @secure
         */ callControllerCreate: (data, params = {})=>this.request({
                path: `/call`,
                method: "POST",
                body: data,
                secure: true,
                type: ContentType.Json,
                format: "json",
                ...params
            }),
        /**
         * No description
         *
         * @tags Calls
         * @name CallControllerFindAll
         * @summary List Calls
         * @request GET:/call
         * @secure
         */ callControllerFindAll: (query, params = {})=>this.request({
                path: `/call`,
                method: "GET",
                query: query,
                secure: true,
                format: "json",
                ...params
            }),
        /**
         * No description
         *
         * @tags Calls
         * @name CallControllerFindOne
         * @summary Get Call
         * @request GET:/call/{id}
         * @secure
         */ callControllerFindOne: (id, params = {})=>this.request({
                path: `/call/${id}`,
                method: "GET",
                secure: true,
                format: "json",
                ...params
            }),
        /**
         * No description
         *
         * @tags Calls
         * @name CallControllerUpdate
         * @summary Update Call
         * @request PATCH:/call/{id}
         * @secure
         */ callControllerUpdate: (id, data, params = {})=>this.request({
                path: `/call/${id}`,
                method: "PATCH",
                body: data,
                secure: true,
                type: ContentType.Json,
                format: "json",
                ...params
            }),
        /**
         * No description
         *
         * @tags Calls
         * @name CallControllerDeleteCallData
         * @summary Delete Call Data
         * @request DELETE:/call/{id}
         * @secure
         */ callControllerDeleteCallData: (id, data, params = {})=>this.request({
                path: `/call/${id}`,
                method: "DELETE",
                body: data,
                secure: true,
                type: ContentType.Json,
                format: "json",
                ...params
            }),
        /**
         * No description
         *
         * @tags Calls
         * @name CallControllerCreatePhoneCall
         * @summary Create Phone Call
         * @request POST:/call/phone
         * @deprecated
         * @secure
         */ callControllerCreatePhoneCall: (data, params = {})=>this.request({
                path: `/call/phone`,
                method: "POST",
                body: data,
                secure: true,
                type: ContentType.Json,
                format: "json",
                ...params
            }),
        /**
         * No description
         *
         * @tags Calls
         * @name CallControllerCreateWebCall
         * @summary Create Web Call
         * @request POST:/call/web
         * @secure
         */ callControllerCreateWebCall: (data, params = {})=>this.request({
                path: `/call/web`,
                method: "POST",
                body: data,
                secure: true,
                type: ContentType.Json,
                format: "json",
                ...params
            })
    };
    chat = {
        /**
         * No description
         *
         * @tags Chats
         * @name ChatControllerListChats
         * @summary List Chats
         * @request GET:/chat
         * @secure
         */ chatControllerListChats: (query, params = {})=>this.request({
                path: `/chat`,
                method: "GET",
                query: query,
                secure: true,
                format: "json",
                ...params
            }),
        /**
         * @description Creates a new chat with optional SMS delivery via transport field. Requires at least one of: assistantId/assistant, sessionId, or previousChatId. Note: sessionId and previousChatId are mutually exclusive. Transport field enables SMS delivery with two modes: (1) New conversation - provide transport.phoneNumberId and transport.customer to create a new session, (2) Existing conversation - provide sessionId to use existing session data. Cannot specify both sessionId and transport fields together. The transport.useLLMGeneratedMessageForOutbound flag controls whether input is processed by LLM (true, default) or forwarded directly as SMS (false).
         *
         * @tags Chats
         * @name ChatControllerCreateChat
         * @summary Create Chat
         * @request POST:/chat
         * @secure
         */ chatControllerCreateChat: (data, params = {})=>this.request({
                path: `/chat`,
                method: "POST",
                body: data,
                secure: true,
                type: ContentType.Json,
                format: "json",
                ...params
            }),
        /**
         * No description
         *
         * @tags Chats
         * @name ChatControllerGetChat
         * @summary Get Chat
         * @request GET:/chat/{id}
         * @secure
         */ chatControllerGetChat: (id, params = {})=>this.request({
                path: `/chat/${id}`,
                method: "GET",
                secure: true,
                format: "json",
                ...params
            }),
        /**
         * No description
         *
         * @tags Chats
         * @name ChatControllerDeleteChat
         * @summary Delete Chat
         * @request DELETE:/chat/{id}
         * @secure
         */ chatControllerDeleteChat: (id, params = {})=>this.request({
                path: `/chat/${id}`,
                method: "DELETE",
                secure: true,
                format: "json",
                ...params
            }),
        /**
         * No description
         *
         * @tags Chats
         * @name ChatControllerCreateOpenAiChat
         * @summary Create Chat (OpenAI Compatible)
         * @request POST:/chat/responses
         * @secure
         */ chatControllerCreateOpenAiChat: (data, params = {})=>this.request({
                path: `/chat/responses`,
                method: "POST",
                body: data,
                secure: true,
                type: ContentType.Json,
                format: "json",
                ...params
            }),
        /**
         * No description
         *
         * @tags Chats
         * @name ChatControllerCreateWebChat
         * @summary Create WebChat
         * @request POST:/chat/web
         * @secure
         */ chatControllerCreateWebChat: (data, params = {})=>this.request({
                path: `/chat/web`,
                method: "POST",
                body: data,
                secure: true,
                type: ContentType.Json,
                format: "json",
                ...params
            }),
        /**
         * No description
         *
         * @tags Chats
         * @name ChatControllerCreateOpenAiWebChat
         * @summary Create WebChat (OpenAI Compatible)
         * @request POST:/chat/web/responses
         * @secure
         */ chatControllerCreateOpenAiWebChat: (data, params = {})=>this.request({
                path: `/chat/web/responses`,
                method: "POST",
                body: data,
                secure: true,
                type: ContentType.Json,
                format: "json",
                ...params
            })
    };
    campaign = {
        /**
         * No description
         *
         * @tags Campaigns
         * @name CampaignControllerCreate
         * @summary Create Campaign
         * @request POST:/campaign
         * @secure
         */ campaignControllerCreate: (data, params = {})=>this.request({
                path: `/campaign`,
                method: "POST",
                body: data,
                secure: true,
                type: ContentType.Json,
                format: "json",
                ...params
            }),
        /**
         * No description
         *
         * @tags Campaigns
         * @name CampaignControllerFindAll
         * @summary List Campaigns
         * @request GET:/campaign
         * @secure
         */ campaignControllerFindAll: (query, params = {})=>this.request({
                path: `/campaign`,
                method: "GET",
                query: query,
                secure: true,
                format: "json",
                ...params
            }),
        /**
         * No description
         *
         * @tags Campaigns
         * @name CampaignControllerFindOne
         * @summary Get Campaign
         * @request GET:/campaign/{id}
         * @secure
         */ campaignControllerFindOne: (id, params = {})=>this.request({
                path: `/campaign/${id}`,
                method: "GET",
                secure: true,
                format: "json",
                ...params
            }),
        /**
         * No description
         *
         * @tags Campaigns
         * @name CampaignControllerUpdate
         * @summary Update Campaign
         * @request PATCH:/campaign/{id}
         * @secure
         */ campaignControllerUpdate: (id, data, params = {})=>this.request({
                path: `/campaign/${id}`,
                method: "PATCH",
                body: data,
                secure: true,
                type: ContentType.Json,
                format: "json",
                ...params
            }),
        /**
         * No description
         *
         * @tags Campaigns
         * @name CampaignControllerRemove
         * @summary Delete Campaign
         * @request DELETE:/campaign/{id}
         * @secure
         */ campaignControllerRemove: (id, params = {})=>this.request({
                path: `/campaign/${id}`,
                method: "DELETE",
                secure: true,
                format: "json",
                ...params
            })
    };
    session = {
        /**
         * No description
         *
         * @tags Sessions
         * @name SessionControllerCreate
         * @summary Create Session
         * @request POST:/session
         * @secure
         */ sessionControllerCreate: (data, params = {})=>this.request({
                path: `/session`,
                method: "POST",
                body: data,
                secure: true,
                type: ContentType.Json,
                format: "json",
                ...params
            }),
        /**
         * No description
         *
         * @tags Sessions
         * @name SessionControllerFindAllPaginated
         * @summary List Sessions
         * @request GET:/session
         * @secure
         */ sessionControllerFindAllPaginated: (query, params = {})=>this.request({
                path: `/session`,
                method: "GET",
                query: query,
                secure: true,
                format: "json",
                ...params
            }),
        /**
         * No description
         *
         * @tags Sessions
         * @name SessionControllerFindOne
         * @summary Get Session
         * @request GET:/session/{id}
         * @secure
         */ sessionControllerFindOne: (id, params = {})=>this.request({
                path: `/session/${id}`,
                method: "GET",
                secure: true,
                format: "json",
                ...params
            }),
        /**
         * No description
         *
         * @tags Sessions
         * @name SessionControllerUpdate
         * @summary Update Session
         * @request PATCH:/session/{id}
         * @secure
         */ sessionControllerUpdate: (id, data, params = {})=>this.request({
                path: `/session/${id}`,
                method: "PATCH",
                body: data,
                secure: true,
                type: ContentType.Json,
                format: "json",
                ...params
            }),
        /**
         * No description
         *
         * @tags Sessions
         * @name SessionControllerRemove
         * @summary Delete Session
         * @request DELETE:/session/{id}
         * @secure
         */ sessionControllerRemove: (id, params = {})=>this.request({
                path: `/session/${id}`,
                method: "DELETE",
                secure: true,
                format: "json",
                ...params
            })
    };
    phoneNumber = {
        /**
         * @description Use POST /phone-number instead.
         *
         * @tags Phone Numbers
         * @name PhoneNumberControllerImportTwilio
         * @summary Import Twilio Number
         * @request POST:/phone-number/import/twilio
         * @deprecated
         * @secure
         */ phoneNumberControllerImportTwilio: (data, params = {})=>this.request({
                path: `/phone-number/import/twilio`,
                method: "POST",
                body: data,
                secure: true,
                type: ContentType.Json,
                format: "json",
                ...params
            }),
        /**
         * @description Use POST /phone-number instead.
         *
         * @tags Phone Numbers
         * @name PhoneNumberControllerImportVonage
         * @summary Import Vonage Number
         * @request POST:/phone-number/import/vonage
         * @deprecated
         * @secure
         */ phoneNumberControllerImportVonage: (data, params = {})=>this.request({
                path: `/phone-number/import/vonage`,
                method: "POST",
                body: data,
                secure: true,
                type: ContentType.Json,
                format: "json",
                ...params
            }),
        /**
         * No description
         *
         * @tags Phone Numbers
         * @name PhoneNumberControllerCreate
         * @summary Create Phone Number
         * @request POST:/phone-number
         * @secure
         */ phoneNumberControllerCreate: (data, params = {})=>this.request({
                path: `/phone-number`,
                method: "POST",
                body: data,
                secure: true,
                type: ContentType.Json,
                format: "json",
                ...params
            }),
        /**
         * No description
         *
         * @tags Phone Numbers
         * @name PhoneNumberControllerFindAll
         * @summary List Phone Numbers
         * @request GET:/phone-number
         * @secure
         */ phoneNumberControllerFindAll: (query, params = {})=>this.request({
                path: `/phone-number`,
                method: "GET",
                query: query,
                secure: true,
                format: "json",
                ...params
            }),
        /**
         * No description
         *
         * @tags Phone Numbers
         * @name PhoneNumberControllerFindOne
         * @summary Get Phone Number
         * @request GET:/phone-number/{id}
         * @secure
         */ phoneNumberControllerFindOne: (id, params = {})=>this.request({
                path: `/phone-number/${id}`,
                method: "GET",
                secure: true,
                format: "json",
                ...params
            }),
        /**
         * No description
         *
         * @tags Phone Numbers
         * @name PhoneNumberControllerUpdate
         * @summary Update Phone Number
         * @request PATCH:/phone-number/{id}
         * @secure
         */ phoneNumberControllerUpdate: (id, data, params = {})=>this.request({
                path: `/phone-number/${id}`,
                method: "PATCH",
                body: data,
                secure: true,
                type: ContentType.Json,
                format: "json",
                ...params
            }),
        /**
         * No description
         *
         * @tags Phone Numbers
         * @name PhoneNumberControllerRemove
         * @summary Delete Phone Number
         * @request DELETE:/phone-number/{id}
         * @secure
         */ phoneNumberControllerRemove: (id, params = {})=>this.request({
                path: `/phone-number/${id}`,
                method: "DELETE",
                secure: true,
                format: "json",
                ...params
            })
    };
    tool = {
        /**
         * No description
         *
         * @tags Tools
         * @name ToolControllerCreate
         * @summary Create Tool
         * @request POST:/tool
         * @secure
         */ toolControllerCreate: (data, params = {})=>this.request({
                path: `/tool`,
                method: "POST",
                body: data,
                secure: true,
                type: ContentType.Json,
                format: "json",
                ...params
            }),
        /**
         * No description
         *
         * @tags Tools
         * @name ToolControllerFindAll
         * @summary List Tools
         * @request GET:/tool
         * @secure
         */ toolControllerFindAll: (query, params = {})=>this.request({
                path: `/tool`,
                method: "GET",
                query: query,
                secure: true,
                format: "json",
                ...params
            }),
        /**
         * No description
         *
         * @tags Tools
         * @name ToolControllerFindOne
         * @summary Get Tool
         * @request GET:/tool/{id}
         * @secure
         */ toolControllerFindOne: (id, params = {})=>this.request({
                path: `/tool/${id}`,
                method: "GET",
                secure: true,
                format: "json",
                ...params
            }),
        /**
         * No description
         *
         * @tags Tools
         * @name ToolControllerUpdate
         * @summary Update Tool
         * @request PATCH:/tool/{id}
         * @secure
         */ toolControllerUpdate: (id, data, params = {})=>this.request({
                path: `/tool/${id}`,
                method: "PATCH",
                body: data,
                secure: true,
                type: ContentType.Json,
                format: "json",
                ...params
            }),
        /**
         * No description
         *
         * @tags Tools
         * @name ToolControllerRemove
         * @summary Delete Tool
         * @request DELETE:/tool/{id}
         * @secure
         */ toolControllerRemove: (id, params = {})=>this.request({
                path: `/tool/${id}`,
                method: "DELETE",
                secure: true,
                format: "json",
                ...params
            })
    };
    file = {
        /**
         * @description Use POST /file instead.
         *
         * @tags Files
         * @name FileControllerCreateDeprecated
         * @summary Upload File
         * @request POST:/file/upload
         * @deprecated
         * @secure
         */ fileControllerCreateDeprecated: (data, params = {})=>this.request({
                path: `/file/upload`,
                method: "POST",
                body: data,
                secure: true,
                type: ContentType.FormData,
                format: "json",
                ...params
            }),
        /**
         * No description
         *
         * @tags Files
         * @name FileControllerCreate
         * @summary Upload File
         * @request POST:/file
         * @secure
         */ fileControllerCreate: (data, params = {})=>this.request({
                path: `/file`,
                method: "POST",
                body: data,
                secure: true,
                type: ContentType.FormData,
                format: "json",
                ...params
            }),
        /**
         * No description
         *
         * @tags Files
         * @name FileControllerFindAll
         * @summary List Files
         * @request GET:/file
         * @secure
         */ fileControllerFindAll: (params = {})=>this.request({
                path: `/file`,
                method: "GET",
                secure: true,
                format: "json",
                ...params
            }),
        /**
         * No description
         *
         * @tags Files
         * @name FileControllerFindOne
         * @summary Get File
         * @request GET:/file/{id}
         * @secure
         */ fileControllerFindOne: (id, params = {})=>this.request({
                path: `/file/${id}`,
                method: "GET",
                secure: true,
                format: "json",
                ...params
            }),
        /**
         * No description
         *
         * @tags Files
         * @name FileControllerUpdate
         * @summary Update File
         * @request PATCH:/file/{id}
         * @secure
         */ fileControllerUpdate: (id, data, params = {})=>this.request({
                path: `/file/${id}`,
                method: "PATCH",
                body: data,
                secure: true,
                type: ContentType.Json,
                format: "json",
                ...params
            }),
        /**
         * No description
         *
         * @tags Files
         * @name FileControllerRemove
         * @summary Delete File
         * @request DELETE:/file/{id}
         * @secure
         */ fileControllerRemove: (id, params = {})=>this.request({
                path: `/file/${id}`,
                method: "DELETE",
                secure: true,
                format: "json",
                ...params
            })
    };
    knowledgeBase = {
        /**
         * No description
         *
         * @tags Knowledge Base
         * @name KnowledgeBaseControllerCreate
         * @summary Create Knowledge Base
         * @request POST:/knowledge-base
         * @secure
         */ knowledgeBaseControllerCreate: (data, params = {})=>this.request({
                path: `/knowledge-base`,
                method: "POST",
                body: data,
                secure: true,
                type: ContentType.Json,
                format: "json",
                ...params
            }),
        /**
         * No description
         *
         * @tags Knowledge Base
         * @name KnowledgeBaseControllerFindAll
         * @summary List Knowledge Bases
         * @request GET:/knowledge-base
         * @secure
         */ knowledgeBaseControllerFindAll: (query, params = {})=>this.request({
                path: `/knowledge-base`,
                method: "GET",
                query: query,
                secure: true,
                format: "json",
                ...params
            }),
        /**
         * No description
         *
         * @tags Knowledge Base
         * @name KnowledgeBaseControllerFindOne
         * @summary Get Knowledge Base
         * @request GET:/knowledge-base/{id}
         * @secure
         */ knowledgeBaseControllerFindOne: (id, params = {})=>this.request({
                path: `/knowledge-base/${id}`,
                method: "GET",
                secure: true,
                format: "json",
                ...params
            }),
        /**
         * No description
         *
         * @tags Knowledge Base
         * @name KnowledgeBaseControllerUpdate
         * @summary Update Knowledge Base
         * @request PATCH:/knowledge-base/{id}
         * @secure
         */ knowledgeBaseControllerUpdate: (id, data, params = {})=>this.request({
                path: `/knowledge-base/${id}`,
                method: "PATCH",
                body: data,
                secure: true,
                type: ContentType.Json,
                format: "json",
                ...params
            }),
        /**
         * No description
         *
         * @tags Knowledge Base
         * @name KnowledgeBaseControllerRemove
         * @summary Delete Knowledge Base
         * @request DELETE:/knowledge-base/{id}
         * @secure
         */ knowledgeBaseControllerRemove: (id, params = {})=>this.request({
                path: `/knowledge-base/${id}`,
                method: "DELETE",
                secure: true,
                format: "json",
                ...params
            })
    };
    structuredOutput = {
        /**
         * No description
         *
         * @tags Structured Outputs
         * @name StructuredOutputControllerFindAll
         * @summary List Structured Outputs
         * @request GET:/structured-output
         * @secure
         */ structuredOutputControllerFindAll: (query, params = {})=>this.request({
                path: `/structured-output`,
                method: "GET",
                query: query,
                secure: true,
                format: "json",
                ...params
            }),
        /**
         * No description
         *
         * @tags Structured Outputs
         * @name StructuredOutputControllerCreate
         * @summary Create Structured Output
         * @request POST:/structured-output
         * @secure
         */ structuredOutputControllerCreate: (data, params = {})=>this.request({
                path: `/structured-output`,
                method: "POST",
                body: data,
                secure: true,
                type: ContentType.Json,
                format: "json",
                ...params
            }),
        /**
         * No description
         *
         * @tags Structured Outputs
         * @name StructuredOutputControllerFindOne
         * @summary Get Structured Output
         * @request GET:/structured-output/{id}
         * @secure
         */ structuredOutputControllerFindOne: (id, params = {})=>this.request({
                path: `/structured-output/${id}`,
                method: "GET",
                secure: true,
                format: "json",
                ...params
            }),
        /**
         * No description
         *
         * @tags Structured Outputs
         * @name StructuredOutputControllerUpdate
         * @summary Update Structured Output
         * @request PATCH:/structured-output/{id}
         * @secure
         */ structuredOutputControllerUpdate: (id, query, data, params = {})=>this.request({
                path: `/structured-output/${id}`,
                method: "PATCH",
                query: query,
                body: data,
                secure: true,
                type: ContentType.Json,
                format: "json",
                ...params
            }),
        /**
         * No description
         *
         * @tags Structured Outputs
         * @name StructuredOutputControllerRemove
         * @summary Delete Structured Output
         * @request DELETE:/structured-output/{id}
         * @secure
         */ structuredOutputControllerRemove: (id, params = {})=>this.request({
                path: `/structured-output/${id}`,
                method: "DELETE",
                secure: true,
                format: "json",
                ...params
            }),
        /**
         * No description
         *
         * @tags Structured Outputs
         * @name StructuredOutputControllerRun
         * @summary Run Structured Output
         * @request POST:/structured-output/run
         * @secure
         */ structuredOutputControllerRun: (data, params = {})=>this.request({
                path: `/structured-output/run`,
                method: "POST",
                body: data,
                secure: true,
                type: ContentType.Json,
                format: "json",
                ...params
            })
    };
    testSuite = {
        /**
         * No description
         *
         * @tags Test Suites
         * @name TestSuiteControllerFindAllPaginated
         * @summary List Test Suites
         * @request GET:/test-suite
         * @secure
         */ testSuiteControllerFindAllPaginated: (query, params = {})=>this.request({
                path: `/test-suite`,
                method: "GET",
                query: query,
                secure: true,
                format: "json",
                ...params
            }),
        /**
         * No description
         *
         * @tags Test Suites
         * @name TestSuiteControllerCreate
         * @summary Create Test Suite
         * @request POST:/test-suite
         * @secure
         */ testSuiteControllerCreate: (data, params = {})=>this.request({
                path: `/test-suite`,
                method: "POST",
                body: data,
                secure: true,
                type: ContentType.Json,
                format: "json",
                ...params
            }),
        /**
         * No description
         *
         * @tags Test Suites
         * @name TestSuiteControllerFindOne
         * @summary Get Test Suite
         * @request GET:/test-suite/{id}
         * @secure
         */ testSuiteControllerFindOne: (id, params = {})=>this.request({
                path: `/test-suite/${id}`,
                method: "GET",
                secure: true,
                format: "json",
                ...params
            }),
        /**
         * No description
         *
         * @tags Test Suites
         * @name TestSuiteControllerUpdate
         * @summary Update Test Suite
         * @request PATCH:/test-suite/{id}
         * @secure
         */ testSuiteControllerUpdate: (id, data, params = {})=>this.request({
                path: `/test-suite/${id}`,
                method: "PATCH",
                body: data,
                secure: true,
                type: ContentType.Json,
                format: "json",
                ...params
            }),
        /**
         * No description
         *
         * @tags Test Suites
         * @name TestSuiteControllerRemove
         * @summary Delete Test Suite
         * @request DELETE:/test-suite/{id}
         * @secure
         */ testSuiteControllerRemove: (id, params = {})=>this.request({
                path: `/test-suite/${id}`,
                method: "DELETE",
                secure: true,
                format: "json",
                ...params
            }),
        /**
         * No description
         *
         * @tags Test Suite Tests
         * @name TestSuiteTestControllerFindAllPaginated
         * @summary List Tests
         * @request GET:/test-suite/{testSuiteId}/test
         * @secure
         */ testSuiteTestControllerFindAllPaginated: (testSuiteId, query, params = {})=>this.request({
                path: `/test-suite/${testSuiteId}/test`,
                method: "GET",
                query: query,
                secure: true,
                format: "json",
                ...params
            }),
        /**
         * No description
         *
         * @tags Test Suite Tests
         * @name TestSuiteTestControllerCreate
         * @summary Create Test
         * @request POST:/test-suite/{testSuiteId}/test
         * @secure
         */ testSuiteTestControllerCreate: (testSuiteId, data, params = {})=>this.request({
                path: `/test-suite/${testSuiteId}/test`,
                method: "POST",
                body: data,
                secure: true,
                type: ContentType.Json,
                format: "json",
                ...params
            }),
        /**
         * No description
         *
         * @tags Test Suite Tests
         * @name TestSuiteTestControllerFindOne
         * @summary Get Test
         * @request GET:/test-suite/{testSuiteId}/test/{id}
         * @secure
         */ testSuiteTestControllerFindOne: (testSuiteId, id, params = {})=>this.request({
                path: `/test-suite/${testSuiteId}/test/${id}`,
                method: "GET",
                secure: true,
                format: "json",
                ...params
            }),
        /**
         * No description
         *
         * @tags Test Suite Tests
         * @name TestSuiteTestControllerUpdate
         * @summary Update Test
         * @request PATCH:/test-suite/{testSuiteId}/test/{id}
         * @secure
         */ testSuiteTestControllerUpdate: (testSuiteId, id, data, params = {})=>this.request({
                path: `/test-suite/${testSuiteId}/test/${id}`,
                method: "PATCH",
                body: data,
                secure: true,
                type: ContentType.Json,
                format: "json",
                ...params
            }),
        /**
         * No description
         *
         * @tags Test Suite Tests
         * @name TestSuiteTestControllerRemove
         * @summary Delete Test
         * @request DELETE:/test-suite/{testSuiteId}/test/{id}
         * @secure
         */ testSuiteTestControllerRemove: (testSuiteId, id, params = {})=>this.request({
                path: `/test-suite/${testSuiteId}/test/${id}`,
                method: "DELETE",
                secure: true,
                format: "json",
                ...params
            }),
        /**
         * No description
         *
         * @tags Test Suite Runs
         * @name TestSuiteRunControllerFindAllPaginated
         * @summary List Test Suite Runs
         * @request GET:/test-suite/{testSuiteId}/run
         * @secure
         */ testSuiteRunControllerFindAllPaginated: (testSuiteId, query, params = {})=>this.request({
                path: `/test-suite/${testSuiteId}/run`,
                method: "GET",
                query: query,
                secure: true,
                format: "json",
                ...params
            }),
        /**
         * No description
         *
         * @tags Test Suite Runs
         * @name TestSuiteRunControllerCreate
         * @summary Create Test Suite Run
         * @request POST:/test-suite/{testSuiteId}/run
         * @secure
         */ testSuiteRunControllerCreate: (testSuiteId, data, params = {})=>this.request({
                path: `/test-suite/${testSuiteId}/run`,
                method: "POST",
                body: data,
                secure: true,
                type: ContentType.Json,
                format: "json",
                ...params
            }),
        /**
         * No description
         *
         * @tags Test Suite Runs
         * @name TestSuiteRunControllerFindOne
         * @summary Get Test Suite Run
         * @request GET:/test-suite/{testSuiteId}/run/{id}
         * @secure
         */ testSuiteRunControllerFindOne: (testSuiteId, id, params = {})=>this.request({
                path: `/test-suite/${testSuiteId}/run/${id}`,
                method: "GET",
                secure: true,
                format: "json",
                ...params
            }),
        /**
         * No description
         *
         * @tags Test Suite Runs
         * @name TestSuiteRunControllerUpdate
         * @summary Update Test Suite Run
         * @request PATCH:/test-suite/{testSuiteId}/run/{id}
         * @secure
         */ testSuiteRunControllerUpdate: (testSuiteId, id, data, params = {})=>this.request({
                path: `/test-suite/${testSuiteId}/run/${id}`,
                method: "PATCH",
                body: data,
                secure: true,
                type: ContentType.Json,
                format: "json",
                ...params
            }),
        /**
         * No description
         *
         * @tags Test Suite Runs
         * @name TestSuiteRunControllerRemove
         * @summary Delete Test Suite Run
         * @request DELETE:/test-suite/{testSuiteId}/run/{id}
         * @secure
         */ testSuiteRunControllerRemove: (testSuiteId, id, params = {})=>this.request({
                path: `/test-suite/${testSuiteId}/run/${id}`,
                method: "DELETE",
                secure: true,
                format: "json",
                ...params
            })
    };
    reporting = {
        /**
         * No description
         *
         * @tags Insight
         * @name InsightControllerCreate
         * @summary Create Insight
         * @request POST:/reporting/insight
         * @secure
         */ insightControllerCreate: (data, params = {})=>this.request({
                path: `/reporting/insight`,
                method: "POST",
                body: data,
                secure: true,
                type: ContentType.Json,
                format: "json",
                ...params
            }),
        /**
         * No description
         *
         * @tags Insight
         * @name InsightControllerFindAll
         * @summary Get Insights
         * @request GET:/reporting/insight
         * @secure
         */ insightControllerFindAll: (query, params = {})=>this.request({
                path: `/reporting/insight`,
                method: "GET",
                query: query,
                secure: true,
                format: "json",
                ...params
            }),
        /**
         * No description
         *
         * @tags Insight
         * @name InsightControllerUpdate
         * @summary Update Insight
         * @request PATCH:/reporting/insight/{id}
         * @secure
         */ insightControllerUpdate: (id, data, params = {})=>this.request({
                path: `/reporting/insight/${id}`,
                method: "PATCH",
                body: data,
                secure: true,
                type: ContentType.Json,
                format: "json",
                ...params
            }),
        /**
         * No description
         *
         * @tags Insight
         * @name InsightControllerFindOne
         * @summary Get Insight
         * @request GET:/reporting/insight/{id}
         * @secure
         */ insightControllerFindOne: (id, params = {})=>this.request({
                path: `/reporting/insight/${id}`,
                method: "GET",
                secure: true,
                format: "json",
                ...params
            }),
        /**
         * No description
         *
         * @tags Insight
         * @name InsightControllerRemove
         * @summary Delete Insight
         * @request DELETE:/reporting/insight/{id}
         * @secure
         */ insightControllerRemove: (id, params = {})=>this.request({
                path: `/reporting/insight/${id}`,
                method: "DELETE",
                secure: true,
                format: "json",
                ...params
            }),
        /**
         * No description
         *
         * @tags Insight
         * @name InsightControllerRun
         * @summary Run Insight
         * @request POST:/reporting/insight/{id}/run
         * @secure
         */ insightControllerRun: (id, data, params = {})=>this.request({
                path: `/reporting/insight/${id}/run`,
                method: "POST",
                body: data,
                secure: true,
                type: ContentType.Json,
                format: "json",
                ...params
            }),
        /**
         * No description
         *
         * @tags Insight
         * @name InsightControllerPreview
         * @summary Preview Insight
         * @request POST:/reporting/insight/preview
         * @secure
         */ insightControllerPreview: (data, params = {})=>this.request({
                path: `/reporting/insight/preview`,
                method: "POST",
                body: data,
                secure: true,
                type: ContentType.Json,
                format: "json",
                ...params
            })
    };
    eval = {
        /**
         * No description
         *
         * @tags Eval
         * @name EvalControllerCreate
         * @summary Create Eval
         * @request POST:/eval
         * @secure
         */ evalControllerCreate: (data, params = {})=>this.request({
                path: `/eval`,
                method: "POST",
                body: data,
                secure: true,
                type: ContentType.Json,
                format: "json",
                ...params
            }),
        /**
         * No description
         *
         * @tags Eval
         * @name EvalControllerGetPaginated
         * @summary List Evals
         * @request GET:/eval
         * @secure
         */ evalControllerGetPaginated: (query, params = {})=>this.request({
                path: `/eval`,
                method: "GET",
                query: query,
                secure: true,
                format: "json",
                ...params
            }),
        /**
         * No description
         *
         * @tags Eval
         * @name EvalControllerUpdate
         * @summary Update Eval
         * @request PATCH:/eval/{id}
         * @secure
         */ evalControllerUpdate: (id, data, params = {})=>this.request({
                path: `/eval/${id}`,
                method: "PATCH",
                body: data,
                secure: true,
                type: ContentType.Json,
                format: "json",
                ...params
            }),
        /**
         * No description
         *
         * @tags Eval
         * @name EvalControllerRemove
         * @summary Delete Eval
         * @request DELETE:/eval/{id}
         * @secure
         */ evalControllerRemove: (id, params = {})=>this.request({
                path: `/eval/${id}`,
                method: "DELETE",
                secure: true,
                format: "json",
                ...params
            }),
        /**
         * No description
         *
         * @tags Eval
         * @name EvalControllerGet
         * @summary Get Eval
         * @request GET:/eval/{id}
         * @secure
         */ evalControllerGet: (id, params = {})=>this.request({
                path: `/eval/${id}`,
                method: "GET",
                secure: true,
                format: "json",
                ...params
            }),
        /**
         * No description
         *
         * @tags Eval
         * @name EvalControllerRemoveRun
         * @summary Delete Eval Run
         * @request DELETE:/eval/run/{id}
         * @secure
         */ evalControllerRemoveRun: (id, params = {})=>this.request({
                path: `/eval/run/${id}`,
                method: "DELETE",
                secure: true,
                format: "json",
                ...params
            }),
        /**
         * No description
         *
         * @tags Eval
         * @name EvalControllerGetRun
         * @summary Get Eval Run
         * @request GET:/eval/run/{id}
         * @secure
         */ evalControllerGetRun: (id, params = {})=>this.request({
                path: `/eval/run/${id}`,
                method: "GET",
                secure: true,
                format: "json",
                ...params
            }),
        /**
         * No description
         *
         * @tags Eval
         * @name EvalControllerRun
         * @summary Create Eval Run
         * @request POST:/eval/run
         * @secure
         */ evalControllerRun: (data, params = {})=>this.request({
                path: `/eval/run`,
                method: "POST",
                body: data,
                secure: true,
                type: ContentType.Json,
                ...params
            }),
        /**
         * No description
         *
         * @tags Eval
         * @name EvalControllerGetRunsPaginated
         * @summary List Eval Runs
         * @request GET:/eval/run
         * @secure
         */ evalControllerGetRunsPaginated: (query, params = {})=>this.request({
                path: `/eval/run`,
                method: "GET",
                query: query,
                secure: true,
                format: "json",
                ...params
            })
    };
    observability = {
        /**
         * No description
         *
         * @tags Observability/Scorecard
         * @name ScorecardControllerGet
         * @summary Get Scorecard
         * @request GET:/observability/scorecard/{id}
         * @secure
         */ scorecardControllerGet: (id, params = {})=>this.request({
                path: `/observability/scorecard/${id}`,
                method: "GET",
                secure: true,
                format: "json",
                ...params
            }),
        /**
         * No description
         *
         * @tags Observability/Scorecard
         * @name ScorecardControllerUpdate
         * @summary Update Scorecard
         * @request PATCH:/observability/scorecard/{id}
         * @secure
         */ scorecardControllerUpdate: (id, data, params = {})=>this.request({
                path: `/observability/scorecard/${id}`,
                method: "PATCH",
                body: data,
                secure: true,
                type: ContentType.Json,
                format: "json",
                ...params
            }),
        /**
         * No description
         *
         * @tags Observability/Scorecard
         * @name ScorecardControllerRemove
         * @summary Delete Scorecard
         * @request DELETE:/observability/scorecard/{id}
         * @secure
         */ scorecardControllerRemove: (id, params = {})=>this.request({
                path: `/observability/scorecard/${id}`,
                method: "DELETE",
                secure: true,
                format: "json",
                ...params
            }),
        /**
         * No description
         *
         * @tags Observability/Scorecard
         * @name ScorecardControllerGetPaginated
         * @summary List Scorecards
         * @request GET:/observability/scorecard
         * @secure
         */ scorecardControllerGetPaginated: (query, params = {})=>this.request({
                path: `/observability/scorecard`,
                method: "GET",
                query: query,
                secure: true,
                format: "json",
                ...params
            }),
        /**
         * No description
         *
         * @tags Observability/Scorecard
         * @name ScorecardControllerCreate
         * @summary Create Scorecard
         * @request POST:/observability/scorecard
         * @secure
         */ scorecardControllerCreate: (data, params = {})=>this.request({
                path: `/observability/scorecard`,
                method: "POST",
                body: data,
                secure: true,
                type: ContentType.Json,
                format: "json",
                ...params
            })
    };
    org = {
        /**
         * No description
         *
         * @tags Orgs
         * @name OrgControllerCreate
         * @summary Create Org
         * @request POST:/org
         * @secure
         */ orgControllerCreate: (data, params = {})=>this.request({
                path: `/org`,
                method: "POST",
                body: data,
                secure: true,
                type: ContentType.Json,
                format: "json",
                ...params
            }),
        /**
         * No description
         *
         * @tags Orgs
         * @name OrgControllerFindAll
         * @summary List Orgs
         * @request GET:/org
         * @secure
         */ orgControllerFindAll: (params = {})=>this.request({
                path: `/org`,
                method: "GET",
                secure: true,
                format: "json",
                ...params
            }),
        /**
         * No description
         *
         * @tags Orgs
         * @name OrgControllerFeatureFlagEnabled
         * @summary Check if Feature Flag is enabled
         * @request GET:/org/feature-flag
         * @secure
         */ orgControllerFeatureFlagEnabled: (query, params = {})=>this.request({
                path: `/org/feature-flag`,
                method: "GET",
                query: query,
                secure: true,
                format: "json",
                ...params
            }),
        /**
         * No description
         *
         * @tags Orgs
         * @name OrgControllerFindOne
         * @summary Get Org
         * @request GET:/org/{id}
         * @secure
         */ orgControllerFindOne: (id, params = {})=>this.request({
                path: `/org/${id}`,
                method: "GET",
                secure: true,
                format: "json",
                ...params
            }),
        /**
         * No description
         *
         * @tags Orgs
         * @name OrgControllerUpdate
         * @summary Update Org
         * @request PATCH:/org/{id}
         * @secure
         */ orgControllerUpdate: (id, data, params = {})=>this.request({
                path: `/org/${id}`,
                method: "PATCH",
                body: data,
                secure: true,
                type: ContentType.Json,
                format: "json",
                ...params
            }),
        /**
         * No description
         *
         * @tags Orgs
         * @name OrgControllerDeleteOrg
         * @summary Delete Org
         * @request DELETE:/org/{id}
         * @secure
         */ orgControllerDeleteOrg: (id, params = {})=>this.request({
                path: `/org/${id}`,
                method: "DELETE",
                secure: true,
                ...params
            }),
        /**
         * No description
         *
         * @tags Orgs
         * @name OrgControllerFindAllUsers
         * @summary List Users
         * @request GET:/org/{id}/user
         * @secure
         */ orgControllerFindAllUsers: (id, params = {})=>this.request({
                path: `/org/${id}/user`,
                method: "GET",
                secure: true,
                format: "json",
                ...params
            }),
        /**
         * No description
         *
         * @tags Orgs
         * @name OrgControllerOrgLeave
         * @summary Leave Org
         * @request DELETE:/org/{id}/leave
         * @secure
         */ orgControllerOrgLeave: (id, params = {})=>this.request({
                path: `/org/${id}/leave`,
                method: "DELETE",
                secure: true,
                ...params
            }),
        /**
         * No description
         *
         * @tags Orgs
         * @name OrgControllerOrgRemoveUser
         * @summary Remove Org Member
         * @request DELETE:/org/{id}/member/{memberId}/leave
         * @secure
         */ orgControllerOrgRemoveUser: (id, memberId, params = {})=>this.request({
                path: `/org/${id}/member/${memberId}/leave`,
                method: "DELETE",
                secure: true,
                ...params
            }),
        /**
         * No description
         *
         * @tags Orgs
         * @name OrgControllerUsersInvite
         * @summary Invite User
         * @request POST:/org/{id}/invite
         * @secure
         */ orgControllerUsersInvite: (id, data, params = {})=>this.request({
                path: `/org/${id}/invite`,
                method: "POST",
                body: data,
                secure: true,
                type: ContentType.Json,
                ...params
            }),
        /**
         * No description
         *
         * @tags Orgs
         * @name OrgControllerUserUpdate
         * @summary Update User Role
         * @request PATCH:/org/{id}/role
         * @secure
         */ orgControllerUserUpdate: (id, data, params = {})=>this.request({
                path: `/org/${id}/role`,
                method: "PATCH",
                body: data,
                secure: true,
                type: ContentType.Json,
                ...params
            }),
        /**
         * No description
         *
         * @tags Orgs
         * @name OrgControllerOrgToken
         * @summary Generate User Org JWT
         * @request GET:/org/{id}/auth
         * @secure
         */ orgControllerOrgToken: (id, params = {})=>this.request({
                path: `/org/${id}/auth`,
                method: "GET",
                secure: true,
                format: "json",
                ...params
            })
    };
    token = {
        /**
         * No description
         *
         * @tags Tokens
         * @name TokenControllerCreate
         * @summary Create Token
         * @request POST:/token
         * @secure
         */ tokenControllerCreate: (data, params = {})=>this.request({
                path: `/token`,
                method: "POST",
                body: data,
                secure: true,
                type: ContentType.Json,
                format: "json",
                ...params
            }),
        /**
         * No description
         *
         * @tags Tokens
         * @name TokenControllerFindAll
         * @summary List Tokens
         * @request GET:/token
         * @secure
         */ tokenControllerFindAll: (query, params = {})=>this.request({
                path: `/token`,
                method: "GET",
                query: query,
                secure: true,
                format: "json",
                ...params
            }),
        /**
         * No description
         *
         * @tags Tokens
         * @name TokenControllerFindOne
         * @summary Get Token
         * @request GET:/token/{id}
         * @secure
         */ tokenControllerFindOne: (id, params = {})=>this.request({
                path: `/token/${id}`,
                method: "GET",
                secure: true,
                format: "json",
                ...params
            }),
        /**
         * No description
         *
         * @tags Tokens
         * @name TokenControllerUpdate
         * @summary Update Token
         * @request PATCH:/token/{id}
         * @secure
         */ tokenControllerUpdate: (id, data, params = {})=>this.request({
                path: `/token/${id}`,
                method: "PATCH",
                body: data,
                secure: true,
                type: ContentType.Json,
                format: "json",
                ...params
            }),
        /**
         * No description
         *
         * @tags Tokens
         * @name TokenControllerRemove
         * @summary Delete Token
         * @request DELETE:/token/{id}
         * @secure
         */ tokenControllerRemove: (id, params = {})=>this.request({
                path: `/token/${id}`,
                method: "DELETE",
                secure: true,
                format: "json",
                ...params
            })
    };
    credential = {
        /**
         * No description
         *
         * @tags Credentials
         * @name CredentialControllerCreate
         * @summary Create Credential
         * @request POST:/credential
         * @secure
         */ credentialControllerCreate: (data, params = {})=>this.request({
                path: `/credential`,
                method: "POST",
                body: data,
                secure: true,
                type: ContentType.Json,
                format: "json",
                ...params
            }),
        /**
         * No description
         *
         * @tags Credentials
         * @name CredentialControllerFindAll
         * @summary List Credentials
         * @request GET:/credential
         * @secure
         */ credentialControllerFindAll: (query, params = {})=>this.request({
                path: `/credential`,
                method: "GET",
                query: query,
                secure: true,
                format: "json",
                ...params
            }),
        /**
         * No description
         *
         * @tags Credentials
         * @name CredentialControllerFindOne
         * @summary Get Credential
         * @request GET:/credential/{id}
         * @secure
         */ credentialControllerFindOne: (id, params = {})=>this.request({
                path: `/credential/${id}`,
                method: "GET",
                secure: true,
                format: "json",
                ...params
            }),
        /**
         * No description
         *
         * @tags Credentials
         * @name CredentialControllerUpdate
         * @summary Update Credential
         * @request PATCH:/credential/{id}
         * @secure
         */ credentialControllerUpdate: (id, data, params = {})=>this.request({
                path: `/credential/${id}`,
                method: "PATCH",
                body: data,
                secure: true,
                type: ContentType.Json,
                format: "json",
                ...params
            }),
        /**
         * No description
         *
         * @tags Credentials
         * @name CredentialControllerRemove
         * @summary Delete Credential
         * @request DELETE:/credential/{id}
         * @secure
         */ credentialControllerRemove: (id, params = {})=>this.request({
                path: `/credential/${id}`,
                method: "DELETE",
                secure: true,
                format: "json",
                ...params
            })
    };
    template = {
        /**
         * No description
         *
         * @tags Templates
         * @name TemplateControllerCreate
         * @summary Create Template
         * @request POST:/template
         * @secure
         */ templateControllerCreate: (data, params = {})=>this.request({
                path: `/template`,
                method: "POST",
                body: data,
                secure: true,
                type: ContentType.Json,
                format: "json",
                ...params
            }),
        /**
         * No description
         *
         * @tags Templates
         * @name TemplateControllerFindAll
         * @summary List Templates
         * @request GET:/template
         * @secure
         */ templateControllerFindAll: (query, params = {})=>this.request({
                path: `/template`,
                method: "GET",
                query: query,
                secure: true,
                format: "json",
                ...params
            }),
        /**
         * No description
         *
         * @tags Templates
         * @name TemplateControllerFindAllPinned
         * @summary List Templates
         * @request GET:/template/pinned
         * @secure
         */ templateControllerFindAllPinned: (params = {})=>this.request({
                path: `/template/pinned`,
                method: "GET",
                secure: true,
                format: "json",
                ...params
            }),
        /**
         * No description
         *
         * @tags Templates
         * @name TemplateControllerFindOne
         * @summary Get Template
         * @request GET:/template/{id}
         * @secure
         */ templateControllerFindOne: (id, params = {})=>this.request({
                path: `/template/${id}`,
                method: "GET",
                secure: true,
                format: "json",
                ...params
            }),
        /**
         * No description
         *
         * @tags Templates
         * @name TemplateControllerUpdate
         * @summary Update Template
         * @request PATCH:/template/{id}
         * @secure
         */ templateControllerUpdate: (id, data, params = {})=>this.request({
                path: `/template/${id}`,
                method: "PATCH",
                body: data,
                secure: true,
                type: ContentType.Json,
                format: "json",
                ...params
            }),
        /**
         * No description
         *
         * @tags Templates
         * @name TemplateControllerRemove
         * @summary Delete Template
         * @request DELETE:/template/{id}
         * @secure
         */ templateControllerRemove: (id, params = {})=>this.request({
                path: `/template/${id}`,
                method: "DELETE",
                secure: true,
                format: "json",
                ...params
            })
    };
    voiceLibrary = {
        /**
         * No description
         *
         * @tags Voice Library
         * @name VoiceLibraryControllerVoiceGetByProvider
         * @summary Get voices in Voice Library by Provider
         * @request GET:/voice-library/{provider}
         * @secure
         */ voiceLibraryControllerVoiceGetByProvider: (provider, query, params = {})=>this.request({
                path: `/voice-library/${provider}`,
                method: "GET",
                query: query,
                secure: true,
                format: "json",
                ...params
            }),
        /**
         * No description
         *
         * @tags Voice Library
         * @name VoiceLibraryControllerVoiceGetAccentsByProvider
         * @summary Get accents in Voice Library by Provider
         * @request GET:/voice-library/{provider}/accents
         * @secure
         */ voiceLibraryControllerVoiceGetAccentsByProvider: (provider, params = {})=>this.request({
                path: `/voice-library/${provider}/accents`,
                method: "GET",
                secure: true,
                format: "json",
                ...params
            }),
        /**
         * No description
         *
         * @tags Voice Library
         * @name VoiceLibraryControllerVoiceLibrarySyncByProvider
         * @summary Sync Private voices in Voice Library by Provider
         * @request POST:/voice-library/sync/{provider}
         * @secure
         */ voiceLibraryControllerVoiceLibrarySyncByProvider: (provider, params = {})=>this.request({
                path: `/voice-library/sync/${provider}`,
                method: "POST",
                secure: true,
                format: "json",
                ...params
            }),
        /**
         * No description
         *
         * @tags Voice Library
         * @name VoiceLibraryControllerVoiceLibrarySyncDefaultVoices
         * @summary Sync Default voices in Voice Library by Providers
         * @request POST:/voice-library/sync
         * @secure
         */ voiceLibraryControllerVoiceLibrarySyncDefaultVoices: (data, params = {})=>this.request({
                path: `/voice-library/sync`,
                method: "POST",
                body: data,
                secure: true,
                type: ContentType.Json,
                format: "json",
                ...params
            }),
        /**
         * No description
         *
         * @tags Voice Library
         * @name VoiceLibraryControllerVoiceLibraryCreateSesameVoice
         * @summary Create a new voice in the Voice Library using Sesame
         * @request POST:/voice-library/create-sesame-voice
         * @secure
         */ voiceLibraryControllerVoiceLibraryCreateSesameVoice: (data, params = {})=>this.request({
                path: `/voice-library/create-sesame-voice`,
                method: "POST",
                body: data,
                secure: true,
                type: ContentType.Json,
                ...params
            })
    };
    provider = {
        /**
         * No description
         *
         * @tags Provider Resources
         * @name ProviderResourceControllerCreateProviderResource
         * @summary Create Provider Resource
         * @request POST:/provider/{provider}/{resourceName}
         * @secure
         */ providerResourceControllerCreateProviderResource: (provider, resourceName, params = {})=>this.request({
                path: `/provider/${provider}/${resourceName}`,
                method: "POST",
                secure: true,
                format: "json",
                ...params
            }),
        /**
         * No description
         *
         * @tags Provider Resources
         * @name ProviderResourceControllerGetProviderResourcesPaginated
         * @summary List Provider Resources
         * @request GET:/provider/{provider}/{resourceName}
         * @secure
         */ providerResourceControllerGetProviderResourcesPaginated: (provider, resourceName, query, params = {})=>this.request({
                path: `/provider/${provider}/${resourceName}`,
                method: "GET",
                query: query,
                secure: true,
                format: "json",
                ...params
            }),
        /**
         * No description
         *
         * @tags Provider Resources
         * @name ProviderResourceControllerGetProviderResource
         * @summary Get Provider Resource
         * @request GET:/provider/{provider}/{resourceName}/{id}
         * @secure
         */ providerResourceControllerGetProviderResource: (provider, resourceName, id, params = {})=>this.request({
                path: `/provider/${provider}/${resourceName}/${id}`,
                method: "GET",
                secure: true,
                format: "json",
                ...params
            }),
        /**
         * No description
         *
         * @tags Provider Resources
         * @name ProviderResourceControllerDeleteProviderResource
         * @summary Delete Provider Resource
         * @request DELETE:/provider/{provider}/{resourceName}/{id}
         * @secure
         */ providerResourceControllerDeleteProviderResource: (provider, resourceName, id, params = {})=>this.request({
                path: `/provider/${provider}/${resourceName}/${id}`,
                method: "DELETE",
                secure: true,
                format: "json",
                ...params
            }),
        /**
         * No description
         *
         * @tags Provider Resources
         * @name ProviderResourceControllerUpdateProviderResource
         * @summary Update Provider Resource
         * @request PATCH:/provider/{provider}/{resourceName}/{id}
         * @secure
         */ providerResourceControllerUpdateProviderResource: (provider, resourceName, id, params = {})=>this.request({
                path: `/provider/${provider}/${resourceName}/${id}`,
                method: "PATCH",
                secure: true,
                format: "json",
                ...params
            }),
        /**
         * No description
         *
         * @tags Providers
         * @name ProviderControllerGetWorkflows
         * @request GET:/{provider}/workflows
         * @secure
         */ providerControllerGetWorkflows: (provider, query, params = {})=>this.request({
                path: `/${provider}/workflows`,
                method: "GET",
                query: query,
                secure: true,
                format: "json",
                ...params
            }),
        /**
         * No description
         *
         * @tags Providers
         * @name ProviderControllerGetWorkflowTriggerHook
         * @request GET:/{provider}/workflows/{workflowId}/hooks
         * @secure
         */ providerControllerGetWorkflowTriggerHook: (provider, workflowId, params = {})=>this.request({
                path: `/${provider}/workflows/${workflowId}/hooks`,
                method: "GET",
                secure: true,
                format: "json",
                ...params
            }),
        /**
         * No description
         *
         * @tags Providers
         * @name ProviderControllerGetLocations
         * @request GET:/{provider}/locations
         * @secure
         */ providerControllerGetLocations: (provider, params = {})=>this.request({
                path: `/${provider}/locations`,
                method: "GET",
                secure: true,
                format: "json",
                ...params
            }),
        /**
         * No description
         *
         * @tags Providers
         * @name VoiceProviderControllerSearchVoices
         * @summary Search Voice from Provider Voice Library.
         * @request GET:/{provider}/voices/search
         * @deprecated
         * @secure
         */ voiceProviderControllerSearchVoices: (provider, query, params = {})=>this.request({
                path: `/${provider}/voices/search`,
                method: "GET",
                query: query,
                secure: true,
                format: "json",
                ...params
            }),
        /**
         * No description
         *
         * @tags Providers
         * @name VoiceProviderControllerSearchVoice
         * @summary Search Voice from Provider Voice Library.
         * @request GET:/{provider}/voice/search
         * @secure
         */ voiceProviderControllerSearchVoice: (provider, query, params = {})=>this.request({
                path: `/${provider}/voice/search`,
                method: "GET",
                query: query,
                secure: true,
                format: "json",
                ...params
            }),
        /**
         * No description
         *
         * @tags Providers
         * @name VoiceProviderControllerAddVoices
         * @summary Add Shared Voice to your Provider Account.
         * @request POST:/{provider}/voices/add
         * @deprecated
         * @secure
         */ voiceProviderControllerAddVoices: (provider, data, params = {})=>this.request({
                path: `/${provider}/voices/add`,
                method: "POST",
                body: data,
                secure: true,
                type: ContentType.Json,
                format: "json",
                ...params
            }),
        /**
         * No description
         *
         * @tags Providers
         * @name VoiceProviderControllerAddVoice
         * @summary Add Shared Voice to your Provider Account.
         * @request POST:/{provider}/voice/add
         * @secure
         */ voiceProviderControllerAddVoice: (provider, data, params = {})=>this.request({
                path: `/${provider}/voice/add`,
                method: "POST",
                body: data,
                secure: true,
                type: ContentType.Json,
                format: "json",
                ...params
            })
    };
    v11Labs = {
        /**
         * No description
         *
         * @tags Providers
         * @name VoiceProviderControllerCloneVoices
         * @summary Clone a voice to the provider account and add to Vapi Voice Library.
         * @request POST:/11labs/voice/clone
         * @secure
         */ voiceProviderControllerCloneVoices: (data, params = {})=>this.request({
                path: `/11labs/voice/clone`,
                method: "POST",
                body: data,
                secure: true,
                type: ContentType.FormData,
                ...params
            })
    };
    analytics = {
        /**
         * No description
         *
         * @tags Analytics
         * @name AnalyticsControllerQuery
         * @summary Create Analytics Queries
         * @request POST:/analytics
         * @secure
         */ analyticsControllerQuery: (data, params = {})=>this.request({
                path: `/analytics`,
                method: "POST",
                body: data,
                secure: true,
                type: ContentType.Json,
                format: "json",
                ...params
            })
    };
}
exports.Api = Api;
}),
"[project]/projects/tartanhacks/node_modules/@vapi-ai/web/dist/client.js [app-ssr] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.client = void 0;
const api_1 = __turbopack_context__.r("[project]/projects/tartanhacks/node_modules/@vapi-ai/web/dist/api.js [app-ssr] (ecmascript)");
const api = new api_1.Api({
    baseUrl: "https://api.vapi.ai",
    baseApiParams: {
        secure: true
    },
    securityWorker: async (securityData)=>{
        if (securityData) {
            return {
                headers: {
                    Authorization: `Bearer ${securityData}`
                }
            };
        }
    }
});
exports.client = api;
}),
"[project]/projects/tartanhacks/node_modules/@vapi-ai/web/dist/daily-guards.js [app-ssr] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.createSafeDailyConfig = createSafeDailyConfig;
exports.safeSetLocalAudio = safeSetLocalAudio;
exports.safeSetInputDevicesAsync = safeSetInputDevicesAsync;
exports.createSafeDailyFactoryOptions = createSafeDailyFactoryOptions;
function createSafeDailyConfig(config) {
    if (!config) return {};
    const { alwaysIncludeMicInPermissionPrompt, ...rest } = config;
    // Force true or remove the property entirely. This can cause Chrome 140+ issues
    if (alwaysIncludeMicInPermissionPrompt === false) {
        console.warn('[Vapi] alwaysIncludeMicInPermissionPrompt:false detected. ' + 'This can cause Chrome 140+ issues. Removing the property.');
        return rest;
    }
    return config;
}
function safeSetLocalAudio(call, enabled) {
    if (!call) {
        throw new Error('Call object is not available.');
    }
    // Never use forceDiscardTrack. This can cause Chrome 140+ issues
    call.setLocalAudio(enabled);
}
async function safeSetInputDevicesAsync(call, options) {
    if (!call) {
        throw new Error('Call object is not available.');
    }
    // Validate audioSource
    if ('audioSource' in options && options.audioSource === false) {
        console.warn('[Vapi] setInputDevicesAsync with audioSource:false detected. ' + 'This can cause Chrome 140+ issues. Using default device instead.');
        const { audioSource, ...safeOptions } = options;
        await call.setInputDevicesAsync(safeOptions);
        return;
    }
    await call.setInputDevicesAsync(options);
}
function createSafeDailyFactoryOptions(options) {
    if (!options) return {};
    // Ensure audioSource is never false
    if (options.audioSource === false) {
        console.warn('[Vapi] audioSource:false detected in factory options. ' + 'This can cause Chrome 140+ issues. Defaulting to true.');
        return {
            ...options,
            audioSource: true
        };
    }
    return options;
}
}),
"[project]/projects/tartanhacks/node_modules/@vapi-ai/web/dist/vapi.js [app-ssr] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

var __importDefault = /*TURBOPACK member replacement*/ __turbopack_context__.e && /*TURBOPACK member replacement*/ __turbopack_context__.e.__importDefault || function(mod) {
    return mod && mod.__esModule ? mod : {
        "default": mod
    };
};
Object.defineProperty(exports, "__esModule", {
    value: true
});
const daily_js_1 = __importDefault(__turbopack_context__.r("[project]/projects/tartanhacks/node_modules/@daily-co/daily-js/dist/daily-esm.js [app-ssr] (ecmascript)"));
const events_1 = __importDefault(__turbopack_context__.r("[externals]/events [external] (events, cjs)"));
const client_1 = __turbopack_context__.r("[project]/projects/tartanhacks/node_modules/@vapi-ai/web/dist/client.js [app-ssr] (ecmascript)");
const daily_guards_1 = __turbopack_context__.r("[project]/projects/tartanhacks/node_modules/@vapi-ai/web/dist/daily-guards.js [app-ssr] (ecmascript)");
/**
 * Extracts error details into a plain object that serializes properly to JSON.
 * Error objects don't serialize well because their properties (message, stack, name)
 * are not enumerable and get lost when using JSON.stringify().
 */ function serializeError(error) {
    if (error === null || error === undefined) {
        return {
            message: 'Unknown error (null or undefined)'
        };
    }
    if (error instanceof Error) {
        const serialized = {
            message: error.message,
            name: error.name,
            stack: error.stack
        };
        // Include any additional properties that might be on the error
        const errorAsAny = error;
        if (errorAsAny.code !== undefined) {
            serialized.code = errorAsAny.code;
        }
        if (errorAsAny.cause !== undefined) {
            serialized.cause = String(errorAsAny.cause);
        }
        if (errorAsAny.reason !== undefined) {
            serialized.reason = errorAsAny.reason;
        }
        if (errorAsAny.details !== undefined) {
            serialized.details = errorAsAny.details;
        }
        // Daily.co specific error properties
        if (errorAsAny.errorMsg !== undefined) {
            serialized.errorMsg = errorAsAny.errorMsg;
        }
        if (errorAsAny.error !== undefined && typeof errorAsAny.error === 'string') {
            serialized.errorDetail = errorAsAny.error;
        }
        return serialized;
    }
    if (typeof error === 'string') {
        return {
            message: error
        };
    }
    if (typeof error === 'object') {
        // It's already a plain object, but let's ensure message exists
        const errorObj = error;
        return {
            message: errorObj.message || errorObj.error || JSON.stringify(error),
            ...errorObj
        };
    }
    return {
        message: String(error)
    };
}
async function startAudioPlayer(player, track) {
    player.muted = false;
    player.autoplay = true;
    if (track != null) {
        player.srcObject = new MediaStream([
            track
        ]);
        await player.play();
    }
}
async function buildAudioPlayer(track, participantId) {
    const player = document.createElement('audio');
    player.dataset.participantId = participantId;
    document.body.appendChild(player);
    await startAudioPlayer(player, track);
    return player;
}
function destroyAudioPlayer(participantId) {
    const player = document.querySelector(`audio[data-participant-id="${participantId}"]`);
    player?.remove();
}
function subscribeToTracks(e, call, isVideoRecordingEnabled, isVideoEnabled) {
    if (e.participant.local) return;
    call.updateParticipant(e.participant.session_id, {
        setSubscribedTracks: {
            audio: true,
            video: isVideoRecordingEnabled || isVideoEnabled
        }
    });
}
class VapiEventEmitter extends events_1.default {
    on(event, listener) {
        super.on(event, listener);
        return this;
    }
    once(event, listener) {
        super.once(event, listener);
        return this;
    }
    emit(event, ...args) {
        return super.emit(event, ...args);
    }
    removeListener(event, listener) {
        super.removeListener(event, listener);
        return this;
    }
    removeAllListeners(event) {
        super.removeAllListeners(event);
        return this;
    }
}
class Vapi extends VapiEventEmitter {
    started = false;
    call = null;
    speakingTimeout = null;
    dailyCallConfig = {};
    dailyCallObject = {};
    hasEmittedCallEndedStatus = false;
    constructor(apiToken, apiBaseUrl, dailyCallConfig, dailyCallObject){
        super();
        client_1.client.baseUrl = apiBaseUrl ?? 'https://api.vapi.ai';
        client_1.client.setSecurityData(apiToken);
        this.dailyCallConfig = (0, daily_guards_1.createSafeDailyConfig)(dailyCallConfig);
        this.dailyCallObject = (0, daily_guards_1.createSafeDailyFactoryOptions)(dailyCallObject);
    }
    async cleanup() {
        this.started = false;
        this.hasEmittedCallEndedStatus = false;
        if (this.call) {
            await this.call.destroy();
            this.call = null;
        }
        this.speakingTimeout = null;
    }
    isMobileDevice() {
        if (typeof navigator === 'undefined') {
            return false;
        }
        const userAgent = navigator.userAgent;
        return /android|iphone|ipad|ipod|iemobile|blackberry|bada/i.test(userAgent.toLowerCase());
    }
    async sleep(ms) {
        return new Promise((resolve)=>setTimeout(resolve, ms));
    }
    async start(assistant, assistantOverrides, squad, workflow, workflowOverrides, options) {
        const startTime = Date.now();
        // Input validation with detailed error messages
        if (!assistant && !squad && !workflow) {
            const error = new Error('Assistant or Squad or Workflow must be provided.');
            this.emit('error', {
                type: 'validation-error',
                stage: 'input-validation',
                error: serializeError(error),
                timestamp: new Date().toISOString()
            });
            throw error;
        }
        if (this.started) {
            this.emit('call-start-progress', {
                stage: 'validation',
                status: 'failed',
                timestamp: new Date().toISOString(),
                metadata: {
                    reason: 'already-started'
                }
            });
            return null;
        }
        this.emit('call-start-progress', {
            stage: 'initialization',
            status: 'started',
            timestamp: new Date().toISOString(),
            metadata: {
                hasAssistant: !!assistant,
                hasSquad: !!squad,
                hasWorkflow: !!workflow
            }
        });
        this.started = true;
        try {
            // Stage 1: Create web call
            this.emit('call-start-progress', {
                stage: 'web-call-creation',
                status: 'started',
                timestamp: new Date().toISOString()
            });
            const webCallStartTime = Date.now();
            const webCall = (await client_1.client.call.callControllerCreateWebCall({
                assistant: typeof assistant === 'string' ? undefined : assistant,
                assistantId: typeof assistant === 'string' ? assistant : undefined,
                assistantOverrides,
                squad: typeof squad === 'string' ? undefined : squad,
                squadId: typeof squad === 'string' ? squad : undefined,
                workflow: typeof workflow === 'string' ? undefined : workflow,
                workflowId: typeof workflow === 'string' ? workflow : undefined,
                workflowOverrides,
                roomDeleteOnUserLeaveEnabled: options?.roomDeleteOnUserLeaveEnabled
            })).data;
            const webCallDuration = Date.now() - webCallStartTime;
            this.emit('call-start-progress', {
                stage: 'web-call-creation',
                status: 'completed',
                duration: webCallDuration,
                timestamp: new Date().toISOString(),
                metadata: {
                    callId: webCall?.id || 'unknown',
                    videoRecordingEnabled: webCall?.artifactPlan?.videoRecordingEnabled ?? false,
                    voiceProvider: webCall?.assistant?.voice?.provider || 'unknown'
                }
            });
            if (this.call) {
                this.emit('call-start-progress', {
                    stage: 'daily-call-object-creation',
                    status: 'started',
                    timestamp: new Date().toISOString(),
                    metadata: {
                        action: 'cleanup-existing'
                    }
                });
                await this.cleanup();
            }
            const isVideoRecordingEnabled = webCall?.artifactPlan?.videoRecordingEnabled ?? false;
            const isVideoEnabled = webCall?.assistant?.voice?.provider === 'tavus';
            // Stage 2: Create Daily call object
            this.emit('call-start-progress', {
                stage: 'daily-call-object-creation',
                status: 'started',
                timestamp: new Date().toISOString(),
                metadata: {
                    audioSource: this.dailyCallObject.audioSource ?? true,
                    videoSource: this.dailyCallObject.videoSource ?? isVideoRecordingEnabled,
                    isVideoRecordingEnabled,
                    isVideoEnabled
                }
            });
            const dailyCallStartTime = Date.now();
            try {
                this.call = daily_js_1.default.createCallObject({
                    audioSource: this.dailyCallObject.audioSource ?? true,
                    videoSource: this.dailyCallObject.videoSource ?? isVideoRecordingEnabled,
                    dailyConfig: this.dailyCallConfig
                });
                const dailyCallDuration = Date.now() - dailyCallStartTime;
                this.emit('call-start-progress', {
                    stage: 'daily-call-object-creation',
                    status: 'completed',
                    duration: dailyCallDuration,
                    timestamp: new Date().toISOString()
                });
            } catch (error) {
                const dailyCallDuration = Date.now() - dailyCallStartTime;
                const serializedError = serializeError(error);
                this.emit('call-start-progress', {
                    stage: 'daily-call-object-creation',
                    status: 'failed',
                    duration: dailyCallDuration,
                    timestamp: new Date().toISOString(),
                    metadata: {
                        error: serializedError.message
                    }
                });
                this.emit('error', {
                    type: 'daily-call-object-creation-error',
                    stage: 'daily-call-object-creation',
                    error: serializedError,
                    timestamp: new Date().toISOString()
                });
                throw error;
            }
            this.call.iframe()?.style.setProperty('display', 'none');
            this.call.on('left-meeting', ()=>{
                this.emit('call-end');
                if (!this.hasEmittedCallEndedStatus) {
                    this.emit('message', {
                        type: 'status-update',
                        status: 'ended',
                        'endedReason': 'customer-ended-call'
                    });
                    this.hasEmittedCallEndedStatus = true;
                }
                if (isVideoRecordingEnabled) {
                    this.call?.stopRecording();
                }
                this.cleanup().catch(console.error);
            });
            this.call.on('error', (error)=>{
                this.emit('error', {
                    type: 'daily-error',
                    error: serializeError(error),
                    timestamp: new Date().toISOString()
                });
                if (isVideoRecordingEnabled) {
                    this.call?.stopRecording();
                }
            });
            this.call.on('camera-error', (error)=>{
                this.emit('camera-error', {
                    type: 'camera-error',
                    error: serializeError(error),
                    timestamp: new Date().toISOString()
                });
            });
            this.call.on('network-quality-change', (event)=>{
                this.emit('network-quality-change', event);
            });
            this.call.on('network-connection', (event)=>{
                this.emit('network-connection', event);
            });
            this.call.on('track-started', async (e)=>{
                if (!e || !e.participant) {
                    return;
                }
                if (e.participant?.local) {
                    return;
                }
                if (e.participant?.user_name !== 'Vapi Speaker') {
                    return;
                }
                if (e.track.kind === 'video') {
                    this.emit('video', e.track);
                }
                if (e.track.kind === 'audio') {
                    await buildAudioPlayer(e.track, e.participant.session_id);
                }
                this.call?.sendAppMessage('playable');
            });
            this.call.on('participant-joined', (e)=>{
                if (!e || !this.call) return;
                subscribeToTracks(e, this.call, isVideoRecordingEnabled, isVideoEnabled);
            });
            this.call.on('participant-updated', (e)=>{
                if (!e) {
                    return;
                }
                this.emit('daily-participant-updated', e.participant);
            });
            this.call.on('participant-left', (e)=>{
                if (!e) {
                    return;
                }
                destroyAudioPlayer(e.participant.session_id);
            });
            // Stage 3: Mobile device handling and permissions
            const isMobile = this.isMobileDevice();
            this.emit('call-start-progress', {
                stage: 'mobile-permissions',
                status: 'started',
                timestamp: new Date().toISOString(),
                metadata: {
                    isMobile
                }
            });
            if (isMobile) {
                const mobileWaitStartTime = Date.now();
                await this.sleep(1000);
                const mobileWaitDuration = Date.now() - mobileWaitStartTime;
                this.emit('call-start-progress', {
                    stage: 'mobile-permissions',
                    status: 'completed',
                    duration: mobileWaitDuration,
                    timestamp: new Date().toISOString(),
                    metadata: {
                        action: 'permissions-wait'
                    }
                });
            } else {
                this.emit('call-start-progress', {
                    stage: 'mobile-permissions',
                    status: 'completed',
                    timestamp: new Date().toISOString(),
                    metadata: {
                        action: 'skipped-not-mobile'
                    }
                });
            }
            // Stage 4: Join the call
            this.emit('call-start-progress', {
                stage: 'daily-call-join',
                status: 'started',
                timestamp: new Date().toISOString()
            });
            const joinStartTime = Date.now();
            try {
                await this.call.join({
                    // @ts-expect-error This exists
                    url: webCall.webCallUrl,
                    subscribeToTracksAutomatically: false
                });
                const joinDuration = Date.now() - joinStartTime;
                this.emit('call-start-progress', {
                    stage: 'daily-call-join',
                    status: 'completed',
                    duration: joinDuration,
                    timestamp: new Date().toISOString()
                });
            } catch (error) {
                const joinDuration = Date.now() - joinStartTime;
                const serializedError = serializeError(error);
                this.emit('call-start-progress', {
                    stage: 'daily-call-join',
                    status: 'failed',
                    duration: joinDuration,
                    timestamp: new Date().toISOString(),
                    metadata: {
                        error: serializedError.message
                    }
                });
                this.emit('error', {
                    type: 'daily-call-join-error',
                    stage: 'daily-call-join',
                    error: serializedError,
                    duration: joinDuration,
                    timestamp: new Date().toISOString()
                });
                throw error;
            }
            // Stage 5: Video recording setup (if enabled)
            if (isVideoRecordingEnabled) {
                this.emit('call-start-progress', {
                    stage: 'video-recording-setup',
                    status: 'started',
                    timestamp: new Date().toISOString()
                });
                const recordingRequestedTime = new Date().getTime();
                const recordingStartTime = Date.now();
                try {
                    this.call.startRecording({
                        width: 1280,
                        height: 720,
                        backgroundColor: '#FF1F2D3D',
                        layout: {
                            preset: 'default'
                        }
                    });
                    const recordingSetupDuration = Date.now() - recordingStartTime;
                    this.emit('call-start-progress', {
                        stage: 'video-recording-setup',
                        status: 'completed',
                        duration: recordingSetupDuration,
                        timestamp: new Date().toISOString()
                    });
                    this.call.on('recording-started', ()=>{
                        const totalRecordingDelay = (new Date().getTime() - recordingRequestedTime) / 1000;
                        this.emit('call-start-progress', {
                            stage: 'video-recording-started',
                            status: 'completed',
                            timestamp: new Date().toISOString(),
                            metadata: {
                                delaySeconds: totalRecordingDelay
                            }
                        });
                        this.send({
                            type: 'control',
                            control: 'say-first-message',
                            videoRecordingStartDelaySeconds: totalRecordingDelay
                        });
                    });
                } catch (error) {
                    const recordingSetupDuration = Date.now() - recordingStartTime;
                    const serializedError = serializeError(error);
                    this.emit('call-start-progress', {
                        stage: 'video-recording-setup',
                        status: 'failed',
                        duration: recordingSetupDuration,
                        timestamp: new Date().toISOString(),
                        metadata: {
                            error: serializedError.message
                        }
                    });
                    this.emit('error', {
                        type: 'video-recording-setup-error',
                        stage: 'video-recording-setup',
                        error: serializedError,
                        timestamp: new Date().toISOString()
                    });
                // Don't throw here, video recording is optional
                }
            } else {
                this.emit('call-start-progress', {
                    stage: 'video-recording-setup',
                    status: 'completed',
                    timestamp: new Date().toISOString(),
                    metadata: {
                        action: 'skipped-not-enabled'
                    }
                });
            }
            // Stage 6: Audio level observer setup
            this.emit('call-start-progress', {
                stage: 'audio-observer-setup',
                status: 'started',
                timestamp: new Date().toISOString()
            });
            const audioObserverStartTime = Date.now();
            try {
                this.call.startRemoteParticipantsAudioLevelObserver(100);
                const audioObserverDuration = Date.now() - audioObserverStartTime;
                this.emit('call-start-progress', {
                    stage: 'audio-observer-setup',
                    status: 'completed',
                    duration: audioObserverDuration,
                    timestamp: new Date().toISOString()
                });
            } catch (error) {
                const audioObserverDuration = Date.now() - audioObserverStartTime;
                const serializedError = serializeError(error);
                this.emit('call-start-progress', {
                    stage: 'audio-observer-setup',
                    status: 'failed',
                    duration: audioObserverDuration,
                    timestamp: new Date().toISOString(),
                    metadata: {
                        error: serializedError.message
                    }
                });
                this.emit('error', {
                    type: 'audio-observer-setup-error',
                    stage: 'audio-observer-setup',
                    error: serializedError,
                    timestamp: new Date().toISOString()
                });
            // Don't throw here, this is non-critical
            }
            this.call.on('remote-participants-audio-level', (e)=>{
                if (e) this.handleRemoteParticipantsAudioLevel(e);
            });
            this.call.on('app-message', (e)=>this.onAppMessage(e));
            this.call.on('nonfatal-error', (e)=>{
                // https://docs.daily.co/reference/daily-js/events/meeting-events#type-audio-processor-error
                if (e?.type === 'audio-processor-error') {
                    this.call?.updateInputSettings({
                        audio: {
                            processor: {
                                type: 'none'
                            }
                        }
                    }).then(()=>{
                        (0, daily_guards_1.safeSetLocalAudio)(this.call, true);
                    });
                }
            });
            // Stage 7: Audio processing setup
            this.emit('call-start-progress', {
                stage: 'audio-processing-setup',
                status: 'started',
                timestamp: new Date().toISOString()
            });
            const audioProcessingStartTime = Date.now();
            try {
                this.call.updateInputSettings({
                    audio: {
                        processor: {
                            type: 'noise-cancellation'
                        }
                    }
                });
                const audioProcessingDuration = Date.now() - audioProcessingStartTime;
                this.emit('call-start-progress', {
                    stage: 'audio-processing-setup',
                    status: 'completed',
                    duration: audioProcessingDuration,
                    timestamp: new Date().toISOString()
                });
            } catch (error) {
                const audioProcessingDuration = Date.now() - audioProcessingStartTime;
                const serializedError = serializeError(error);
                this.emit('call-start-progress', {
                    stage: 'audio-processing-setup',
                    status: 'failed',
                    duration: audioProcessingDuration,
                    timestamp: new Date().toISOString(),
                    metadata: {
                        error: serializedError.message
                    }
                });
                this.emit('error', {
                    type: 'audio-processing-setup-error',
                    stage: 'audio-processing-setup',
                    error: serializedError,
                    timestamp: new Date().toISOString()
                });
            // Don't throw here, this is non-critical
            }
            const totalDuration = Date.now() - startTime;
            this.emit('call-start-success', {
                totalDuration,
                callId: webCall?.id || 'unknown',
                timestamp: new Date().toISOString()
            });
            return webCall;
        } catch (e) {
            const totalDuration = Date.now() - startTime;
            const serializedError = serializeError(e);
            this.emit('call-start-failed', {
                stage: 'unknown',
                totalDuration,
                error: serializedError.message,
                errorStack: serializedError.stack || 'No stack trace available',
                timestamp: new Date().toISOString(),
                context: {
                    hasAssistant: !!assistant,
                    hasSquad: !!squad,
                    hasWorkflow: !!workflow,
                    isMobile: this.isMobileDevice()
                }
            });
            // Also emit the generic error event for backward compatibility
            this.emit('error', {
                type: 'start-method-error',
                stage: 'unknown',
                error: serializedError,
                totalDuration,
                timestamp: new Date().toISOString(),
                context: {
                    hasAssistant: !!assistant,
                    hasSquad: !!squad,
                    hasWorkflow: !!workflow,
                    isMobile: this.isMobileDevice()
                }
            });
            await this.cleanup();
            return null;
        }
    }
    onAppMessage(e) {
        if (!e) {
            return;
        }
        try {
            if (e.data === 'listening') {
                return this.emit('call-start');
            } else {
                try {
                    const parsedMessage = JSON.parse(e.data);
                    this.emit('message', parsedMessage);
                    if (parsedMessage && 'type' in parsedMessage && 'status' in parsedMessage && parsedMessage.type === 'status-update' && parsedMessage.status === 'ended') {
                        this.hasEmittedCallEndedStatus = true;
                    }
                } catch (parseError) {
                    console.log('Error parsing message data: ', parseError);
                }
            }
        } catch (e) {
            console.error(e);
        }
    }
    handleRemoteParticipantsAudioLevel(e) {
        const speechLevel = Object.values(e.participantsAudioLevel).reduce((a, b)=>a + b, 0);
        this.emit('volume-level', Math.min(1, speechLevel / 0.15));
        const isSpeaking = speechLevel > 0.01;
        if (!isSpeaking) {
            return;
        }
        if (this.speakingTimeout) {
            clearTimeout(this.speakingTimeout);
            this.speakingTimeout = null;
        } else {
            this.emit('speech-start');
        }
        this.speakingTimeout = setTimeout(()=>{
            this.emit('speech-end');
            this.speakingTimeout = null;
        }, 1000);
    }
    /**
     * Stops the call by destroying the Daily call object.
     *
     * If `roomDeleteOnUserLeaveEnabled` is set to `false`, the Vapi call will be kept alive, allowing reconnections to the same call using the `reconnect` method.
     * If `roomDeleteOnUserLeaveEnabled` is set to `true`, the Vapi call will also be destroyed, preventing any reconnections.
     */ async stop() {
        this.started = false;
        if (this.call) {
            await this.call.destroy();
            this.call = null;
        }
        this.speakingTimeout = null;
    }
    /**
     * Sends a Live Call Control message to the Vapi server.
     *
     * Docs: https://docs.vapi.ai/calls/call-features
     */ send(message) {
        this.call?.sendAppMessage(JSON.stringify(message));
    }
    setMuted(mute) {
        (0, daily_guards_1.safeSetLocalAudio)(this.call, !mute);
    }
    isMuted() {
        if (!this.call) {
            return false;
        }
        return this.call.localAudio() === false;
    }
    say(message, endCallAfterSpoken, interruptionsEnabled, interruptAssistantEnabled) {
        this.send({
            type: 'say',
            message,
            endCallAfterSpoken,
            interruptionsEnabled: interruptionsEnabled ?? false,
            interruptAssistantEnabled: interruptAssistantEnabled ?? false
        });
    }
    /**
     * Ends the call immediately by sending a `end-call` message using Live Call Control, and destroys the Daily call object.
     *
     * This method always ends the call, regardless of the `roomDeleteOnUserLeaveEnabled` option.
     */ end() {
        this.send({
            type: 'end-call'
        });
        this.stop();
    }
    setInputDevicesAsync(options) {
        return (0, daily_guards_1.safeSetInputDevicesAsync)(this.call, options);
    }
    async increaseMicLevel(gain) {
        if (!this.call) {
            throw new Error('Call object is not available.');
        }
        try {
            const stream = await navigator.mediaDevices.getUserMedia({
                audio: true
            });
            const audioContext = new AudioContext();
            const source = audioContext.createMediaStreamSource(stream);
            const gainNode = audioContext.createGain();
            gainNode.gain.value = gain;
            source.connect(gainNode);
            const destination = audioContext.createMediaStreamDestination();
            gainNode.connect(destination);
            const [boostedTrack] = destination.stream.getAudioTracks();
            await (0, daily_guards_1.safeSetInputDevicesAsync)(this.call, {
                audioSource: boostedTrack
            });
        } catch (error) {
            console.error("Error adjusting microphone level:", error);
        }
    }
    setOutputDeviceAsync(options) {
        this.call?.setOutputDeviceAsync(options);
    }
    getDailyCallObject() {
        return this.call;
    }
    startScreenSharing(displayMediaOptions, screenVideoSendSettings) {
        this.call?.startScreenShare({
            displayMediaOptions,
            screenVideoSendSettings
        });
    }
    stopScreenSharing() {
        this.call?.stopScreenShare();
    }
    /**
     * Reconnects to an active call.
     *
     *
     * @param webCall
     */ async reconnect(webCall) {
        const startTime = Date.now();
        if (this.started) {
            throw new Error('Cannot reconnect while a call is already in progress. Call stop() first.');
        }
        if (!webCall.webCallUrl) {
            throw new Error('webCallUrl is required for reconnection.');
        }
        this.emit('call-start-progress', {
            stage: 'reconnect-initialization',
            status: 'started',
            timestamp: new Date().toISOString(),
            metadata: {
                callId: webCall.id || 'unknown',
                hasVideoRecording: !!webCall?.artifactPlan?.videoRecordingEnabled,
                voiceProvider: webCall?.assistant?.voice?.provider || 'unknown'
            }
        });
        this.started = true;
        try {
            // Clean up any existing call object
            if (this.call) {
                this.emit('call-start-progress', {
                    stage: 'cleanup-existing-call',
                    status: 'started',
                    timestamp: new Date().toISOString()
                });
                await this.cleanup();
                this.emit('call-start-progress', {
                    stage: 'cleanup-existing-call',
                    status: 'completed',
                    timestamp: new Date().toISOString()
                });
            }
            const isVideoRecordingEnabled = webCall?.artifactPlan?.videoRecordingEnabled ?? false;
            const isVideoEnabled = webCall?.assistant?.voice?.provider === 'tavus';
            // Stage 1: Create Daily call object
            this.emit('call-start-progress', {
                stage: 'daily-call-object-creation',
                status: 'started',
                timestamp: new Date().toISOString(),
                metadata: {
                    audioSource: this.dailyCallObject.audioSource ?? true,
                    videoSource: this.dailyCallObject.videoSource ?? isVideoRecordingEnabled,
                    isVideoRecordingEnabled,
                    isVideoEnabled
                }
            });
            const dailyCallStartTime = Date.now();
            this.call = daily_js_1.default.createCallObject({
                audioSource: this.dailyCallObject.audioSource ?? true,
                videoSource: this.dailyCallObject.videoSource ?? isVideoRecordingEnabled,
                dailyConfig: this.dailyCallConfig
            });
            const dailyCallDuration = Date.now() - dailyCallStartTime;
            this.emit('call-start-progress', {
                stage: 'daily-call-object-creation',
                status: 'completed',
                duration: dailyCallDuration,
                timestamp: new Date().toISOString()
            });
            this.call.iframe()?.style.setProperty('display', 'none');
            // Set up event listeners
            this.call.on('left-meeting', ()=>{
                this.emit('call-end');
                if (!this.hasEmittedCallEndedStatus) {
                    this.emit('message', {
                        type: 'status-update',
                        status: 'ended',
                        'endedReason': 'customer-ended-call'
                    });
                    this.hasEmittedCallEndedStatus = true;
                }
                if (isVideoRecordingEnabled) {
                    this.call?.stopRecording();
                }
                this.cleanup().catch(console.error);
            });
            this.call.on('error', (error)=>{
                this.emit('error', {
                    type: 'daily-error',
                    error: serializeError(error),
                    timestamp: new Date().toISOString()
                });
                if (isVideoRecordingEnabled) {
                    this.call?.stopRecording();
                }
            });
            this.call.on('camera-error', (error)=>{
                this.emit('camera-error', {
                    type: 'camera-error',
                    error: serializeError(error),
                    timestamp: new Date().toISOString()
                });
            });
            this.call.on('network-quality-change', (event)=>{
                this.emit('network-quality-change', event);
            });
            this.call.on('network-connection', (event)=>{
                this.emit('network-connection', event);
            });
            this.call.on('track-started', async (e)=>{
                if (!e || !e.participant) {
                    return;
                }
                if (e.participant?.local) {
                    return;
                }
                if (e.participant?.user_name !== 'Vapi Speaker') {
                    return;
                }
                if (e.track.kind === 'video') {
                    this.emit('video', e.track);
                }
                if (e.track.kind === 'audio') {
                    await buildAudioPlayer(e.track, e.participant.session_id);
                }
                this.call?.sendAppMessage('playable');
            });
            this.call.on('participant-joined', (e)=>{
                if (!e || !this.call) return;
                subscribeToTracks(e, this.call, isVideoRecordingEnabled, isVideoEnabled);
            });
            this.call.on('participant-updated', (e)=>{
                if (!e) {
                    return;
                }
                this.emit('daily-participant-updated', e.participant);
            });
            this.call.on('participant-left', (e)=>{
                if (!e) {
                    return;
                }
                destroyAudioPlayer(e.participant.session_id);
            });
            this.call.on('remote-participants-audio-level', (e)=>{
                if (e) this.handleRemoteParticipantsAudioLevel(e);
            });
            this.call.on('app-message', (e)=>this.onAppMessage(e));
            this.call.on('nonfatal-error', (e)=>{
                // https://docs.daily.co/reference/daily-js/events/meeting-events#type-audio-processor-error
                if (e?.type === 'audio-processor-error') {
                    this.call?.updateInputSettings({
                        audio: {
                            processor: {
                                type: 'none'
                            }
                        }
                    }).then(()=>{
                        (0, daily_guards_1.safeSetLocalAudio)(this.call, true);
                    });
                }
            });
            // Stage 2: Mobile device handling and permissions
            const isMobile = this.isMobileDevice();
            this.emit('call-start-progress', {
                stage: 'mobile-permissions',
                status: 'started',
                timestamp: new Date().toISOString(),
                metadata: {
                    isMobile
                }
            });
            if (isMobile) {
                const mobileWaitStartTime = Date.now();
                await this.sleep(1000);
                const mobileWaitDuration = Date.now() - mobileWaitStartTime;
                this.emit('call-start-progress', {
                    stage: 'mobile-permissions',
                    status: 'completed',
                    duration: mobileWaitDuration,
                    timestamp: new Date().toISOString(),
                    metadata: {
                        action: 'permissions-wait'
                    }
                });
            } else {
                this.emit('call-start-progress', {
                    stage: 'mobile-permissions',
                    status: 'completed',
                    timestamp: new Date().toISOString(),
                    metadata: {
                        action: 'skipped-not-mobile'
                    }
                });
            }
            // Stage 3: Join the call
            this.emit('call-start-progress', {
                stage: 'daily-call-join',
                status: 'started',
                timestamp: new Date().toISOString()
            });
            const joinStartTime = Date.now();
            await this.call.join({
                url: webCall.webCallUrl,
                subscribeToTracksAutomatically: false
            });
            const joinDuration = Date.now() - joinStartTime;
            this.emit('call-start-progress', {
                stage: 'daily-call-join',
                status: 'completed',
                duration: joinDuration,
                timestamp: new Date().toISOString()
            });
            // Stage 4: Video recording setup (if enabled)
            if (isVideoRecordingEnabled) {
                this.emit('call-start-progress', {
                    stage: 'video-recording-setup',
                    status: 'started',
                    timestamp: new Date().toISOString()
                });
                const recordingStartTime = Date.now();
                const recordingRequestedTime = new Date().getTime();
                try {
                    this.call.startRecording({
                        width: 1280,
                        height: 720,
                        backgroundColor: '#FF1F2D3D',
                        layout: {
                            preset: 'default'
                        }
                    });
                    const recordingSetupDuration = Date.now() - recordingStartTime;
                    this.emit('call-start-progress', {
                        stage: 'video-recording-setup',
                        status: 'completed',
                        duration: recordingSetupDuration,
                        timestamp: new Date().toISOString()
                    });
                    this.call.on('recording-started', ()=>{
                        const totalRecordingDelay = (new Date().getTime() - recordingRequestedTime) / 1000;
                        this.emit('call-start-progress', {
                            stage: 'video-recording-started',
                            status: 'completed',
                            timestamp: new Date().toISOString(),
                            metadata: {
                                delaySeconds: totalRecordingDelay
                            }
                        });
                        this.send({
                            type: 'control',
                            control: 'say-first-message',
                            videoRecordingStartDelaySeconds: totalRecordingDelay
                        });
                    });
                } catch (error) {
                    const recordingSetupDuration = Date.now() - recordingStartTime;
                    const serializedError = serializeError(error);
                    this.emit('call-start-progress', {
                        stage: 'video-recording-setup',
                        status: 'failed',
                        duration: recordingSetupDuration,
                        timestamp: new Date().toISOString(),
                        metadata: {
                            error: serializedError.message
                        }
                    });
                // Don't throw here, video recording is optional
                }
            } else {
                this.emit('call-start-progress', {
                    stage: 'video-recording-setup',
                    status: 'completed',
                    timestamp: new Date().toISOString(),
                    metadata: {
                        action: 'skipped-not-enabled'
                    }
                });
            }
            // Stage 5: Audio level observer setup
            this.emit('call-start-progress', {
                stage: 'audio-observer-setup',
                status: 'started',
                timestamp: new Date().toISOString()
            });
            const audioObserverStartTime = Date.now();
            try {
                this.call.startRemoteParticipantsAudioLevelObserver(100);
                const audioObserverDuration = Date.now() - audioObserverStartTime;
                this.emit('call-start-progress', {
                    stage: 'audio-observer-setup',
                    status: 'completed',
                    duration: audioObserverDuration,
                    timestamp: new Date().toISOString()
                });
            } catch (error) {
                const audioObserverDuration = Date.now() - audioObserverStartTime;
                const serializedError = serializeError(error);
                this.emit('call-start-progress', {
                    stage: 'audio-observer-setup',
                    status: 'failed',
                    duration: audioObserverDuration,
                    timestamp: new Date().toISOString(),
                    metadata: {
                        error: serializedError.message
                    }
                });
            // Don't throw here, this is non-critical
            }
            // Stage 6: Audio processing setup
            this.emit('call-start-progress', {
                stage: 'audio-processing-setup',
                status: 'started',
                timestamp: new Date().toISOString()
            });
            const audioProcessingStartTime = Date.now();
            try {
                this.call.updateInputSettings({
                    audio: {
                        processor: {
                            type: 'noise-cancellation'
                        }
                    }
                });
                const audioProcessingDuration = Date.now() - audioProcessingStartTime;
                this.emit('call-start-progress', {
                    stage: 'audio-processing-setup',
                    status: 'completed',
                    duration: audioProcessingDuration,
                    timestamp: new Date().toISOString()
                });
            } catch (error) {
                const audioProcessingDuration = Date.now() - audioProcessingStartTime;
                const serializedError = serializeError(error);
                this.emit('call-start-progress', {
                    stage: 'audio-processing-setup',
                    status: 'failed',
                    duration: audioProcessingDuration,
                    timestamp: new Date().toISOString(),
                    metadata: {
                        error: serializedError.message
                    }
                });
            // Don't throw here, this is non-critical
            }
            const totalDuration = Date.now() - startTime;
            this.emit('call-start-success', {
                totalDuration,
                callId: webCall?.id || 'unknown',
                timestamp: new Date().toISOString()
            });
            this.emit('call-start');
        } catch (e) {
            const totalDuration = Date.now() - startTime;
            const serializedError = serializeError(e);
            this.emit('call-start-failed', {
                stage: 'reconnect',
                totalDuration,
                error: serializedError.message,
                errorStack: serializedError.stack || 'No stack trace available',
                timestamp: new Date().toISOString(),
                context: {
                    isReconnect: true,
                    callId: webCall?.id || 'unknown',
                    hasVideoRecording: !!webCall?.artifactPlan?.videoRecordingEnabled,
                    voiceProvider: webCall?.assistant?.voice?.provider || 'unknown',
                    isMobile: this.isMobileDevice()
                }
            });
            // Also emit the generic error event for backward compatibility
            this.emit('error', {
                type: 'reconnect-error',
                error: serializedError,
                totalDuration,
                timestamp: new Date().toISOString(),
                context: {
                    isReconnect: true,
                    callId: webCall?.id || 'unknown',
                    hasVideoRecording: !!webCall?.artifactPlan?.videoRecordingEnabled,
                    voiceProvider: webCall?.assistant?.voice?.provider || 'unknown',
                    isMobile: this.isMobileDevice()
                }
            });
            await this.cleanup();
            throw e;
        }
    }
    /**
     * Runs all network connectivity tests for pre-call diagnostics.
     * Creates a temporary Daily call object for testing purposes.
     *
     * Tests performed:
     * 1. Network connectivity (TURN server) - Tests if traffic can be relayed through TURN servers
     * 2. Websocket connectivity - Tests if websocket connections can be established
     * 3. Call quality - Tests overall call quality metrics (if available in SDK version)
     *
     * @returns {Promise<Record<string, any>>} Test results object with status for each test
     *
     * @example
     * // Run pre-call network diagnostics
     * const results = await Vapi.runNetworkTestsStandalone();
     * if (results.networkConnectivity?.result === 'failed') {
     *   console.warn('Network issues detected - calls may not work properly');
     * }
     *
     * @static
     */ static async runNetworkTestsStandalone() {
        console.log('Starting standalone network connectivity tests...');
        const results = {};
        let tempCall = null;
        try {
            // Create a temporary call object for testing
            console.log('Creating temporary call object for testing...');
            tempCall = daily_js_1.default.createCallObject({
                audioSource: true,
                videoSource: true
            });
            // Test 1: Network Connectivity (TURN server test)
            console.log('\n1. Testing network connectivity (TURN server)...');
            let videoTrack = null;
            try {
                // Create a dummy video track for the test
                const stream = await navigator.mediaDevices.getUserMedia({
                    video: true
                });
                videoTrack = stream.getVideoTracks()[0];
                const networkTest = await tempCall.testNetworkConnectivity(videoTrack);
                results.networkConnectivity = networkTest;
                console.log('Network connectivity test result:', networkTest);
            } catch (error) {
                results.networkConnectivity = {
                    result: 'error',
                    error: error?.toString()
                };
                console.error('Network connectivity test error:', error);
            } finally{
                // Clean up the video track
                if (videoTrack) {
                    videoTrack.stop();
                }
            }
            // Test 2: Websocket Connectivity
            console.log('\n2. Testing websocket connectivity...');
            try {
                const websocketTest = await tempCall.testWebsocketConnectivity();
                results.websocketConnectivity = websocketTest;
                console.log('Websocket connectivity test result:', websocketTest);
            } catch (error) {
                results.websocketConnectivity = {
                    result: 'error',
                    error: error?.toString()
                };
                console.error('Websocket connectivity test error:', error);
            }
            // Test 3: Call Quality (if available)
            console.log('\n3. Testing call quality...');
            try {
                // Check if the method exists
                if (typeof tempCall.testCallQuality === 'function') {
                    // Call quality test requires startCamera to initialize call state
                    try {
                        // Use startCamera to initialize the call state without needing a room
                        console.log('Initializing call state with startCamera...');
                        await tempCall.startCamera();
                        // Now run the call quality test
                        const callQualityTest = await tempCall.testCallQuality();
                        results.callQuality = callQualityTest;
                        console.log('Call quality test result:', callQualityTest);
                    // Camera will be cleaned up when we destroy the call object
                    } catch (startCameraError) {
                        // If startCamera fails, it might be due to permissions or other issues
                        console.error('Failed to start camera for call quality test:', startCameraError);
                        results.callQuality = {
                            result: 'error',
                            error: startCameraError?.toString(),
                            message: 'Failed to initialize camera for call quality test. Check camera permissions.'
                        };
                    }
                } else {
                    results.callQuality = {
                        result: 'not-available',
                        message: 'testCallQuality method not available'
                    };
                    console.log('Call quality test not available in current Daily.co version');
                }
            } catch (error) {
                results.callQuality = {
                    result: 'error',
                    error: error?.toString()
                };
                console.error('Call quality test error:', error);
            }
        } catch (error) {
            console.error('Failed to create temporary call object:', error);
            results.error = error?.toString();
        } finally{
            // Clean up the temporary call object
            if (tempCall) {
                try {
                    console.log('Cleaning up temporary call object...');
                    await tempCall.destroy();
                } catch (error) {
                    console.error('Error destroying temporary call object:', error);
                }
            }
        }
        // Summary
        console.log('\n=== Network Test Summary ===');
        console.log('Results:', JSON.stringify(results, null, 2));
        return results;
    }
}
exports.default = Vapi;
}),
];

//# sourceMappingURL=e5189_%40vapi-ai_web_dist_b6aff8f2._.js.map