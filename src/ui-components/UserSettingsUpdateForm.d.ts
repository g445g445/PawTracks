/***************************************************************************
 * The contents of this file were generated with Amplify Studio.           *
 * Please refrain from making any modifications to this file.              *
 * Any changes to this file will be overwritten when running amplify pull. *
 **************************************************************************/

import * as React from "react";
import { GridProps, TextAreaFieldProps } from "@aws-amplify/ui-react";
import { EscapeHatchProps } from "@aws-amplify/ui-react/internal";
import { UserSettings } from "../models";
export declare type ValidationResponse = {
    hasError: boolean;
    errorMessage?: string;
};
export declare type ValidationFunction<T> = (value: T, validationResponse: ValidationResponse) => ValidationResponse | Promise<ValidationResponse>;
export declare type UserSettingsUpdateFormInputValues = {
    settings?: string;
};
export declare type UserSettingsUpdateFormValidationValues = {
    settings?: ValidationFunction<string>;
};
export declare type PrimitiveOverrideProps<T> = Partial<T> & React.DOMAttributes<HTMLDivElement>;
export declare type UserSettingsUpdateFormOverridesProps = {
    UserSettingsUpdateFormGrid?: PrimitiveOverrideProps<GridProps>;
    settings?: PrimitiveOverrideProps<TextAreaFieldProps>;
} & EscapeHatchProps;
export declare type UserSettingsUpdateFormProps = React.PropsWithChildren<{
    overrides?: UserSettingsUpdateFormOverridesProps | undefined | null;
} & {
    id?: string;
    userSettings?: UserSettings;
    onSubmit?: (fields: UserSettingsUpdateFormInputValues) => UserSettingsUpdateFormInputValues;
    onSuccess?: (fields: UserSettingsUpdateFormInputValues) => void;
    onError?: (fields: UserSettingsUpdateFormInputValues, errorMessage: string) => void;
    onChange?: (fields: UserSettingsUpdateFormInputValues) => UserSettingsUpdateFormInputValues;
    onValidate?: UserSettingsUpdateFormValidationValues;
} & React.CSSProperties>;
export default function UserSettingsUpdateForm(props: UserSettingsUpdateFormProps): React.ReactElement;
