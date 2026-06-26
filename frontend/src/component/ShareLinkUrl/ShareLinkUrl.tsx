import { faCopy } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import style from './ShareLinkUrl.module.css';
import type React from "react";
import { useState } from "react";


type Prop = {
  shareUrl : string;
  label?:string;
}&React.HTMLAttributes<HTMLDivElement>

export const ShareLinkUrl : React.FC<Prop> = ({
  shareUrl,
  label = '共有用URL',
  ...prop
}) => {
  const [msg, setMsg] = useState<string>('コピーします');
  const [isHover, setHover] = useState<boolean>(false);
  const [isOnEndClass, setOnEndClass] = useState<boolean>(false);

  const onOver = () => {
    setHover(true);
    setOnEndClass(true);
  }
  const onLeave = () => {
    setHover(false);
    setMsg('コピーします');
  }
  const copyToClipBoard = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setMsg('コピーしました');
      setHover(true);
      setTimeout(() => {
        setHover(false)
      }, 3000)
    } catch (error) {
      console.log(error);
    }
  }
  return (
    <div className={style.container} {...prop}>
      <div className={style.box}>
        <p className={style.url}>
          {shareUrl}
        </p>
      </div>
      <div className={style.icon_box}>
        <FontAwesomeIcon 
          icon={faCopy} 
          className={style.icon} 
          onClick={copyToClipBoard} 
          onMouseOver={onOver}
          onMouseLeave={onLeave}
        />
        {isHover?(
          <div className={[style.msg, isOnEndClass?style.msg_end:''].join(' ')}>{msg}</div>
        ):''}
      </div>
      <p className={style.label}>{label}</p>
    </div>
  )
}