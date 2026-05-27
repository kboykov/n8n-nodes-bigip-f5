import type { INodeProperties } from 'n8n-workflow';

const showForAuth = { resource: ['auth'] };

export const authDescription: INodeProperties[] = [
  // ─── Operation selector ────────────────────────────────────────────────────
  {
    displayName: 'Operation',
    name: 'operation',
    type: 'options',
    noDataExpression: true,
    displayOptions: { show: showForAuth },
    options: [
      {
        name: 'Get Modules',
        value: 'getModules',
        action: 'Get available modules',
        description: 'Discover all licensed and provisioned modules on the BIG-IP',
        routing: {
          request: {
            method: 'GET',
            url: '/modules',
          },
        },
      },
      {
        name: 'Get Token Details',
        value: 'getTokenDetails',
        action: 'Get auth token details',
        description: 'Retrieve metadata and expiry info for an existing authentication token',
        routing: {
          request: {
            method: 'GET',
            url: '=/mgmt/shared/authz/tokens/{{$parameter["tokenUuid"]}}',
          },
        },
      },
      {
        name: 'Request Token',
        value: 'requestToken',
        action: 'Request an authentication token',
        description:
          'Authenticate with username and password to obtain a BIG-IP iControl REST token',
        routing: {
          request: {
            method: 'POST',
            url: '/mgmt/shared/authn/login',
          },
        },
      },
    ],
    default: 'requestToken',
  },

  // ─── Request Token ─────────────────────────────────────────────────────────
  {
    displayName: 'Username',
    name: 'loginUsername',
    type: 'string',
    default: '',
    required: true,
    description: 'BIG-IP username to authenticate as',
    displayOptions: {
      show: {
        resource: ['auth'],
        operation: ['requestToken'],
      },
    },
    routing: {
      send: {
        type: 'body',
        property: 'username',
      },
    },
  },
  {
    displayName: 'Password',
    name: 'loginPassword',
    type: 'string',
    typeOptions: {
      password: true,
    },
    default: '',
    required: true,
    description: 'Password for the BIG-IP user',
    displayOptions: {
      show: {
        resource: ['auth'],
        operation: ['requestToken'],
      },
    },
    routing: {
      send: {
        type: 'body',
        property: 'password',
      },
    },
  },
  {
    displayName: 'Login Provider Name',
    name: 'loginProviderName',
    type: 'string',
    default: 'tmos',
    description:
      'Authentication provider to use. Use "tmos" for local auth, or an LDAP/RADIUS provider name.',
    displayOptions: {
      show: {
        resource: ['auth'],
        operation: ['requestToken'],
      },
    },
    routing: {
      send: {
        type: 'body',
        property: 'loginProviderName',
      },
    },
  },

  // ─── Get Token Details ─────────────────────────────────────────────────────
  {
    displayName: 'Token UUID',
    name: 'tokenUuid',
    type: 'string',
    typeOptions: {
      password: true,
    },
    default: '',
    required: true,
    description: 'UUID of the authentication token to look up',
    displayOptions: {
      show: {
        resource: ['auth'],
        operation: ['getTokenDetails'],
      },
    },
  },
];
