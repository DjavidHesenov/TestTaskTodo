import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Todo } from './entities/todo.entity';

@Injectable()
export class TodoService {
  constructor(@InjectRepository(Todo) private todoRepo: Repository<Todo>) {}

  async getAll() {
    return this.todoRepo.find();
  }

  async add(text: string) {
    const newTodo = this.todoRepo.create({ text });
    return this.todoRepo.save(newTodo);
  }

  async delete(id: number) {
    return this.todoRepo.delete(id);
  }

  async toggleComplete(id: number, completed: boolean) {
    if (completed === undefined) {
      throw new Error("Missing update values");
    }
    return this.todoRepo.update(id, { completed });
  }
  
  async updateText(id: number, newText: string) {
    if (!newText.trim()) {
      throw new Error("Text cannot be empty");
    }
    return this.todoRepo.update(id, { text: newText });
  }
  
}
