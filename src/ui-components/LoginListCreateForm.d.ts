/***************************************************************************
 * The contents of this file were generated with Amplify Studio.           *
 * Please refrain from making any modifications to this file.              *
 * Any changes to this file will be overwritten when running amplify pull. *
 **************************************************************************/

import * as React from "react";
import { GridProps, TextFieldProps } from "@aws-amplify/ui-react";
import { EscapeHatchProps } from "@aws-amplify/ui-react/internal";
export declare type ValidationResponse = {
    hasError: boolean;
    errorMessage?: string;
};
export declare type ValidationFunction<T> = (value: T, validationResponse: ValidationResponse) => ValidationResponse | Promise<ValidationResponse>;
export declare type LoginListCreateFormInputValues = {
    UID?: string;
};
export declare type LoginListCreateFormValidationValues = {
    UID?: ValidationFunction<string>;
};
export declare type PrimitiveOverrideProps<T> = Partial<T> & React.DOMAttributes<HTMLDivElement>;
export declare type LoginListCreateFormOverridesProps = {
    LoginListCreateFormGrid?: PrimitiveOverrideProps<GridProps>;
    UID?: PrimitiveOverrideProps<TextFieldProps>;
} & EscapeHatchProps;
export declare type LoginListCreateFormProps = React.PropsWithChildren<{
    overrides?: LoginListCreateFormOverridesProps | undefined | null;
} & {
    clearOnSuccess?: boolean;
    onSubmit?: (fields: LoginListCreateFormInputValues) => LoginListCreateFormInputValues;
    onSuccess?: (fields: LoginListCreateFormInputValues) => void;
    onError?: (fields: LoginListCreateFormInputValues, errorMessage: string) => void;
    onChange?: (fields: LoginListCreateFormInputValues) => LoginListCreateFormInputValues;
    onValidate?: LoginListCreateFormValidationValues;
} & React.CSSProperties>;
export default function LoginListCreateForm(props: LoginListCreateFormProps): React.ReactElement;
