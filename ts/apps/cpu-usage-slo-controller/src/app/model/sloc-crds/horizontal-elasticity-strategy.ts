import { SlocCRD } from './sloc-crd';
import { SloComplianceElasticityStrategyData } from './slo-compliance-elasticity-strategy-data';

export interface HorizontalElasticityStrategySpec extends SloComplianceElasticityStrategyData { }

export interface HorizontalElasticityStrategy extends SlocCRD<'HorizontalElasticityStrategy', HorizontalElasticityStrategySpec> { }
