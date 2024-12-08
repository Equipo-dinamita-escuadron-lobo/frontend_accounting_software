/**
 * UnitOfMeasure model
 */
export interface UnitOfMeasure {
    /**
     * UnitOfMeasure id
     * @example 1
     */
    id: number; 
    /**
     * UnitOfMeasure name
     * @example 'UnitOfMeasure 1'
     */
    name: string; 
    /**
     * UnitOfMeasure abbreviation
     * @example 'UOM1'
     */
    abbreviation: string; 
    /**
     * UnitOfMeasure description
     * @example 'UnitOfMeasure 1 description'
     */
    description: string; 
    /**
     * Enterprise id
     * @example '1'
     */
    enterpriseId:string;
    /**
     * UnitOfMeasure state
     * @example 'active'
     */
    state : string;
  }
  