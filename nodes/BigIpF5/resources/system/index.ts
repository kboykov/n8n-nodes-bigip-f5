import type { INodeProperties } from 'n8n-workflow';

const showForSystem = { resource: ['system'] };

export const systemDescription: INodeProperties[] = [
  // ─── Operation selector ────────────────────────────────────────────────────
  {
    displayName: 'Operation',
    name: 'operation',
    type: 'options',
    noDataExpression: true,
    displayOptions: { show: showForSystem },
    options: [
      {
        name: 'Create UCS Task',
        value: 'createUcsTask',
        action: 'Create a UCS backup task',
        description: 'Initiate a UCS (User Configuration Set) backup or restore task',
        routing: {
          request: {
            method: 'POST',
            url: '/task/sys/ucs',
          },
        },
      },
      {
        name: 'Download UCS File',
        value: 'downloadUcsFile',
        action: 'Download a UCS backup file',
        description: 'Download an existing UCS backup file from the BIG-IP',
        routing: {
          request: {
            method: 'GET',
            url: '=/mgmt/shared/file-transfer/ucs-downloads/{{$parameter["ucsFilename"]}}',
          },
        },
      },
      {
        name: 'Execute CLI Command',
        value: 'executeCliCommand',
        action: 'Execute a TMSH CLI command',
        description: 'Run a TMSH or shell command on the BIG-IP via the REST API',
        routing: {
          request: {
            method: 'POST',
            url: '=/mgmt/tm/cli_cmd/{{$parameter["cliCmdId"]}}',
          },
        },
      },
      {
        name: 'Get Software Images',
        value: 'getSoftwareImages',
        action: 'Get all software images',
        description: 'List all software installation images available on the BIG-IP',
        routing: {
          request: {
            method: 'GET',
            url: '/mgmt/tm/sys/software/image',
          },
        },
      },
      {
        name: 'Get Software Volumes',
        value: 'getSoftwareVolumes',
        action: 'Get all software volumes',
        description: 'List all disk volumes used by software installations',
        routing: {
          request: {
            method: 'GET',
            url: '/mgmt/tm/sys/software/volume',
          },
        },
      },
      {
        name: 'Ping',
        value: 'ping',
        action: 'Run a ping command',
        description: 'Execute a ping from the BIG-IP management plane to test connectivity',
        routing: {
          request: {
            method: 'POST',
            url: '/mgmt/tm/util/ping',
            body: {
              command: 'run',
            },
          },
        },
      },
      {
        name: 'Reboot',
        value: 'reboot',
        action: 'Reboot the BIG-IP',
        description: 'Issue a reboot command to the BIG-IP device',
        routing: {
          request: {
            method: 'POST',
            url: '/mgmt/tm/sys',
            body: {
              command: 'reboot',
            },
          },
        },
      },
      {
        name: 'Restart Service',
        value: 'restartService',
        action: 'Restart a system service',
        description: 'Restart a named BIG-IP system service (e.g. icrd, mcpd)',
        routing: {
          request: {
            method: 'POST',
            url: '/mgmt/tm/sys/service',
            body: {
              command: 'restart',
            },
          },
        },
      },
      {
        name: 'Save Configuration',
        value: 'saveConfig',
        action: 'Save the running configuration',
        description: 'Write the current running configuration to disk (save sys config)',
        routing: {
          request: {
            method: 'POST',
            url: '/mgmt/tm/sys/config',
            body: {
              command: 'save',
            },
          },
        },
      },
    ],
    default: 'saveConfig',
  },

  // ─── Ping ──────────────────────────────────────────────────────────────────
  {
    displayName: 'Target Host',
    name: 'pingTarget',
    type: 'string',
    default: '',
    required: true,
    placeholder: '1.1.1.1',
    description: 'IP address or hostname to ping from the BIG-IP',
    displayOptions: {
      show: {
        resource: ['system'],
        operation: ['ping'],
      },
    },
    routing: {
      send: {
        type: 'body',
        property: 'utilCmdArgs',
        value: '={{$value + " -c 3"}}',
      },
    },
  },

  // ─── Restart Service ───────────────────────────────────────────────────────
  {
    displayName: 'Service Name',
    name: 'serviceName',
    type: 'string',
    default: '',
    required: true,
    placeholder: 'icrd',
    description:
      'Name of the BIG-IP service to restart, e.g. icrd, mcpd, tomcat, tmm',
    displayOptions: {
      show: {
        resource: ['system'],
        operation: ['restartService'],
      },
    },
    routing: {
      send: {
        type: 'body',
        property: 'name',
      },
    },
  },

  // ─── Download UCS ──────────────────────────────────────────────────────────
  {
    displayName: 'UCS Filename',
    name: 'ucsFilename',
    type: 'string',
    default: '',
    required: true,
    placeholder: 'bigip_backup.ucs',
    description: 'Name of the UCS file to download from the BIG-IP',
    displayOptions: {
      show: {
        resource: ['system'],
        operation: ['downloadUcsFile'],
      },
    },
  },

  // ─── Create UCS Task ───────────────────────────────────────────────────────
  {
    displayName: 'UCS Command',
    name: 'ucsCommand',
    type: 'options',
    required: true,
    default: 'save',
    displayOptions: {
      show: {
        resource: ['system'],
        operation: ['createUcsTask'],
      },
    },
    options: [
      { name: 'Save (Create Backup)', value: 'save' },
      { name: 'Load (Restore Backup)', value: 'load' },
    ],
    routing: {
      send: {
        type: 'body',
        property: 'command',
      },
    },
  },
  {
    displayName: 'UCS Name',
    name: 'ucsName',
    type: 'string',
    default: '',
    required: true,
    placeholder: 'bigip_backup',
    description: 'Name for the UCS archive (without .ucs extension)',
    displayOptions: {
      show: {
        resource: ['system'],
        operation: ['createUcsTask'],
      },
    },
    routing: {
      send: {
        type: 'body',
        property: 'name',
      },
    },
  },

  // ─── Execute CLI Command ───────────────────────────────────────────────────
  {
    displayName: 'Command ID',
    name: 'cliCmdId',
    type: 'string',
    default: 'run',
    required: true,
    description: 'The CLI command endpoint ID. Use "run" for general commands.',
    displayOptions: {
      show: {
        resource: ['system'],
        operation: ['executeCliCommand'],
      },
    },
  },
  {
    displayName: 'Command',
    name: 'cliCommand',
    type: 'string',
    typeOptions: {
      rows: 3,
    },
    default: '',
    required: true,
    placeholder: 'show sys version',
    description: 'TMSH command string to execute on the BIG-IP',
    displayOptions: {
      show: {
        resource: ['system'],
        operation: ['executeCliCommand'],
      },
    },
    routing: {
      send: {
        type: 'body',
        property: 'command',
      },
    },
  },
];
