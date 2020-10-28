import { SloComplianceElasticityStrategyData } from './slo-compliance-elasticity-strategy-data';
import { SlocCRD } from './sloc-crd';

export interface HorizontalElasticityStrategySpec extends SloComplianceElasticityStrategyData { }

export interface HorizontalElasticityStrategy extends SlocCRD<'HorizontalElasticityStrategy', HorizontalElasticityStrategySpec> { }
