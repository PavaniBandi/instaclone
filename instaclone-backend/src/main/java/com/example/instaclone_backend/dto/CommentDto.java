package com.example.instaclone_backend.dto;

import lombok.Data;
import java.time.LocalDateTime;

@Data
public class CommentDto {
    private Long id;
    private UserDto user;
    private String content;
    private LocalDateTime createdAt;
} 