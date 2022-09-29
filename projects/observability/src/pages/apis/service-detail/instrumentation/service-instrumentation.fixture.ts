import { OrgScoreResponse, ServiceScoreResponse } from './service-instrumentation.types';

export const serviceScoreResponse: ServiceScoreResponse = {
  serviceName: 'metro',
  bu: 'Platform',
  heuristicClassScoreInfo: [
    {
      name: 'Quality',
      score: 52.5,
      description: 'Trace quality refers to the quality of the existing metadata in spans/traces.',
      heuristicScoreInfo: [
        {
          description: 'Single paragraph description for this heuristic.',
          name: 'HasMeaningfulEndpointName',
          evalTimestamp: '1658434128',
          score: 70.0,
          sampleIds: ['5dea74f41f728fd91c7', '5dea74asdas1'],
          sampleType: 'span',
          sampleSize: '1000',
          failureCount: '200'
        },
        {
          description: 'Single paragraph description for this heuristic.',
          name: 'HasUniqueClientSpans',
          evalTimestamp: '1658434286',
          score: 25.0,
          sampleIds: ['95ea74f41f728fd91c7', 'asddea74asdas1'],
          sampleType: 'span',
          sampleSize: '1000',
          failureCount: '250'
        }
      ]
    },
    {
      name: 'Completeness',
      score: 30.0,
      description: 'Trace completeness refers to the quality of the existing metadata in spans/traces.',
      heuristicScoreInfo: [
        {
          description: 'Single paragraph description for this heuristic.',
          name: 'HasNoTokens',
          evalTimestamp: '1658434128',
          score: 60.0,
          sampleIds: ['m5dea7728fd91c7', 'n1235dea74asdas1'],
          sampleType: 'span',
          sampleSize: '100',
          failureCount: '90'
        }
      ]
    },
    {
      name: 'Security',
      score: 70.0,
      description: 'Trace security refers to the quality of the existing metadata in spans/traces.',
      heuristicScoreInfo: [
        {
          description: 'Single paragraph description for this heuristic.',
          name: 'HasNoTokens',
          evalTimestamp: '1658434128',
          score: 70.0,
          sampleIds: ['m5dea7728fd91c7', 'n1235dea74asdas1'],
          sampleType: 'span',
          sampleSize: '100',
          failureCount: '30'
        },
        {
          description: 'Single paragraph description for this heuristic.',
          name: 'SecondHeuristic',
          evalTimestamp: '1658434128',
          score: 50.0,
          sampleIds: ['m5dea7728fd91c7', 'n1235dea74asdas1'],
          sampleType: 'span',
          sampleSize: '100',
          failureCount: '50'
        },
        {
          description:
            'Single paragraph description for this heuristic. Single paragraph description for this heuristic. Single paragraph description for this heuristic.',
          name: 'ThirdHeuristic',
          evalTimestamp: '1658434128',
          score: 30.0,
          sampleIds: ['m5dea7728fd91c8', 'n1235dea74asdas1'],
          sampleType: 'trace',
          sampleSize: '100',
          failureCount: '70'
        }
      ]
    },
    {
      name: 'Noise',
      score: 90.0,
      description: 'Trace noise refers to the quality of the existing metadata in spans/traces.',
      heuristicScoreInfo: [
        {
          description: 'Single paragraph description for this heuristic.',
          name: 'HasNoTokens',
          evalTimestamp: '1658434128',
          score: 90.0,
          sampleIds: ['m5dea7728fd91c7', 'n1235dea74asdas1'],
          sampleType: 'span',
          sampleSize: '100',
          failureCount: '10'
        },
        {
          description: 'Single paragraph description for this heuristic.',
          name: 'SecondHeuristic',
          evalTimestamp: '1658434128',
          score: -1.0,
          sampleIds: ['m5dea7728fd91c7', 'n1235dea74asdas1'],
          sampleType: 'span',
          sampleSize: '100',
          failureCount: '90'
        }
      ]
    }
  ],
  aggregatedWeightedScore: 60.5
};

export const orgScoreResponse: OrgScoreResponse = {
  heuristicClassScoreInfo: [
    {
      name: 'Quality',
      score: 72.5
    },
    {
      name: 'Completeness',
      score: 50.0
    },
    {
      name: 'Security',
      score: 82.5
    },
    {
      name: 'Noise',
      score: 32.5
    }
  ],
  aggregatedWeightedScore: 40.5
};
