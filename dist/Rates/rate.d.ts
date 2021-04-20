import { ChargeSetType, ErrorMessage, RateLineParams, RateSubmissionParamsDeserialized } from './rateTypes';
export declare class RateLineSet {
    rateChargesPerPointOfOrigin: RateLineParams[] | ErrorMessage | 'Invalid Rate Submission.';
    constructor(rateSubmission: RateSubmissionParamsDeserialized);
    invalidChargeSetMessage: (chargeSet: ChargeSetType) => ErrorMessage;
    rateProcessing: (rateSubmission: RateSubmissionParamsDeserialized) => RateLineParams[] | ErrorMessage | 'Invalid Rate Submission.';
    /** FCL Charges Processing */
    fclChargesProcessing: (fclFormSubmission: RateSubmissionParamsDeserialized) => RateLineParams[] | ErrorMessage;
    private static getThcAsPickGridElement;
    private getFclCharges;
    /** LCL Charges Processing*/
    private lclChargesProcessing;
    private getLclCharges;
    /** Air Charges Processing*/
    private airChargesProcessing;
    private getAirCharges;
    toString(): string;
    private keyValueString;
}
