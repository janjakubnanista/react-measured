import { View, Image, Text, TextInput, ImageProps, TextProps, TextInputProps, ViewProps } from 'react-native';

export const components = {
  Image: Image as React.ComponentType<ImageProps>,
  Text: Text as React.ComponentType<TextProps>,
  TextInput: TextInput as React.ComponentType<TextInputProps>,
  View: View as React.ComponentType<ViewProps>,
};

export type MeasurableComponentName = keyof typeof components;
export type Measurable = typeof components[MeasurableComponentName];
