// src/components/global/ActionButton.tsx
import { Button } from "@heroui/react";
import { ReactNode } from "react";

interface Props {
  onPress: () => void;
  icon?: ReactNode;
  children: ReactNode;
  color?: "primary" | "danger" | "secondary";
  variant?: "solid" | "ghost";
}

export const ActionButton = ({ onPress, icon, children, variant = "solid" }: Props) => {
  return (
    <Button
      onPress={onPress}
      className={`${variant === "solid" ? "bg-primary text-white" : "border-primary text-primary"} shrink-0`}
    >
      {icon && <span className="mr-1">{icon}</span>}
      {children}
    </Button>
  );
};