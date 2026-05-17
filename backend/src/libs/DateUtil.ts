export class DateUtil{
  static getSysDate():Date{
    return new Date();
  }

  static equal(target1:Date, compareDate:Date){
    return target1.getTime() === compareDate.getTime();
  }

  static equalDate(target1:Date, compareDate:Date){
    return target1.toDateString() === compareDate.toDateString();
  }

  static before(target:Date, compareDate:Date){
    return target < compareDate;
  }

  static after(target:Date, compareDate:Date){
    return compareDate < target;
  }

  static beforeEqual(target:Date, compareDate:Date){
    return this.before(target, compareDate) || this.equal(target, compareDate);
  }

  static afterEqual(target:Date, compareDate:Date){
    return this.after(target, compareDate) || this.equal(target, compareDate);
  }

  static between(target:Date, before:Date, after:Date, isAllowBeforeEqual=true, isAllowAfterEqual = true){
    const lowerCheck = isAllowAfterEqual?this.beforeEqual(target, after):this.before(target, after);

    const upperCheck = isAllowBeforeEqual?this.afterEqual(target, before):this.after(target, before);

    return lowerCheck && upperCheck;
  }

  static getStartDate(target:Date){
    return new Date(
      target.getFullYear(),
      target.getMonth(),
      target.getDate(),
      0,0,0,0
    )
  }

  static addDate(date:Date, addDay:number){
    const result = new Date(date);
    result.setDate(result.getDate() + addDay);
    return result;
  }
}