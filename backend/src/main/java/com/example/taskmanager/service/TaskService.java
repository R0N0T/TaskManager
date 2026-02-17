package com.example.taskmanager.service;

import com.example.taskmanager.model.Task;
import com.example.taskmanager.model.TaskStatus;
import com.example.taskmanager.repository.TaskRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class TaskService {

    @Autowired
    private TaskRepository taskRepository;

    @Autowired
    private SimpMessagingTemplate messagingTemplate;

    public List<Task> getTasksByUserId(Long userId) {
        return taskRepository.findByUserId(userId);
    }

    public Task createTask(Task task) {
        Task savedTask = taskRepository.save(task);
        // Broadcast creation
        messagingTemplate.convertAndSend("/topic/tasks/" + task.getUserId(), savedTask);
        return savedTask;
    }

    public Task updateTask(Long id, Task taskDetails) {
        Optional<Task> taskOptional = taskRepository.findById(id);
        if (taskOptional.isPresent()) {
            Task task = taskOptional.get();
            task.setTitle(taskDetails.getTitle());
            task.setDescription(taskDetails.getDescription());
            task.setPriority(taskDetails.getPriority());
            task.setDueDate(taskDetails.getDueDate());
            // Status might be updated here or via specific method
            task.setStatus(taskDetails.getStatus());

            Task updatedTask = taskRepository.save(task);
            messagingTemplate.convertAndSend("/topic/tasks/" + task.getUserId(), updatedTask);
            return updatedTask;
        }
        return null;
    }

    public Task updateTaskStatus(Long id, TaskStatus status) {
        Optional<Task> taskOptional = taskRepository.findById(id);
        if (taskOptional.isPresent()) {
            Task task = taskOptional.get();
            task.setStatus(status);
            Task updatedTask = taskRepository.save(task);
            // Broadcast update
            messagingTemplate.convertAndSend("/topic/tasks/" + task.getUserId(), updatedTask);
            return updatedTask;
        }
        return null;
    }

    public void deleteTask(Long id) {
        taskRepository.findById(id).ifPresent(task -> {
            taskRepository.delete(task);
            // Broadcast deletion (sending separate event or just null/id could handle
            // client side)
            // For simplicity, we might implement a specific delete event wrapper or let
            // client handle disappearance if we sent list.
            // Better to send a delete event.
            messagingTemplate.convertAndSend("/topic/tasks/" + task.getUserId() + "/delete", id);
        });
    }
}
