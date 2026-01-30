import { ProjectItem } from "../types/Project.js";
import { Subject, Task } from "../types/ProjectItemInterfaces.js";
import { ErrorInfo } from "./ResponseUtil/ResponseFormat.js";
import { ValidationBuilder } from "./Validation/ValidationBuilder.js";
import { ValidationContext } from "./Validation/ValidationContext.js";

export const parseProject = (data:any):ProjectItem => {
  console.log('data');
  console.log(data);
  const pj:ProjectItem = {
    projectId:data.projectId,
    name:data.name,
    startDt:data.startDt,
    endDt:data.endDt,
    client:data.client,
    subjects:[]
  }

  if(Array.isArray(data.subjects)){
    data.subjects.forEach((sj:any) => {
      const subject = new Subject(sj.name, sj.startDt, sj.endDt, sj.status, sj.subjectId, sj.leader)
      if(Array.isArray(sj.tasks)){
        sj.tasks.forEach((t:any) => {
          const task = new Task(t.name, t.startDt, t.endDt, t.status, subject.subjectId, t.taskId, t.manager)
          subject.addItem(task)
        })
      }
      pj.subjects.push(subject)
    })
  }
  return pj
}

export const addProjectValidator = (pj:ProjectItem, v:ValidationContext) => {
  v.add(new ValidationBuilder(pj.projectId, 'プロジェクトID', 'projectId').require())
  v.add(new ValidationBuilder(pj.name, 'プロジェクト名', 'projectName').require().length(1, 30))
  v.add(new ValidationBuilder(pj.client, '依頼者', 'client').length(0, 30))
  v.add(new ValidationBuilder(pj.startDt, 'プロジェクト開始日', 'pjStartDt').require())
  v.add(new ValidationBuilder(pj.endDt, 'プロジェクト終了日', 'pjEndDt').require())
}

export const addSubjectValidator = (sj:Subject, v:ValidationContext) => {
  v.add(new ValidationBuilder(sj.name, '課題', 'sjName').require().length(1, 30))
  v.add(new ValidationBuilder(sj.subjectId, '課題ID', 'sjId').require())
  v.add(new ValidationBuilder(sj.startDt, '課題開始日', 'sjStartDt').require())
  v.add(new ValidationBuilder(sj.endDt, '課題終了日', 'sjEndDt'))
  v.add(new ValidationBuilder(sj.status, '課題状況', 'sjStatus'))
  v.add(new ValidationBuilder(sj.leader, 'リーダー', 'leader').require())
}

export const addTaskValidator = (t:Task, v:ValidationContext, sjId:string) => {
  v.add(new ValidationBuilder(t.taskId, 'タスクID', 'tId').require())
  v.add(new ValidationBuilder(t.name, 'タスク名', 'tName').require().length(1, 30))
  v.add(new ValidationBuilder(t.subjectId, '課題ID', 'sjId').require())
  v.add(new ValidationBuilder(t.startDt, 'タスク開始日', 'tStartDt').require())
  v.add(new ValidationBuilder(t.endDt, 'タスク終了日', 'tEndDt'))
  v.add(new ValidationBuilder(t.status, 'タスク状態', 'tStatus'))
  v.add(new ValidationBuilder(t.manager, '担当者', 'manager').require())
}

export const toObjProject = (data:any):ProjectItem => {
  const pj:ProjectItem = {
    projectId:data.sk.split('@')[2],
    name:data.name,
    startDt:data.startDt,
    endDt:data.endDt,
    client:data.client,
    subjects:[]
  }
  return pj;
}