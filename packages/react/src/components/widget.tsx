import { DynamicWidget, useDynamicContext } from "@dynamic-labs/sdk-react-core";
import styles from "./widget.module.css";
import { cn } from "../utils";

type ViewProps = React.ComponentProps<typeof DynamicWidget>;

interface Props {
  variant: ViewProps["variant"];
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
      <div className={cn("sophon-widget-container", containerClassName)}>
        <button
          className={cn(styles.loadingState, "sophon-widget", className)}
          disabled
        >
          Loading...
        </button>
      </div>
    );
  }

  return (
    <>
      <DynamicWidget
        variant={variant}
        innerButtonComponent={label}
        buttonClassName={cn("sophon-widget", className)}
        buttonContainerClassName={cn(
          "sophon-widget-container",
          containerClassName
        )}
      />
    </>
  );
};
