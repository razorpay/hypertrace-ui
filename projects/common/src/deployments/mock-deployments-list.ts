import { DeploymentsResponse } from './deployment.types';

export const mockResponse: DeploymentsResponse = {
  payload: {
    service: 'api',
    deployments: [
      {
        type: 'app',
        commit: 'd8aa673df18703df75bd5cd399041db0af059aa7',
        status: 'TERMINAL',
        triggeredBy: 'c6f7a768-ca90-40da-ad0f-fda5bde0c6bb@managed-service-account',
        startTime: 1665993952000,
        endTime: 1665994072000
      },
      {
        type: 'app',
        commit: 'd8aa673df18703df75bd5cd399041db0af059aa7',
        status: 'SUCCEEDED',
        triggeredBy: 'c6f7a768-ca90-40da-ad0f-fda5bde0c6bb@managed-service-account',
        startTime: 1665993652000,
        endTime: 1665993772000
      },
      {
        type: 'app',
        commit: '7cf8e7026a767b9ef51c2e86cadb3d4eb0cb05b3',
        status: 'TERMINAL',
        triggeredBy: 'prabhathmurthy',
        startTime: 1665993352000,
        endTime: 1665993532000
      },
      {
        type: 'app',
        commit: 'c26c9dded394334f679bb10e99b2954374643652',
        status: 'RUNNING',
        triggeredBy: 'c6f7a768-ca90-40da-ad0f-fda5bde0c6bb@managed-service-account',
        startTime: 1665992512000,
        endTime: 0
      },
      {
        type: 'app',
        commit: '7cf8e7026a767b9ef51c2e86cadb3d4eb0cb05b3',
        status: 'TERMINAL',
        triggeredBy: 'kowshikr',
        startTime: 1665992932000,
        endTime: 1665993112000
      }
    ]
  },
  success: true,
  errors: null
};
