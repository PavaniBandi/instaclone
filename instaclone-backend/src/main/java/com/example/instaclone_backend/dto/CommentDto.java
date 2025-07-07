package com.example.instaclone_backend.dto;

import lombok.Data;
import java.time.LocalDateTime;

@Data
public class CommentDto {
    private Long id;
    private Long userId;
    private String username;
    private String userProfilePicture;
    private String content;
    private LocalDateTime createdAt;
} 