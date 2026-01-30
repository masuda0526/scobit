export interface IProjectItem<T extends IProjectItem<Task>>{
  readonly name:string;
  readonly startDt:string;
  readonly endDt:string;
  readonly status:string;
  readonly subjectId:string;
  isSubject():boolean;
  getItem():IProjectItem<T>;
  addItem?(item:T):void;
  removeItem?(item:T):void;
  getChildItem?():readonly T[];
}

export class Task implements IProjectItem<Task>{
  constructor(
    public readonly name:string,
    public readonly startDt:string,
    public readonly endDt:string,
    public readonly status:string,
    public readonly subjectId:string,
    public readonly taskId:string,
    public readonly manager:string,
  ){}

  isSubject(): boolean {
    return false
  }

  getItem(): IProjectItem<Task> {
    return this;
  }

  getChildItem(): readonly Task[] {
    return []
  }
  addItem(): void{}
  removeItem(): void {}
}

export class Subject implements IProjectItem<Task>{
  private tasks:Task[] = [];
  constructor(
    public readonly name:string,
    public readonly startDt:string,
    public readonly endDt:string,
    public readonly status:string,
    public readonly subjectId:string,
    public readonly leader:string
  ){}

  isSubject(): boolean {
    return true;
  }

  getItem(): IProjectItem<Task> {
    return this;
  }

  addItem(item:Task): void {
    this.tasks.push(item);
  }

  removeItem(item: Task): void {
    const idx = this.tasks.indexOf(item);
    if(idx !== -1){
      this.tasks.splice(idx, 1)
    }
  }

  getChildItem(): Task[] {
    return this.tasks;
  }
}