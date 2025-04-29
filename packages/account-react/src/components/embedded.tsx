import { DynamicEmbeddedWidget } from "@dynamic-labs/sdk-react-core";

type ViewProps = React.ComponentProps<typeof DynamicEmbeddedWidget>;

interface Props {
  background?: ViewProps["background"] | null;
  className?: string | null;
  style?: ViewProps["style"] | null;
}

export const SophonEmbeddedWidget = ({
  background,
  className,
  style,
}: Props) => {
  return (
    <DynamicEmbeddedWidget
      style={style}
      background={background}
      className={className}
    />
  );
};
