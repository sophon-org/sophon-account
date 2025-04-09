import { DynamicEmbeddedWidget } from "@dynamic-labs/sdk-react-core";

type ViewProps = React.ComponentProps<typeof DynamicEmbeddedWidget>;

interface Props {
  background?: ViewProps["background"];
  className?: string;
  style?: ViewProps["style"];
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
