import type { INodeProperties } from 'n8n-workflow';

const showForApm = { resource: ['apm'] };

export const apmDescription: INodeProperties[] = [
  // ─── Operation selector ────────────────────────────────────────────────────
  {
    displayName: 'Operation',
    name: 'operation',
    type: 'options',
    noDataExpression: true,
    displayOptions: { show: showForApm },
    options: [
      {
        name: 'Delete Access Policy',
        value: 'deletePolicy',
        action: 'Delete an APM access policy',
        description: 'Permanently delete an Access Policy Manager policy',
        routing: {
          request: {
            method: 'DELETE',
            url: '=/apm/policies/{{$parameter["policyId"]}}',
          },
        },
      },
      {
        name: 'Delete Session',
        value: 'deleteSession',
        action: 'Delete a user session',
        description: 'Terminate and remove an active APM user session',
        routing: {
          request: {
            method: 'DELETE',
            url: '=/mgmt/tm/apm/session/{{$parameter["sessionId"]}}',
          },
        },
      },
      {
        name: 'Get Access Policy',
        value: 'getPolicy',
        action: 'Get an APM access policy',
        description: 'Retrieve details of a specific Access Policy Manager policy',
        routing: {
          request: {
            method: 'GET',
            url: '=/apm/policies/{{$parameter["policyId"]}}',
          },
        },
      },
      {
        name: 'Get All Sessions',
        value: 'getAllSessions',
        action: 'Get all active APM sessions',
        description: 'Retrieve a list of all current APM user sessions',
        routing: {
          request: {
            method: 'GET',
            url: '/mgmt/tm/apm/access-info',
          },
        },
      },
      {
        name: 'Get OAuth Token Statistics',
        value: 'getOAuthTokenStats',
        action: 'Get OAuth token statistics',
        description: 'Retrieve a count and summary of active OAuth tokens',
        routing: {
          request: {
            method: 'GET',
            url: '/mgmt/tm/apm/oauth/token-details/stats',
          },
        },
      },
      {
        name: 'Get Reports',
        value: 'getReports',
        action: 'Get APM reports',
        description: 'Retrieve all resources in the APM report collection',
        routing: {
          request: {
            method: 'GET',
            url: '/mgmt/tm/apm/report',
          },
        },
      },
      {
        name: 'Revoke OAuth Token',
        value: 'revokeOAuthToken',
        action: 'Revoke an OAuth token',
        description: 'Immediately revoke an active OAuth access token',
        routing: {
          request: {
            method: 'POST',
            url: '/mgmt/tm/apm/oauth/token-details',
          },
        },
      },
      {
        name: 'Update Access Policy',
        value: 'updatePolicy',
        action: 'Update an APM access policy',
        description: 'Modify the configuration of an existing Access Policy Manager policy',
        routing: {
          request: {
            method: 'PATCH',
            url: '=/apm/policies/{{$parameter["policyId"]}}',
          },
        },
      },
    ],
    default: 'getAllSessions',
  },

  // ─── Policy ID (shared by getPolicy, updatePolicy, deletePolicy) ───────────
  {
    displayName: 'Policy ID',
    name: 'policyId',
    type: 'string',
    default: '',
    required: true,
    placeholder: 'my_access_policy',
    description: 'The ID or name of the APM access policy',
    displayOptions: {
      show: {
        resource: ['apm'],
        operation: ['getPolicy', 'updatePolicy', 'deletePolicy'],
      },
    },
  },

  // ─── Session ID (deleteSession) ────────────────────────────────────────────
  {
    displayName: 'Session ID',
    name: 'sessionId',
    type: 'string',
    default: '',
    required: true,
    description: 'The unique ID of the APM user session to terminate',
    displayOptions: {
      show: {
        resource: ['apm'],
        operation: ['deleteSession'],
      },
    },
  },

  // ─── Update Policy fields ──────────────────────────────────────────────────
  {
    displayName: 'Update Fields',
    name: 'policyUpdateFields',
    type: 'collection',
    placeholder: 'Add Field',
    default: {},
    description: 'Policy properties to update',
    displayOptions: {
      show: {
        resource: ['apm'],
        operation: ['updatePolicy'],
      },
    },
    options: [
      {
        displayName: 'Description',
        name: 'description',
        type: 'string',
        default: '',
        routing: {
          send: {
            type: 'body',
            property: 'description',
          },
        },
      },
      {
        displayName: 'Name',
        name: 'name',
        type: 'string',
        default: '',
        description: 'New name for the policy',
        routing: {
          send: {
            type: 'body',
            property: 'name',
          },
        },
      },
    ],
  },

  // ─── Revoke OAuth Token fields ─────────────────────────────────────────────
  {
    displayName: 'Token',
    name: 'oauthToken',
    type: 'string',
    typeOptions: {
      password: true,
    },
    default: '',
    required: true,
    description: 'The OAuth access token string to revoke',
    displayOptions: {
      show: {
        resource: ['apm'],
        operation: ['revokeOAuthToken'],
      },
    },
    routing: {
      send: {
        type: 'body',
        property: 'token',
      },
    },
  },
];
