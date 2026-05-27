import type { INodeProperties } from 'n8n-workflow';

const showForAsm = { resource: ['asm'] };

export const asmDescription: INodeProperties[] = [
  // ─── Operation selector ────────────────────────────────────────────────────
  {
    displayName: 'Operation',
    name: 'operation',
    type: 'options',
    noDataExpression: true,
    displayOptions: { show: showForAsm },
    options: [
      {
        name: 'Apply Policy',
        value: 'applyPolicy',
        action: 'Apply a WAF policy',
        description: 'Apply (enforce) a WAF policy on the BIG-IP',
        routing: {
          request: {
            method: 'POST',
            url: '/mgmt/tm/asm/tasks/apply-policy',
          },
        },
      },
      {
        name: 'Check Task Status',
        value: 'checkTaskStatus',
        action: 'Check ASM task status',
        description: 'Poll the status of a previously started ASM background task',
        routing: {
          request: {
            method: 'GET',
            url: '=/mgmt/tm/asm/tasks/{{$parameter["taskType"]}}/{{$parameter["taskId"]}}',
          },
        },
      },
      {
        name: 'Diff Policies',
        value: 'diffPolicies',
        action: 'Diff two WAF policies',
        description: 'Find the differences between two WAF policies',
        routing: {
          request: {
            method: 'POST',
            url: '/mgmt/tm/asm/tasks/policy-diff',
          },
        },
      },
      {
        name: 'Export Policy',
        value: 'exportPolicy',
        action: 'Export a WAF policy',
        description: 'Export a WAF policy to a declarative JSON file on the BIG-IP',
        routing: {
          request: {
            method: 'POST',
            url: '/mgmt/tm/asm/tasks/export-policy',
          },
        },
      },
      {
        name: 'Export Signatures',
        value: 'exportSignatures',
        action: 'Export attack signatures',
        description: 'Export the current attack signature set to a file',
        routing: {
          request: {
            method: 'POST',
            url: '/mgmt/tm/asm/tasks/export-signatures',
          },
        },
      },
      {
        name: 'Import Policy',
        value: 'importPolicy',
        action: 'Import / restore a WAF policy',
        description: 'Restore or import a WAF policy from a history reference',
        routing: {
          request: {
            method: 'POST',
            url: '/mgmt/tm/asm/tasks/import-policy',
          },
        },
      },
      {
        name: 'Import Vulnerabilities',
        value: 'importVulnerabilities',
        action: 'Import vulnerability scan results',
        description: 'Import vulnerability data from a scanner into an ASM policy',
        routing: {
          request: {
            method: 'POST',
            url: '/mgmt/tm/asm/tasks/import-vulnerabilities',
          },
        },
      },
      {
        name: 'Initiate Vulnerability Assessment',
        value: 'initiateVulnerabilityAssessment',
        action: 'Start a vulnerability assessment scan',
        description: 'Trigger a new vulnerability assessment scan against a policy',
        routing: {
          request: {
            method: 'POST',
            url: '/mgmt/tm/asm/tasks/initiate-vulnerability-assessment',
          },
        },
      },
      {
        name: 'Merge Policies',
        value: 'mergePolicies',
        action: 'Merge two WAF policies',
        description: 'Merge differences from a policy diff task into target policies',
        routing: {
          request: {
            method: 'POST',
            url: '/mgmt/tm/asm/tasks/policy-merge',
          },
        },
      },
      {
        name: 'Publish Policy',
        value: 'publishPolicy',
        action: 'Publish WAF policy changes',
        description: 'Publish pending changes to a WAF policy (make them active)',
        routing: {
          request: {
            method: 'POST',
            url: '/mgmt/tm/asm/policy',
            body: {
              command: 'publish',
            },
          },
        },
      },
      {
        name: 'Terminate Vulnerability Assessment',
        value: 'terminateVulnerabilityAssessment',
        action: 'Stop a running vulnerability assessment',
        description: 'Terminate an in-progress vulnerability assessment scan',
        routing: {
          request: {
            method: 'POST',
            url: '/mgmt/tm/asm/tasks/terminate-vulnerability-assessment',
          },
        },
      },
      {
        name: 'Update Signatures',
        value: 'updateSignatures',
        action: 'Update attack signatures',
        description: 'Update the BIG-IP attack signature database from a file or live feed',
        routing: {
          request: {
            method: 'POST',
            url: '/mgmt/tm/asm/tasks/update-signatures',
          },
        },
      },
    ],
    default: 'applyPolicy',
  },

  // ─── Apply Policy ──────────────────────────────────────────────────────────
  {
    displayName: 'Policy Reference Link',
    name: 'applyPolicyLink',
    type: 'string',
    default: '',
    required: true,
    placeholder: 'https://localhost/mgmt/tm/asm/policies/vagoQLF6uOoBKvS8h3C19w',
    description: 'The self-link of the ASM policy to apply',
    displayOptions: {
      show: {
        resource: ['asm'],
        operation: ['applyPolicy'],
      },
    },
    routing: {
      send: {
        type: 'body',
        property: 'policyReference',
        value: '={{ {"link": $value} }}',
      },
    },
  },

  // ─── Check Task Status ─────────────────────────────────────────────────────
  {
    displayName: 'Task Type',
    name: 'taskType',
    type: 'options',
    required: true,
    default: 'import-policy',
    description: 'The type of ASM background task to check',
    displayOptions: {
      show: {
        resource: ['asm'],
        operation: ['checkTaskStatus'],
      },
    },
    options: [
      { name: 'Export Policy', value: 'export-policy' },
      { name: 'Export Signatures', value: 'export-signatures' },
      { name: 'Import Policy', value: 'import-policy' },
      { name: 'Import Vulnerabilities', value: 'import-vulnerabilities' },
      {
        name: 'Initiate Vulnerability Assessment',
        value: 'initiate-vulnerability-assessment',
      },
      {
        name: 'Resolve Vulnerabilities',
        value: 'resolve-vulnerabilities',
      },
      {
        name: 'Terminate Vulnerability Assessment',
        value: 'terminate-vulnerability-assessment',
      },
      { name: 'Update Signatures', value: 'update-signatures' },
    ],
  },
  {
    displayName: 'Task ID',
    name: 'taskId',
    type: 'string',
    default: '',
    required: true,
    description: 'Unique ID of the background task returned when the task was created',
    displayOptions: {
      show: {
        resource: ['asm'],
        operation: ['checkTaskStatus'],
      },
    },
  },

  // ─── Diff Policies ─────────────────────────────────────────────────────────
  {
    displayName: 'First Policy Link',
    name: 'firstPolicyLink',
    type: 'string',
    default: '',
    required: true,
    placeholder: 'https://localhost/mgmt/tm/asm/policies/example_1',
    description: 'Self-link of the first ASM policy to compare',
    displayOptions: {
      show: {
        resource: ['asm'],
        operation: ['diffPolicies'],
      },
    },
    routing: {
      send: {
        type: 'body',
        property: 'firstPolicyReference',
        value: '={{ {"link": $value} }}',
      },
    },
  },
  {
    displayName: 'Second Policy Link',
    name: 'secondPolicyLink',
    type: 'string',
    default: '',
    required: true,
    placeholder: 'https://localhost/mgmt/tm/asm/policies/example_2',
    description: 'Self-link of the second ASM policy to compare',
    displayOptions: {
      show: {
        resource: ['asm'],
        operation: ['diffPolicies'],
      },
    },
    routing: {
      send: {
        type: 'body',
        property: 'secondPolicyReference',
        value: '={{ {"link": $value} }}',
      },
    },
  },

  // ─── Export Policy ─────────────────────────────────────────────────────────
  {
    displayName: 'Policy Reference Link',
    name: 'exportPolicyLink',
    type: 'string',
    default: '',
    required: true,
    placeholder: 'https://localhost/mgmt/tm/asm/policies/vagoQLF6uOoBKvS8h3C19w',
    description: 'Self-link of the ASM policy to export',
    displayOptions: {
      show: {
        resource: ['asm'],
        operation: ['exportPolicy'],
      },
    },
    routing: {
      send: {
        type: 'body',
        property: 'policyReference',
        value: '={{ {"link": $value} }}',
      },
    },
  },
  {
    displayName: 'Export Options',
    name: 'exportOptions',
    type: 'collection',
    placeholder: 'Add Option',
    default: {},
    displayOptions: {
      show: {
        resource: ['asm'],
        operation: ['exportPolicy'],
      },
    },
    options: [
      {
        displayName: 'Filename',
        name: 'filename',
        type: 'string',
        default: '',
        placeholder: 'my_policy_export.json',
        description: 'Filename to save the exported policy on the BIG-IP filesystem',
        routing: {
          send: {
            type: 'body',
            property: 'filename',
          },
        },
      },
      {
        displayName: 'Format',
        name: 'format',
        type: 'options',
        default: 'json',
        options: [
          { name: 'JSON', value: 'json' },
          { name: 'XML', value: 'xml' },
        ],
        routing: {
          send: {
            type: 'body',
            property: 'format',
          },
        },
      },
      {
        displayName: 'Include Suggestions',
        name: 'exportSuggestions',
        type: 'boolean',
        default: false,
        description: 'Whether to include Policy Builder suggestions in the export',
        routing: {
          send: {
            type: 'body',
            property: 'exportSuggestions',
          },
        },
      },
      {
        displayName: 'Minimal Export',
        name: 'minimal',
        type: 'boolean',
        default: false,
        description: 'Whether to export only non-default settings (smaller file)',
        routing: {
          send: {
            type: 'body',
            property: 'minimal',
          },
        },
      },
    ],
  },

  // ─── Export Signatures ─────────────────────────────────────────────────────
  {
    displayName: 'Export Filename',
    name: 'signaturesFilename',
    type: 'string',
    default: '',
    required: true,
    placeholder: 'signatures_export.xml',
    description: 'Filename on the BIG-IP filesystem to write the exported signatures',
    displayOptions: {
      show: {
        resource: ['asm'],
        operation: ['exportSignatures'],
      },
    },
    routing: {
      send: {
        type: 'body',
        property: 'filename',
      },
    },
  },

  // ─── Import Policy ─────────────────────────────────────────────────────────
  {
    displayName: 'Policy Reference Link',
    name: 'importPolicyLink',
    type: 'string',
    default: '',
    placeholder: 'https://localhost/mgmt/tm/asm/policies/vagoQLF6uOoBKvS8h3C19w',
    description:
      'Self-link of the target ASM policy to import into. Leave empty to create a new policy.',
    displayOptions: {
      show: {
        resource: ['asm'],
        operation: ['importPolicy'],
      },
    },
    routing: {
      send: {
        type: 'body',
        property: 'policyReference',
        value: '={{ $value ? {"link": $value} : undefined }}',
      },
    },
  },
  {
    displayName: 'Policy History Reference Link',
    name: 'policyHistoryLink',
    type: 'string',
    default: '',
    placeholder: 'https://localhost/mgmt/tm/asm/policy-revisions/example',
    description: 'Self-link of the policy revision (history entry) to restore',
    displayOptions: {
      show: {
        resource: ['asm'],
        operation: ['importPolicy'],
      },
    },
    routing: {
      send: {
        type: 'body',
        property: 'policyHistoryReference',
        value: '={{ $value ? {"link": $value} : undefined }}',
      },
    },
  },

  // ─── Import Vulnerabilities ────────────────────────────────────────────────
  {
    displayName: 'Policy Reference Link',
    name: 'importVulnPolicyLink',
    type: 'string',
    default: '',
    required: true,
    placeholder: 'https://localhost/mgmt/tm/asm/policies/vagoQLF6uOoBKvS8h3C19w',
    description: 'Self-link of the ASM policy to receive the vulnerability data',
    displayOptions: {
      show: {
        resource: ['asm'],
        operation: ['importVulnerabilities'],
      },
    },
    routing: {
      send: {
        type: 'body',
        property: 'policyReference',
        value: '={{ {"link": $value} }}',
      },
    },
  },
  {
    displayName: 'Import Vulnerabilities Options',
    name: 'importVulnOptions',
    type: 'collection',
    placeholder: 'Add Option',
    default: {},
    displayOptions: {
      show: {
        resource: ['asm'],
        operation: ['importVulnerabilities'],
      },
    },
    options: [
      {
        displayName: 'Scan ID',
        name: 'scanId',
        type: 'string',
        default: '',
        description: 'Scanner-assigned ID for the vulnerability scan',
        routing: {
          send: {
            type: 'body',
            property: 'scanId',
          },
        },
      },
      {
        displayName: 'Subscription ID',
        name: 'subscriptionId',
        type: 'string',
        default: '',
        description: 'Subscription ID from the vulnerability assessment service',
        routing: {
          send: {
            type: 'body',
            property: 'subscriptionId',
          },
        },
      },
      {
        displayName: 'Import All Domain Names',
        name: 'importAllDomainNames',
        type: 'boolean',
        default: false,
        routing: {
          send: {
            type: 'body',
            property: 'importAllDomainNames',
          },
        },
      },
    ],
  },

  // ─── Initiate / Terminate Vulnerability Assessment ─────────────────────────
  {
    displayName: 'Policy Reference Link',
    name: 'vaPolicyLink',
    type: 'string',
    default: '',
    required: true,
    placeholder: 'https://localhost/mgmt/tm/asm/policies/vagoQLF6uOoBKvS8h3C19w',
    description: 'Self-link of the ASM policy to scan',
    displayOptions: {
      show: {
        resource: ['asm'],
        operation: ['initiateVulnerabilityAssessment', 'terminateVulnerabilityAssessment'],
      },
    },
    routing: {
      send: {
        type: 'body',
        property: 'policyReference',
        value: '={{ {"link": $value} }}',
      },
    },
  },
  {
    displayName: 'Subscription ID',
    name: 'vaSubscriptionId',
    type: 'string',
    default: '',
    description: 'Subscription ID for the vulnerability assessment service',
    displayOptions: {
      show: {
        resource: ['asm'],
        operation: ['initiateVulnerabilityAssessment'],
      },
    },
    routing: {
      send: {
        type: 'body',
        property: 'subscriptionId',
      },
    },
  },

  // ─── Merge Policies ────────────────────────────────────────────────────────
  {
    displayName: 'Policy Diff Reference Link',
    name: 'policyDiffLink',
    type: 'string',
    default: '',
    required: true,
    placeholder: '/mgmt/tm/asm/policy-diffs/example',
    description: 'Self-link of a policy-diff task result to merge from',
    displayOptions: {
      show: {
        resource: ['asm'],
        operation: ['mergePolicies'],
      },
    },
    routing: {
      send: {
        type: 'body',
        property: 'policyDiffReference',
        value: '={{ {"link": $value} }}',
      },
    },
  },
  {
    displayName: 'Merge Options',
    name: 'mergeOptions',
    type: 'collection',
    placeholder: 'Add Option',
    default: {},
    displayOptions: {
      show: {
        resource: ['asm'],
        operation: ['mergePolicies'],
      },
    },
    options: [
      {
        displayName: 'Add Missing Entities To First Policy',
        name: 'addMissingEntitiesToFirst',
        type: 'boolean',
        default: true,
        routing: {
          send: {
            type: 'body',
            property: 'addMissingEntitiesToFirst',
          },
        },
      },
      {
        displayName: 'Add Missing Entities To Second Policy',
        name: 'addMissingEntitiesToSecond',
        type: 'boolean',
        default: true,
        routing: {
          send: {
            type: 'body',
            property: 'addMissingEntitiesToSecond',
          },
        },
      },
      {
        displayName: 'Handle Common Entities',
        name: 'handleCommonEntities',
        type: 'options',
        default: 'ignore',
        options: [
          { name: 'Ignore', value: 'ignore' },
          { name: 'Merge', value: 'merge' },
          { name: 'Override', value: 'override' },
        ],
        routing: {
          send: {
            type: 'body',
            property: 'handleCommonEntities',
          },
        },
      },
    ],
  },

  // ─── Publish Policy ────────────────────────────────────────────────────────
  {
    displayName: 'Policy Name',
    name: 'publishPolicyName',
    type: 'string',
    default: '',
    required: true,
    placeholder: 'testpolicy',
    description: 'Name of the ASM policy to publish',
    displayOptions: {
      show: {
        resource: ['asm'],
        operation: ['publishPolicy'],
      },
    },
    routing: {
      send: {
        type: 'body',
        property: 'name',
      },
    },
  },

  // ─── Update Signatures ─────────────────────────────────────────────────────
  {
    displayName: 'Update Fields',
    name: 'updateSigOptions',
    type: 'collection',
    placeholder: 'Add Option',
    default: {},
    displayOptions: {
      show: {
        resource: ['asm'],
        operation: ['updateSignatures'],
      },
    },
    options: [
      {
        displayName: 'Filename',
        name: 'filename',
        type: 'string',
        default: '',
        description:
          'Path to an already-uploaded signature file on the BIG-IP. Leave empty to use live update.',
        routing: {
          send: {
            type: 'body',
            property: 'filename',
          },
        },
      },
      {
        displayName: 'Is User Defined',
        name: 'isUserDefined',
        type: 'boolean',
        default: false,
        description: 'Whether the signatures file contains user-defined signatures',
        routing: {
          send: {
            type: 'body',
            property: 'isUserDefined',
          },
        },
      },
    ],
  },
];
