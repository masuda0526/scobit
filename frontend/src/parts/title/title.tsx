import style from "./title.module.css";

export const Title: React.FC<{ text: string }> = ({ text }) => {
    return(
        <h1 className={style.title}>{text}</h1>
    );
}
