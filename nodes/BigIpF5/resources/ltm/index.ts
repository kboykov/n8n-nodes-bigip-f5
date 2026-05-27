import type { INodeProperties } from 'n8n-workflow';

const showForLtm = { resource: ['ltm'] };

export const ltmDescription: INodeProperties[] = [
  // ─── Operation selector ────────────────────────────────────────────────────
  {
    displayName: 'Operation',
    name: 'operation',
    type: 'options',
    noDataExpression: true,
    displayOptions: { show: showForLtm },
    options: [
      {
        name: 'Create Pool',
        value: 'createPool',
        action: 'Create a new LTM pool',
        description: 'Create a new load-balancing pool',
        routing: {
          request: {
            method: 'POST',
            url: '/mgmt/tm/ltm/pool',
          },
        },
      },
      {
        name: 'Discover Resources',
        value: 'discoverResources',
        action: 'Discover all LTM resources',
        description: 'Retrieve all available LTM resource links on the BIG-IP',
        routing: {
          request: {
            method: 'GET',
            url: '/mgmt/tm/ltm',
          },
        },
      },
      {
        name: 'Get All Pools',
        value: 'getAllPools',
        action: 'Get all LTM pools',
        description: 'Retrieve a list of all configured LTM pools',
        routing: {
          request: {
            method: 'GET',
            url: '/mgmt/tm/ltm/pool',
          },
        },
      },
      {
        name: 'Get Pool Stats',
        value: 'getPoolStats',
        action: 'Get pool statistics',
        description: 'Retrieve real-time statistics for a specific LTM pool',
        routing: {
          request: {
            method: 'GET',
            url: '=/mgmt/tm/ltm/pool/{{$parameter["poolName"]}}/stats',
          },
        },
      },
      {
        name: 'Reset Virtual Server Stats',
        value: 'resetVirtualStats',
        action: 'Reset virtual server statistics',
        description: 'Reset the performance statistics for a virtual server',
        routing: {
          request: {
            method: 'POST',
            url: '/mgmt/tm/ltm/virtual',
            body: {
              command: 'reset-stats',
            },
          },
        },
      },
      {
        name: 'Update Pool',
        value: 'updatePool',
        action: 'Update an LTM pool',
        description: 'Update an existing LTM pool (members, monitor, load-balancing mode)',
        routing: {
          request: {
            method: 'PATCH',
            url: '=/mgmt/tm/ltm/pool/{{$parameter["poolName"]}}',
          },
        },
      },
    ],
    default: 'getAllPools',
  },

  // ─── Pool Name (shared by getPoolStats, updatePool, resetVirtualStats) ─────
  {
    displayName: 'Pool Name',
    name: 'poolName',
    type: 'string',
    default: '',
    required: true,
    placeholder: '~Common~my_pool',
    description:
      'Full pool name including partition, e.g. ~Common~my_pool. Use tilde (~) as path separator.',
    displayOptions: {
      show: {
        resource: ['ltm'],
        operation: ['getPoolStats', 'updatePool'],
      },
    },
  },

  // ─── Virtual Server Name (resetVirtualStats) ──────────────────────────────
  {
    displayName: 'Virtual Server Name',
    name: 'virtualServerName',
    type: 'string',
    default: '',
    required: true,
    placeholder: 'http_vs1',
    description: 'Name of the virtual server whose statistics will be reset',
    displayOptions: {
      show: {
        resource: ['ltm'],
        operation: ['resetVirtualStats'],
      },
    },
    routing: {
      send: {
        type: 'body',
        property: 'name',
      },
    },
  },

  // ─── Create Pool fields ────────────────────────────────────────────────────
  {
    displayName: 'Pool Name',
    name: 'createPoolName',
    type: 'string',
    default: '',
    required: true,
    placeholder: 'my_web_pool',
    description: 'Name for the new pool. Partition prefix is optional, e.g. ~Common~my_web_pool.',
    displayOptions: {
      show: {
        resource: ['ltm'],
        operation: ['createPool'],
      },
    },
    routing: {
      send: {
        type: 'body',
        property: 'name',
      },
    },
  },
  {
    displayName: 'Load Balancing Mode',
    name: 'loadBalancingMode',
    type: 'options',
    default: 'round-robin',
    description: 'Algorithm used to distribute connections across pool members',
    displayOptions: {
      show: {
        resource: ['ltm'],
        operation: ['createPool'],
      },
    },
    options: [
      { name: 'Fastest (Application)', value: 'fastest-app-response' },
      { name: 'Fastest (Node)', value: 'fastest-node' },
      { name: 'Least Connections (Member)', value: 'least-connections-member' },
      { name: 'Least Connections (Node)', value: 'least-connections-node' },
      { name: 'Observed (Member)', value: 'observed-member' },
      { name: 'Observed (Node)', value: 'observed-node' },
      { name: 'Predictive (Member)', value: 'predictive-member' },
      { name: 'Predictive (Node)', value: 'predictive-node' },
      { name: 'Ratio (Member)', value: 'ratio-member' },
      { name: 'Ratio (Node)', value: 'ratio-node' },
      { name: 'Round Robin', value: 'round-robin' },
      { name: 'Weighted Least Connections (Member)', value: 'weighted-least-connections-member' },
      { name: 'Weighted Least Connections (Node)', value: 'weighted-least-connections-node' },
    ],
    routing: {
      send: {
        type: 'body',
        property: 'loadBalancingMode',
      },
    },
  },
  {
    displayName: 'Monitor',
    name: 'monitor',
    type: 'string',
    default: '/Common/http',
    description: 'Health monitor path to assign to the pool, e.g. /Common/http',
    displayOptions: {
      show: {
        resource: ['ltm'],
        operation: ['createPool'],
      },
    },
    routing: {
      send: {
        type: 'body',
        property: 'monitor',
      },
    },
  },
  {
    displayName: 'Description',
    name: 'createPoolDescription',
    type: 'string',
    default: '',
    description: 'Optional description for the new pool',
    displayOptions: {
      show: {
        resource: ['ltm'],
        operation: ['createPool'],
      },
    },
    routing: {
      send: {
        type: 'body',
        property: 'description',
      },
    },
  },
  {
    displayName: 'Pool Members',
    name: 'members',
    type: 'fixedCollection',
    typeOptions: {
      multipleValues: true,
      multipleValueButtonText: 'Add Member',
    },
    default: {},
    description: 'List of pool members (nodes) to add on creation',
    displayOptions: {
      show: {
        resource: ['ltm'],
        operation: ['createPool'],
      },
    },
    options: [
      {
        displayName: 'Member',
        name: 'member',
        values: [
          {
            displayName: 'Name',
            name: 'name',
            type: 'string',
            default: '',
            placeholder: '192.168.1.10:80',
            description: 'Member address and port in format address:port, e.g. 192.168.1.10:80',
          },
          {
            displayName: 'Description',
            name: 'description',
            type: 'string',
            default: '',
            description: 'Optional description for this member',
          },
        ],
      },
    ],
    routing: {
      send: {
        type: 'body',
        property: 'members',
        value: '={{$value.member}}',
      },
    },
  },

  // ─── Update Pool fields ────────────────────────────────────────────────────
  {
    displayName: 'Update Fields',
    name: 'updateFields',
    type: 'collection',
    placeholder: 'Add Field',
    default: {},
    description: 'Fields to update on the pool',
    displayOptions: {
      show: {
        resource: ['ltm'],
        operation: ['updatePool'],
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
        displayName: 'Load Balancing Mode',
        name: 'loadBalancingMode',
        type: 'options',
        default: 'round-robin',
        options: [
          { name: 'Fastest (Application)', value: 'fastest-app-response' },
          { name: 'Fastest (Node)', value: 'fastest-node' },
          { name: 'Least Connections (Member)', value: 'least-connections-member' },
          { name: 'Least Connections (Node)', value: 'least-connections-node' },
          { name: 'Observed (Member)', value: 'observed-member' },
          { name: 'Observed (Node)', value: 'observed-node' },
          { name: 'Predictive (Member)', value: 'predictive-member' },
          { name: 'Predictive (Node)', value: 'predictive-node' },
          { name: 'Ratio (Member)', value: 'ratio-member' },
          { name: 'Ratio (Node)', value: 'ratio-node' },
          { name: 'Round Robin', value: 'round-robin' },
          { name: 'Weighted Least Connections (Member)', value: 'weighted-least-connections-member' },
          { name: 'Weighted Least Connections (Node)', value: 'weighted-least-connections-node' },
        ],
        routing: {
          send: {
            type: 'body',
            property: 'loadBalancingMode',
          },
        },
      },
      {
        displayName: 'Monitor',
        name: 'monitor',
        type: 'string',
        default: '',
        placeholder: '/Common/http',
        routing: {
          send: {
            type: 'body',
            property: 'monitor',
          },
        },
      },
    ],
  },
  {
    displayName: 'Pool Members',
    name: 'updateMembers',
    type: 'fixedCollection',
    typeOptions: {
      multipleValues: true,
      multipleValueButtonText: 'Add Member',
    },
    default: {},
    description:
      'Replaces the current member list on the pool. Leave empty to keep existing members.',
    displayOptions: {
      show: {
        resource: ['ltm'],
        operation: ['updatePool'],
      },
    },
    options: [
      {
        displayName: 'Member',
        name: 'member',
        values: [
          {
            displayName: 'Name',
            name: 'name',
            type: 'string',
            default: '',
            placeholder: '192.168.1.10:80',
            description: 'Member address and port in format address:port',
          },
          {
            displayName: 'Description',
            name: 'description',
            type: 'string',
            default: '',
          },
        ],
      },
    ],
    routing: {
      send: {
        type: 'body',
        property: 'members',
        value: '={{$value.member && $value.member.length ? $value.member : undefined}}',
      },
    },
  },
];
