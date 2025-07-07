package com.example.instaclone_backend.dto;

import lombok.Data;

@Data
public class UserDto {
    private Long id;
    private String username;
    private String fullName;
    private String bio;
    private String profilePicture;
    private Integer followersCount;
    private Integer followingCount;
    private Integer postsCount;
    private Boolean isFollowing;
} 