import { Subject } from "./ProjectItemInterfaces.js";

export interface ProjectRegist {
  pk:string, 
  sk:string,
}

export interface ProjectData{
  pk:string, // プロジェクトID
  sk:string, // プロジェクトID@DATA
  data:Subject[]
}

export interface ProjectInfo{
  pk:string, // ユーザーID
  sk:string, // ユーザーID@PROJECT@projectId
  name:string;
  startDt:string;
  endDt:string;
  client:string;
}

export interface ProjectItem {
  projectId:string;
  name:string;
  startDt:string;
  endDt:string;
  client:string;
  subjects:Subject[]
}