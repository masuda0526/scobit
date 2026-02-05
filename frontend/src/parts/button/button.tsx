import styles from "./button.module.css";
import React from "react";

type ButtonVariant = "primary" | "secondary" | "danger";
type ButtonSize = "sm" | "md" | "lg";
type isRadius = "isRadius" | "noRadius";

type ButtonProps = {
    label:string;
    variant?: ButtonVariant;
    size?: ButtonSize;
    isRadius?: isRadius;
} & React.ButtonHTMLAttributes<HTMLButtonElement>;

export const Button:React.FC<ButtonProps> = ({
    variant = "primary",
    size = "sm",
    isRadius = "noRadius",
    label,
    ...props
}) => {
    return (
        <button
            {...props}
            className={[styles.button, styles[variant], styles[size], styles[isRadius]].join(" ")}
        >
            {label}
        </button>
    );
}
