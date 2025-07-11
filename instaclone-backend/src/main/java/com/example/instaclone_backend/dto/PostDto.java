package com.example.instaclone_backend.dto;

import lombok.Data;
import java.time.LocalDateTime;
import java.util.List;

@Data
public class PostDto {
    private Long id;
    private Long userId;
    private String username;
    private String userProfilePicture;
    private String caption;
    private String imageUrl;
    private LocalDateTime createdAt;
    private int likesCount;
    private int commentsCount;
    private Boolean isLiked;
    private List<CommentDto> comments;
} 