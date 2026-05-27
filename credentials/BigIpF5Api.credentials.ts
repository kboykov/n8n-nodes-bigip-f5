import type {
  IAuthenticateGeneric,
  Icon,
  ICredentialTestRequest,
  ICredentialType,
  INodeProperties,
} from 'n8n-workflow';

export class BigIpF5Api implements ICredentialType {
  name = 'bigIpF5Api';

  displayName = 'BIG-IP F5 API';

  icon: Icon = {
    light: 'file:../nodes/BigIpF5/bigip-f5.svg',
    dark: 'file:../nodes/BigIpF5/bigip-f5.dark.svg',
  };

  documentationUrl = 'https://clouddocs.f5.com/api/icontrol-rest/';

  properties: INodeProperties[] = [
    {
      displayName: 'Host',
      name: 'host',
      type: 'string',
      default: '',
      placeholder: 'https://192.168.1.1',
      description: 'Base URL of the BIG-IP device including protocol, e.g. https://bigip.example.com',
    },
    {
      displayName: 'Username',
      name: 'username',
      type: 'string',
      default: '',
      description: 'BIG-IP admin username',
    },
    {
      displayName: 'Password',
      name: 'password',
      type: 'string',
      typeOptions: {
        password: true,
      },
      default: '',
      description: 'BIG-IP admin password',
    },
    {
      displayName: 'Ignore SSL Certificate Errors',
      name: 'ssl',
      type: 'boolean',
      default: true,
      description:
        'Whether to ignore SSL certificate validation errors (useful for self-signed certs on BIG-IP appliances)',
    },
  ];

  authenticate: IAuthenticateGeneric = {
    type: 'generic',
    properties: {
      auth: {
        username: '={{$credentials.username}}',
        password: '={{$credentials.password}}',
      },
    },
  };

  test: ICredentialTestRequest = {
    request: {
      baseURL: '={{$credentials.host}}',
      url: '/mgmt/shared/settings/api-status/availability',
      method: 'GET',
      skipSslCertificateValidation: '={{$credentials.ssl}}',
    },
  };
}
