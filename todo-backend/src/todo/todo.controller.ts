import { Controller, Get, Post, Delete, Patch, Body, Param } from '@nestjs/common';
import { TodoService } from './todo.service';

@Controller('todos')
export class TodoController {
  constructor(private readonly todoService: TodoService) {}

  @Get()
  getAll() {
    return this.todoService.getAll();
  }

  @Post()
  add(@Body('text') text: string) {
    return this.todoService.add(text);
  }

  @Delete(':id')
  delete(@Param('id') id: number) {
    return this.todoService.delete(id);
  }

  @Patch(':id')
  toggleComplete(@Param('id') id: number, @Body() body: { completed: boolean }) {
    console.log("Received update request:", body); //  Debugging log
    return this.todoService.toggleComplete(id, body.completed);
  }

  @Patch(':id/edit')
updateText(@Param('id') id: number, @Body() body: { text: string }) {
  console.log("Received update request:", body); // Debugging log
  return this.todoService.updateText(id, body.text);
}

}
