// src/components/global/ActionButton.tsx
import { Button, ButtonProps, Spinner } from "@heroui/react";
import { ReactNode } from "react";

interface ActionButtonProps extends Omit<ButtonProps, 'children' | 'variant'> {
  onPress: () => void;
  icon?: ReactNode;
  children: ReactNode;
  loading?: boolean;
  variant?: 'primary' | 'secondary' | 'tertiary' | 'outline' | 'ghost' | 'danger';
}

export const ActionButton = ({
  onPress,
  icon,
  children,
  loading = false,
  variant = 'primary',
  isDisabled,
  className = '',
  ...rest
}: ActionButtonProps) => {
  // Mapeo de variantes a clases personalizadas
  const getVariantClasses = () => {
    switch (variant) {
      case 'primary':
        return 'bg-[var(--color-primary)] text-white hover:bg-[var(--color-primary-hover)]';
      case 'ghost':
        return 'border border-[var(--color-primary)] text-[var(--color-primary)] bg-transparent hover:bg-[var(--color-primary)]/10';
      case 'danger':
        return 'bg-danger text-white';
      case 'outline':
        return 'border border-default-200 bg-transparent';
      default:
        return 'bg-default-100 text-default-800';
    }
  };

  return (
    <Button
      onPress={onPress}
      isDisabled={loading || isDisabled}
      isPending={loading}
      className={`${getVariantClasses()} ${className}`}
      {...rest}
    >
      {loading ? <Spinner size="sm" color="current" /> : (
        <>
          {icon && <span className="mr-1">{icon}</span>}
          {children}
        </>
      )}
    </Button>
  );
};