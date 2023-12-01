interface Queue {
  queue: number;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;
  callCount: number;
}

interface CurrentQueue {
  id: string;
  queue: number;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;
  callCount: number;
}
