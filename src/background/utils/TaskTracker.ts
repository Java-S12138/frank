export class TaskTracker {
  private currentMonth: number;
  private taskCount: number;
  private storageKey: string;

  constructor(storageKey: string = "taskTracker") {
    this.storageKey = storageKey;
    const now = new Date();
    const savedData = this.loadData();

    if (savedData) {
      // 如果有保存的数据，加载并检查月份是否需要重置
      this.currentMonth = savedData.currentMonth;
      this.taskCount = savedData.taskCount;
      this.checkMonth();
    } else {
      // 如果没有保存的数据，初始化
      this.currentMonth = now.getMonth() + 1;
      this.taskCount = 0;
      this.saveData();
    }
  }

  // 保存数据到 localStorage
  private saveData(): void {
    const data = {
      currentMonth: this.currentMonth,
      taskCount: this.taskCount,
    };
    localStorage.setItem(this.storageKey, JSON.stringify(data));
  }

  // 从 localStorage 加载数据
  private loadData(): { currentMonth: number; taskCount: number } | null {
    const data = localStorage.getItem(this.storageKey);
    return data ? JSON.parse(data) : null;
  }

  // 检测当前月份是否变更
  private checkMonth(): void {
    const now = new Date();
    const newMonth = now.getMonth() + 1;

    if (newMonth !== this.currentMonth) {
      this.currentMonth = newMonth;
      this.taskCount = 0; // 如果月份变化，清理数据
      this.saveData();
    }
  }

  // 完成任务的方法
  public completeTask(): void {
    this.checkMonth();

    if (this.taskCount >= 24) {
      return;
    }

    this.taskCount += 1;
    this.saveData();
  }
}
