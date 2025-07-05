package com.example.instaclone_backend.dto;

import lombok.Data;
import java.time.LocalDateTime;

@Data
public class UserDto {
    private Long id;
    private String email;
    private String username;
    private String fullName;
    private String bio;
    private String profilePicture;
    private Boolean isPrivate;
    private LocalDateTime createdAt;
    private int followersCount;
    private int followingCount;
    private int postsCount;
    private Boolean isFollowing;
} 