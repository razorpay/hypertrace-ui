import { Dictionary } from '@hypertrace/common';
import { EnumPropertyTypeInstance, ENUM_TYPE } from '@hypertrace/dashboards';
import { Model, ModelProperty, UNKNOWN_PROPERTY } from '@hypertrace/hyperdash';
import { MetricAggregationType } from '../../../../graphql/model/metrics/metric-aggregation';
import {
  ExploreSpecification,
  ExploreValue
} from '../../../../graphql/model/schema/specifications/explore-specification';
import { ExploreSpecificationBuilder } from '../../../../graphql/request/builders/specification/explore/explore-specification-builder';
import { AttributeExpression } from './../../../../graphql/model/attribute/attribute-expression';
import { SpecificationModel } from './specification.model';

@Model({
  type: 'explore-selection',
  displayName: 'Explore Selection'
})
export class ExploreSelectionSpecificationModel
  extends SpecificationModel<ExploreSpecification>
  implements ExploreSpecification {
  @ModelProperty({
    key: 'metric',
    displayName: 'Metric',
    type: UNKNOWN_PROPERTY.type,
    required: true
  })
  public metric!: string | AttributeExpression;

  @ModelProperty({
    key: 'aggregation',
    displayName: 'Aggregation',
    required: false,
    // tslint:disable-next-line: no-object-literal-type-assertion
    type: {
      key: ENUM_TYPE.type,
      values: [
        MetricAggregationType.Average,
        MetricAggregationType.P99,
        MetricAggregationType.P95,
        MetricAggregationType.P90,
        MetricAggregationType.P50,
        MetricAggregationType.Min,
        MetricAggregationType.Max,
        MetricAggregationType.Sum,
        MetricAggregationType.AvgrateMinute,
        MetricAggregationType.AvgrateSecond,
        MetricAggregationType.Count,
        MetricAggregationType.DistinctCount
      ]
    } as EnumPropertyTypeInstance
  })
  public aggregation?: MetricAggregationType;

  protected buildInnerSpec(): ExploreSpecification {
    if (typeof this.metric === 'string') {
      return new ExploreSpecificationBuilder().exploreSpecificationForKey(this.metric, this.aggregation);
    }

    return new ExploreSpecificationBuilder().exploreSpecificationForAttributeExpression(this.metric, this.aggregation);
  }

  public extractFromServerData(resultContainer: Dictionary<ExploreValue>): ExploreValue {
    return this.innerSpec.extractFromServerData(resultContainer);
  }
}
