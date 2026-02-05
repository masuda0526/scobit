import type { ReactNode } from "react";
import styles from "./buttonArea.module.css";

type ButtonAreaPosition = "left" | "center" | "right" | "between" | "around" | "evenly";
type ButtonAreaProps = {
    children: ReactNode;
    position?: ButtonAreaPosition;
} & React.HTMLAttributes<HTMLDivElement>;

export const ButtonArea: React.FC<ButtonAreaProps> = ({ children, position = "center", ...rest }) => {
    return (
        <div className={[styles.buttonArea, styles[position]].join(" ")} {...rest}>
            {children}
        </div>
    );
}