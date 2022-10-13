import { DeploymentsResponse } from './service-deployments.types';

export const mockResponse: DeploymentsResponse = {
  payload: {
    service: 'api',
    deployments: [
      {
        type: 'app',
        commit: 'fd5288702fb5abc602bcbb68be8bf18263afd3fb',
        status: 'SUCCEEDED',
        triggeredBy: 'Akhilesh-Sirohi',
        startTime: 1665482511239,
        endTime: 1665482511240
      }
    ]
  },
  success: true,
  errors: null
};
