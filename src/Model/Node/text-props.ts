export interface TextProps {
  color?: string;
  backgroundColor?: string;
  fontSize?: number;
  fontWeight?: number;
  fontStyle?: string;
  bold?: boolean;
  italic?: boolean;
  [props: string]: unknown;
}
