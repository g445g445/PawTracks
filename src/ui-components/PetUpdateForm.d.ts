/***************************************************************************
 * The contents of this file were generated with Amplify Studio.           *
 * Please refrain from making any modifications to this file.              *
 * Any changes to this file will be overwritten when running amplify pull. *
 **************************************************************************/

import * as React from "react";
import { GridProps, SelectFieldProps, TextFieldProps } from "@aws-amplify/ui-react";
import { EscapeHatchProps } from "@aws-amplify/ui-react/internal";
import { Pet } from "../models";
export declare type ValidationResponse = {
    hasError: boolean;
    errorMessage?: string;
};
export declare type ValidationFunction<T> = (value: T, validationResponse: ValidationResponse) => ValidationResponse | Promise<ValidationResponse>;
export declare type PetUpdateFormInputValues = {
    name?: string;
    weight?: number;
    age?: number;
    type?: string;
    breed?: string;
    desc?: string;
};
export declare type PetUpdateFormValidationValues = {
    name?: ValidationFunction<string>;
    weight?: ValidationFunction<number>;
    age?: ValidationFunction<number>;
    type?: ValidationFunction<string>;
    breed?: ValidationFunction<string>;
    desc?: ValidationFunction<string>;
};
export declare type PrimitiveOverrideProps<T> = Partial<T> & React.DOMAttributes<HTMLDivElement>;
export declare type PetUpdateFormOverridesProps = {
    PetUpdateFormGrid?: PrimitiveOverrideProps<GridProps>;
    name?: PrimitiveOverrideProps<TextFieldProps>;
    weight?: PrimitiveOverrideProps<TextFieldProps>;
    age?: PrimitiveOverrideProps<TextFieldProps>;
    type?: PrimitiveOverrideProps<SelectFieldProps>;
    breed?: PrimitiveOverrideProps<TextFieldProps>;
    desc?: PrimitiveOverrideProps<TextFieldProps>;
} & EscapeHatchProps;
export declare type PetUpdateFormProps = React.PropsWithChildren<{
    overrides?: PetUpdateFormOverridesProps | undefined | null;
} & {
    id?: string;
    pet?: Pet;
    onSubmit?: (fields: PetUpdateFormInputValues) => PetUpdateFormInputValues;
    onSuccess?: (fields: PetUpdateFormInputValues) => void;
    onError?: (fields: PetUpdateFormInputValues, errorMessage: string) => void;
    onCancel?: () => void;
    onChange?: (fields: PetUpdateFormInputValues) => PetUpdateFormInputValues;
    onValidate?: PetUpdateFormValidationValues;
} & React.CSSProperties>;
export default function PetUpdateForm(props: PetUpdateFormProps): React.ReactElement;
