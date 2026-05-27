import { NodeConnectionTypes, type INodeType, type INodeTypeDescription } from 'n8n-workflow';

import { apmDescription } from './resources/apm';
import { asmDescription } from './resources/asm';
import { authDescription } from './resources/auth';
import { ltmDescription } from './resources/ltm';
import { systemDescription } from './resources/system';

export class BigIpF5 implements INodeType {
  description: INodeTypeDescription = {
    displayName: 'BIG-IP F5',
    name: 'bigIpF5',
    icon: 'file:bigip-f5.svg',
    group: ['input'],
    version: 1,
    subtitle: '={{$parameter["operation"] + ": " + $parameter["resource"]}}',
    description: 'Interact with F5 BIG-IP via the iControl REST API',
    defaults: {
      name: 'BIG-IP F5',
    },
    usableAsTool: true,
    inputs: [NodeConnectionTypes.Main],
    outputs: [NodeConnectionTypes.Main],
    credentials: [
      {
        name: 'bigIpF5Api',
        required: true,
      },
    ],
    requestDefaults: {
      baseURL: '={{$credentials.host}}',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      skipSslCertificateValidation: '={{$credentials.ssl}}',
    },
    properties: [
      // ─── Resource selector ───────────────────────────────────────────────
      {
        displayName: 'Resource',
        name: 'resource',
        type: 'options',
        noDataExpression: true,
        options: [
          {
            name: 'APM',
            value: 'apm',
            description: 'Access Policy Manager — sessions, policies, OAuth',
          },
          {
            name: 'ASM',
            value: 'asm',
            description:
              'Application Security Manager — WAF policies, signatures, vulnerabilities',
          },
          {
            name: 'Authentication',
            value: 'auth',
            description: 'IControl REST token management and module discovery',
          },
          {
            name: 'LTM',
            value: 'ltm',
            description: 'Local Traffic Manager — pools and virtual server management',
          },
          {
            name: 'System',
            value: 'system',
            description: 'System operations — config, services, software, backups, ping',
          },
        ],
        default: 'ltm',
      },

      // ─── Resource descriptions (operations + parameters) ─────────────────
      ...ltmDescription,
      ...asmDescription,
      ...apmDescription,
      ...systemDescription,
      ...authDescription,
    ],
  };
}
