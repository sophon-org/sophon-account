import { DynamicWidget, useDynamicContext } from "@dynamic-labs/sdk-react-core";
import clsx from "clsx";

type ViewProps = React.ComponentProps<typeof DynamicWidget>;

interface Props {
  variant?: ViewProps["variant"];
  label?: ViewProps["innerButtonComponent"];
  className?: string;
  containerClassName?: string;
}

export const SophonWidget: React.FC<Props> = ({
  variant,
  label,
  className,
  containerClassName,
}) => {
  const { sdkHasLoaded } = useDynamicContext();
  if (!sdkHasLoaded) {
    return (
      <div className={clsx("sophon-widget-container", containerClassName)}>
        <button
          className={clsx("sophon-loading-state", "sophon-widget", className)}
          disabled
        >
          Loading...
        </button>
      </div>
    );
  }

  return (
    <DynamicWidget
      variant={variant}
      innerButtonComponent={label}
      buttonClassName={className}
      buttonContainerClassName={containerClassName}
    />
  );
};
